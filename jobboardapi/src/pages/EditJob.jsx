import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("full-time");
    const [status, setStatus] = useState("open");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await API.get(`/jobs/${id}`);
                const job = res.data.job;
                setTitle(job.title);
                setDescription(job.description);
                setRequirements(job.requirements || "");
                setSalary(job.salary);
                setLocation(job.location);
                setJobType(job.jobType);
                setStatus(job.status);
            } catch (error) {
                console.error(error);
                setError("Failed to load job");
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [id]);

    async function handleUpdate(e) {
        e.preventDefault();
        setError("");
        setUpdating(true);

        try {
            await API.put(`/jobs/${id}`, {
                title,
                description,
                requirements,
                salary: Number(salary),
                location,
                jobType,
                status
            });
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to update job";
            setError(msg);
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Loading job...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Edit Job</h1>
                <p className="text-gray-400">Update your job posting details</p>
            </div>

            {error && (
                <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdate} className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Job Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Job Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={5}
                        className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Requirements
                    </label>
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        rows={4}
                        className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Salary (₹) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Location <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Job Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["full-time", "part-time", "contract", "internship"].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setJobType(type)}
                                className={`py-3 rounded-lg border font-medium capitalize transition ${
                                    jobType === type
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Job Status
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setStatus("open")}
                            className={`py-3 rounded-lg border font-medium transition ${
                                status === "open"
                                    ? "bg-green-600 border-green-600 text-white"
                                    : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                            }`}
                        >
                            🔓 Open
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus("closed")}
                            className={`py-3 rounded-lg border font-medium transition ${
                                status === "closed"
                                    ? "bg-red-600 border-red-600 text-white"
                                    : "bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400"
                            }`}
                        >
                            🔒 Closed
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                    >
                        {updating ? "Updating..." : "Update Job"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditJob;