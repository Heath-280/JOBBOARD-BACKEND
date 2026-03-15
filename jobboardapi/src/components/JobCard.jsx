import { Link } from "react-router-dom";

function JobCard({ job }) {
    const jobTypeColors = {
        "full-time": "bg-green-900 text-green-300",
        "part-time": "bg-yellow-900 text-yellow-300",
        "contract": "bg-purple-900 text-purple-300",
        "internship": "bg-blue-900 text-blue-300"
    };

    return (
        <div className="bg-gray-900 border border-gray-700 hover:border-blue-500 rounded-xl p-6 mb-4 transition group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition mb-1">
                        {job.title}
                    </h2>
                    {job.company && (
                        <p className="text-gray-400 text-sm">{job.company.name}</p>
                    )}
                </div>

                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${jobTypeColors[job.jobType] || "bg-gray-700 text-gray-300"}`}>
                    {job.jobType}
                </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <span>📍 {job.location}</span>
                <span>💰 ₹{job.salary.toLocaleString()}</span>
                <span className={`font-medium ${job.status === "open" ? "text-green-400" : "text-red-400"}`}>
                    ● {job.status === "open" ? "Open" : "Closed"}
                </span>
            </div>

            <Link
                to={`/jobs/${job._id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
            >
                View Details →
            </Link>
        </div>
    );
}

export default JobCard;