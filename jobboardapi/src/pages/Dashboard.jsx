import { useState, useEffect } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMyJobs() {
            try {
                const res = await API.get("/jobs/myjobs");
                setJobs(res.data.jobs);
            } catch (error) {
                console.error(error);
                setError("Failed to load your jobs");
            } finally {
                setLoading(false);
            }
        }
        fetchMyJobs();
    }, []);

    async function handleDelete(jobId) {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await API.delete(`/jobs/${jobId}`);
            setJobs((prev) => prev.filter((job) => job._id !== jobId));
        } catch (error) {
            console.error(error);
            alert("Failed to delete job");
        }
    }

    async function handleStatusToggle(job) {
        const newStatus = job.status === "open" ? "closed" : "open";
        try {
            await API.put(`/jobs/${job._id}/status`, { status: newStatus });
            setJobs((prev) =>
                prev.map((j) =>
                    j._id === job._id ? { ...j, status: newStatus } : j
                )
            );
        } catch (error) {
            console.error(error);
            alert("Failed to update job status");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Loading your jobs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage your job postings</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/create-company"
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg transition"
                    >
                        + Create Company
                    </Link>
                    <Link
                        to="/post-job"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                    >
                        + Post New Job
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-blue-400">{jobs.length}</p>
                    <p className="text-gray-400 mt-1">Total Jobs</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-green-400">
                        {jobs.filter(j => j.status === "open").length}
                    </p>
                    <p className="text-gray-400 mt-1">Open Jobs</p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-red-400">
                        {jobs.filter(j => j.status === "closed").length}
                    </p>
                    <p className="text-gray-400 mt-1">Closed Jobs</p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Jobs List */}
            {jobs.length === 0 ? (
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-16 text-center">
                    <p className="text-5xl mb-4">📋</p>
                    <p className="text-gray-400 text-lg mb-6">You haven't posted any jobs yet</p>
                    <Link
                        to="/post-job"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                    >
                        Post Your First Job
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="bg-gray-900 border border-gray-700 rounded-xl p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <span>📍 {job.location}</span>
                                        <span>💼 {job.jobType}</span>
                                        <span>💰 ₹{job.salary?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                    job.status === "open"
                                        ? "bg-green-900 text-green-300"
                                        : "bg-red-900 text-red-300"
                                }`}>
                                    {job.status === "open" ? "● Open" : "● Closed"}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to={`/job-applications/${job._id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                >
                                    👥 View Applicants
                                </Link>

                                <button
                                    onClick={() => navigate(`/edit-job/${job._id}`)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    onClick={() => handleStatusToggle(job)}
                                    className={`text-white text-sm font-semibold px-4 py-2 rounded-lg transition ${
                                        job.status === "open"
                                            ? "bg-orange-600 hover:bg-orange-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {job.status === "open" ? "🔒 Close Job" : "🔓 Reopen Job"}
                                </button>

                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;