import { useState, useEffect } from "react";
import API from "../services/api";
import JobCard from "../components/JobCard";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, [page]);

    async function fetchJobs() {
        setLoading(true);
        try {
            const params = {};
            if (search) params.keyword = search;
            if (location) params.location = location;
            if (jobType) params.jobType = jobType;
            if (minSalary) params.minSalary = minSalary;
            if (maxSalary) params.maxSalary = maxSalary;
            params.page = page;
            params.limit = 6;

            const res = await API.get("/jobs", { params });
            setJobs(res.data.jobs);
            setTotalPages(res.data.totalPages);
            setTotalJobs(res.data.totalJobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        fetchJobs();
    }

    function handleReset() {
        setSearch("");
        setLocation("");
        setJobType("");
        setMinSalary("");
        setMaxSalary("");
        setPage(1);
        fetchJobs();
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold text-white mb-8">Available Jobs</h1>

            {/* Search Filters */}
            <form onSubmit={handleSearch} className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by title or keyword"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />

                    <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    >
                        <option value="">All Job Types</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="number"
                        placeholder="Min Salary (₹)"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />

                    <input
                        type="number"
                        placeholder="Max Salary (₹)"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </form>

            {/* Results count */}
            {!loading && (
                <p className="text-gray-400 mb-6">
                    Showing <span className="text-white font-semibold">{jobs.length}</span> of{" "}
                    <span className="text-white font-semibold">{totalJobs}</span> jobs
                </p>
            )}

            {/* Job List */}
            {loading ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">Loading jobs...</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 border border-gray-700 rounded-xl">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-400 text-lg">No jobs found matching your search</p>
                </div>
            ) : (
                jobs.map((job) => <JobCard key={job._id} job={job} />)
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-lg transition"
                    >
                        ← Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-lg transition font-semibold ${
                                page === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-lg transition"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

export default Jobs;