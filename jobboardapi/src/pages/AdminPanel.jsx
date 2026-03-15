import { useState, useEffect } from "react";
import API from "../services/api";

function AdminPanel() {
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    async function fetchData() {
        setLoading(true);
        setError("");
        try {
            if (activeTab === "users") {
                const res = await API.get("/auth/users");
                setUsers(res.data.users);
            } else if (activeTab === "jobs") {
                const res = await API.get("/jobs");
                setJobs(res.data.jobs);
            }
        } catch (error) {
            console.error(error);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteUser(userId) {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await API.delete(`/auth/users/${userId}`);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (error) {
            console.error(error);
            alert("Failed to delete user");
        }
    }

    async function handleRoleChange(userId, newRole) {
        try {
            const res = await API.put(`/auth/users/${userId}/role`, { role: newRole });
            setUsers((prev) =>
                prev.map((u) => u._id === userId ? { ...u, role: res.data.user.role } : u)
            );
        } catch (error) {
            console.error(error);
            alert("Failed to update role");
        }
    }

    async function handleDeleteJob(jobId) {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await API.delete(`/jobs/${jobId}`);
            setJobs((prev) => prev.filter((j) => j._id !== jobId));
        } catch (error) {
            console.error(error);
            alert("Failed to delete job");
        }
    }

    const roleColors = {
        applicant: "bg-blue-900 text-blue-300",
        recruiter: "bg-purple-900 text-purple-300",
        admin: "bg-red-900 text-red-300"
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
                <p className="text-gray-400">Manage users and jobs across the platform</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-900 border border-gray-700 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                        activeTab === "users"
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    👥 Users
                </button>
                <button
                    onClick={() => setActiveTab("jobs")}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                        activeTab === "jobs"
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    💼 Jobs
                </button>
            </div>

            {error && (
                <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">Loading...</p>
                </div>
            ) : (
                <>
                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <div>
                            <p className="text-gray-400 mb-6">
                                Total Users: <span className="text-white font-bold">{users.length}</span>
                            </p>

                            <div className="space-y-4">
                                {users.map((user) => (
                                    <div
                                        key={user._id}
                                        className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{user.name}</p>
                                                <p className="text-gray-400 text-sm">{user.email}</p>
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize mt-1 inline-block ${roleColors[user.role]}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="applicant">Applicant</option>
                                                <option value="recruiter">Recruiter</option>
                                                <option value="admin">Admin</option>
                                            </select>

                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Jobs Tab */}
                    {activeTab === "jobs" && (
                        <div>
                            <p className="text-gray-400 mb-6">
                                Total Jobs: <span className="text-white font-bold">{jobs.length}</span>
                            </p>

                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="text-white font-bold text-lg mb-1">{job.title}</h3>
                                            <div className="flex gap-4 text-sm text-gray-400">
                                                <span>📍 {job.location}</span>
                                                <span>💼 {job.jobType}</span>
                                                <span className={job.status === "open" ? "text-green-400" : "text-red-400"}>
                                                    ● {job.status}
                                                </span>
                                            </div>
                                            {job.postedBy && (
                                                <p className="text-gray-500 text-sm mt-1">
                                                    Posted by: {job.postedBy.name}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminPanel;