const Job = require("../models/Job");

const createJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType } = req.body;

        if (!title || !description || !requirements || !salary || !location || !jobType) {
            return res.status(400).json({ message: "All credentials are required" });
        }

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            postedBy: req.user._id
        });

        res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const {
            keyword,
            location,
            jobType,
            status,
            minSalary,
            maxSalary,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { requirements: { $regex: keyword, $options: "i" } }
            ];
        }
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }
        if (jobType) {
            filter.jobType = jobType;
        }
        if (status) {
            filter.status = status;
        }
        if (minSalary || maxSalary) {
            filter.salary = {};
            if (minSalary) filter.salary.$gte = Number(minSalary);
            if (maxSalary) filter.salary.$lte = Number(maxSalary);
        }

        const jobs = await Job.find(filter)
            .populate("company", "name logo website")
            .populate("postedBy", "name email")
            .skip((page - 1) * limit)
            .limit(limit);

        const totalJobs = await Job.countDocuments(filter);

        res.status(200).json({
            jobs,
            totalJobs,
            page,
            totalPages: Math.ceil(totalJobs / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("company", "name logo website description")
            .populate("postedBy", "name email");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not allowed to update this job" });
        }

        const { postedBy, company, ...safeUpdates } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            safeUpdates,
            { new: true, runValidators: true }
        ).populate("company", "name logo website description");

        res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not allowed to delete this job" });
        }

        await job.deleteOne();
        res.status(200).json({ message: "Job deleted successfully", job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !["open", "closed"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'open' or 'closed'" });
        }

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not allowed to change this job's status" });
        }

        job.status = status;
        await job.save();

        res.status(200).json({ message: `Job marked as ${status}`, job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id })
            .populate("company", "name logo")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: jobs.length, jobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, updateJobStatus, getMyJobs };