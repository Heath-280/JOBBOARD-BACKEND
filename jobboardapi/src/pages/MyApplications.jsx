import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchApplications() {
            try {
                const res = await API.get("/applications/my");
                setApplications(res.data.applications);
            } catch (error) {
                console.error("Error fetching applications", error);
                setError("Failed to load applications");
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    const statusColors = {
        pending: "bg-yellow-900 text-yellow-300",
        reviewed: "bg-blue-900 text-blue-300",
        shortlisted: "bg-green-900 text-green-300",
        rejected: "bg-red-900 text-red-300"
    };

    const statusIcons = {
        pending: "⏳",
        reviewed: "👀",
        shortlisted: "✅",
        rejected: "❌"
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">My Applications</h1>
                <p className="text-gray-400">Track all your job applications</p>
            </div>

            {error && (
                <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {["pending", "reviewed", "shortlisted", "rejected"].map((status) => (
                    <div key={status} className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                            {applications.filter(a => a.status === status).length}
                        </p>
                        <p className="text-gray-400 text-sm capitalize mt-1">
                            {statusIcons[status]} {status}
                        </p>
                    </div>
                ))}
            </div>

            {applications.length === 0 ? (
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-16 text-center">
                    <p className="text-5xl mb-4">📝</p>
                    <p className="text-gray-400 text-lg mb-6">You haven't applied to any jobs yet</p>
                    <Link
                        to="/jobs"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                    >
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            className="bg-gray-900 border border-gray-700 rounded-xl p-6"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {app.job?.title || "Job Deleted"}
                                    </h3>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        {app.job?.location && <span>📍 {app.job.location}</span>}
                                        {app.job?.jobType && <span>💼 {app.job.jobType}</span>}
                                        {app.job?.salary && <span>💰 ₹{app.job.salary.toLocaleString()}</span>}
                                    </div>
                                </div>

                                <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${statusColors[app.status]}`}>
                                    {statusIcons[app.status]} {app.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                <p className="text-gray-500 text-sm">
                                    Applied on {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })}
                                </p>
                                {app.job && (
                                    <Link
                                        to={`/jobs/${app.job._id}`}
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                                    >
                                        View Job →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyApplications;