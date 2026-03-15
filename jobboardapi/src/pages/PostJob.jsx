import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function PostJob() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("full-time");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await API.post("/jobs", {
                title,
                description,
                requirements,
                salary: Number(salary),
                location,
                jobType
            });
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to post job";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Post a Job</h1>
                <p className="text-gray-400">Fill in the details to attract the right candidates</p>
            </div>

            {error && (
                <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Job Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="e.g. Senior Frontend Developer"
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
                        placeholder="Describe the role, responsibilities and what you're looking for..."
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
                        placeholder="e.g. 3+ years React experience, Node.js knowledge..."
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
                            placeholder="e.g. 800000"
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
                            placeholder="e.g. Mumbai, Remote"
                            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Job Type <span className="text-red-400">*</span>
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

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                    >
                        {loading ? "Posting..." : "Post Job"}
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

export default PostJob;