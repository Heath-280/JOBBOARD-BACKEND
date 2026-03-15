const Application = require("../models/Application");
const Job = require("../models/job");

const applyToJob = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        console.log("USER:", req.user);
        console.log("PARAMS:", req.params);
        const jobId = req.params.jobId; // ✅ fixed - was req.body.jobId
        const { coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.status === "closed") {
            return res.status(400).json({ message: "This job is no longer accepting applications" });
        }

        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied to this job" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Resume is required" });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: req.file.path,
            coverLetter: coverLetter || ""
        });

        res.status(201).json({ message: "Application submitted successfully", application });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate({
                path: "job",
                select: "title location jobType status salary",
                populate: {
                    path: "company",
                    select: "name logo"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ count: applications.length, applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getApplicationsByJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not allowed to view applications for this job" });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate("applicant", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: applications.length, applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate("applicant", "name email")
            .populate({
                path: "job",
                select: "title location jobType postedBy",
                populate: { path: "company", select: "name logo" }
            });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const isApplicant = application.applicant._id.toString() === req.user._id.toString();
        const isRecruiter = application.job.postedBy.toString() === req.user._id.toString(); // ✅ no second DB call needed
        const isAdmin = req.user.role === "admin";

        if (!isApplicant && !isRecruiter && !isAdmin) {
            return res.status(403).json({ message: "You are not allowed to view this application" });
        }

        res.status(200).json({ application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ["pending", "reviewed", "shortlisted", "rejected"];
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of ${allowedStatuses.join(", ")}` });
        }

        const application = await Application.findById(req.params.id).populate("job");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // ✅ use populated job directly, no second DB call needed
        if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not allowed to update this application" });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ message: `Application ${status}`, application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate("job");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (
            application.applicant.toString() !== req.user._id.toString() &&
            application.job.postedBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "You are not allowed to delete this application" });
        }

        if (application.status === "shortlisted") {
            return res.status(400).json({ message: "You cannot delete a shortlisted application" });
        }

        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    applyToJob,
    getMyApplications,
    getApplicationsByJob,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication
};