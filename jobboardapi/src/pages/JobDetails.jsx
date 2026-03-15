import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function JobDetails() {
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isApplicant = user?.role === "applicant";

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await API.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [id]);

    async function handleApply() {
        if (!resume) {
            setMessage("Please select a resume PDF file");
            setMessageType("error");
            return;
        }

        setApplying(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("resume", resume);
            formData.append("coverLetter", coverLetter);

            await API.post(`/applications/${id}/apply`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMessage("Application submitted successfully!");
            setMessageType("success");
            setResume(null);
            setCoverLetter("");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to apply";
            setMessage(msg);
            setMessageType("error");
        } finally {
            setApplying(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Job not found</p>
            </div>
        );
    }

    const jobTypeColors = {
        "full-time": "bg-green-900 text-green-300",
        "part-time": "bg-yellow-900 text-yellow-300",
        "contract": "bg-purple-900 text-purple-300",
        "internship": "bg-blue-900 text-blue-300"
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">

            {/* Job Header */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                        {job.company && (
                            <p className="text-blue-400 font-medium text-lg">{job.company.name}</p>
                        )}
                    </div>
                    <span className={`text-sm font-semibold px-4 py-2 rounded-full ${jobTypeColors[job.jobType] || "bg-gray-700 text-gray-300"}`}>
                        {job.jobType}
                    </span>
                </div>

                {/* Job Meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">Location</p>
                        <p className="text-white font-semibold">📍 {job.location}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">Salary</p>
                        <p className="text-white font-semibold">💰 ₹{job.salary.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">Job Type</p>
                        <p className="text-white font-semibold">💼 {job.jobType}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-400 text-xs mb-1">Status</p>
                        <p className={`font-semibold ${job.status === "open" ? "text-green-400" : "text-red-400"}`}>
                            ● {job.status === "open" ? "Open" : "Closed"}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-3">Job Description</h2>
                    <p className="text-gray-300 leading-relaxed">{job.description}</p>
                </div>

                {/* Requirements */}
                {job.requirements && (
                    <div>
                        <h2 className="text-xl font-bold text-white mb-3">Requirements</h2>
                        <p className="text-gray-300 leading-relaxed">{job.requirements}</p>
                    </div>
                )}
            </div>

            {/* Apply Section - only for applicants */}
            {isApplicant && job.status === "open" && (
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Apply for this Job</h2>

                    {message && (
                        <div className={`px-4 py-3 rounded-lg mb-6 ${
                            messageType === "success"
                                ? "bg-green-900 border border-green-600 text-green-300"
                                : "bg-red-900 border border-red-600 text-red-300"
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Cover Letter <span className="text-gray-500">(optional)</span>
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows={4}
                                placeholder="Tell the employer why you're a great fit..."
                                className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Resume <span className="text-red-400">*</span>{" "}
                                <span className="text-gray-500">(PDF only)</span>
                            </label>
                            <div className="bg-gray-800 border border-gray-600 border-dashed rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label htmlFor="resume-upload" className="cursor-pointer">
                                    <p className="text-4xl mb-2">📄</p>
                                    <p className="text-gray-400 mb-1">
                                        {resume ? resume.name : "Click to upload your resume"}
                                    </p>
                                    <p className="text-gray-600 text-sm">PDF files only, max 5MB</p>
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleApply}
                            disabled={applying}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                        >
                            {applying ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                </div>
            )}

            {/* Job closed message */}
            {job.status === "closed" && (
                <div className="bg-gray-900 border border-red-800 rounded-2xl p-8 text-center">
                    <p className="text-4xl mb-3">🔒</p>
                    <p className="text-red-400 text-lg font-semibold">This job is no longer accepting applications</p>
                </div>
            )}

            {/* Not logged in message */}
            {!user && (
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center">
                    <p className="text-gray-400 text-lg mb-4">Please login to apply for this job</p>
                    <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
                        Login to Apply
                    </a>
                </div>
            )}
        </div>
    );
}

export default JobDetails;