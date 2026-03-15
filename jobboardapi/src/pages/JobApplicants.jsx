import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function JobApplicants() {

    const { jobId } = useParams();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function fetchApplicants() {

            try {

                const res = await API.get(`/applications/job/${jobId}`);

                const data = res.data.applications || res.data;

                setApplications(Array.isArray(data) ? data : []);

            } catch (error) {

                console.error(error);
                setError("Failed to load applicants");

            } finally {

                setLoading(false);

            }
        }

        fetchApplicants();

    }, [jobId]);


    async function handleStatusUpdate(applicationId, status) {

        try {

            await API.put(`/applications/${applicationId}/status`, { status });

            setApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId ? { ...app, status } : app
                )
            );

        } catch (error) {

            console.error(error);
            alert("Failed to update status");

        }
    }


    const statusColors = {
        pending: "bg-yellow-900 text-yellow-300",
        reviewed: "bg-blue-900 text-blue-300",
        shortlisted: "bg-green-900 text-green-300",
        rejected: "bg-red-900 text-red-300"
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Loading applicants...</p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-5xl mb-4">⚠️</p>
                    <p className="text-red-400 text-lg">{error}</p>

                    <Link
                        to="/dashboard"
                        className="mt-4 inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg transition"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>
            </div>
        );
    }


    return (

        <div className="max-w-4xl mx-auto px-6 py-10">

            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Applicants</h1>
                    <p className="text-gray-400">
                        {applications.length} application(s) received
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg transition"
                >
                    ← Back to Dashboard
                </Link>

            </div>


            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                {["pending", "reviewed", "shortlisted", "rejected"].map((status) => (

                    <div
                        key={status}
                        className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center"
                    >

                        <p className="text-2xl font-bold text-white">
                            {applications.filter((a) => a.status === status).length}
                        </p>

                        <p className="text-gray-400 text-sm capitalize mt-1">
                            {status}
                        </p>

                    </div>

                ))}

            </div>


            {applications.length === 0 ? (

                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-16 text-center">

                    <p className="text-5xl mb-4">👥</p>
                    <p className="text-gray-400 text-lg">
                        No applicants yet for this job
                    </p>

                </div>

            ) : (

                <div className="space-y-4">

                    {applications.map((app) => (

                        <div
                            key={app._id}
                            className="bg-gray-900 border border-gray-700 rounded-xl p-6"
                        >

                            <div className="flex justify-between items-start mb-4">

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {app.applicant?.name}
                                    </h3>

                                    <p className="text-gray-400 text-sm">
                                        {app.applicant?.email}
                                    </p>
                                </div>

                                <span
                                    className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${statusColors[app.status]}`}
                                >
                                    {app.status}
                                </span>

                            </div>


                            {app.coverLetter && (

                                <div className="bg-gray-800 rounded-lg p-4 mb-4">

                                    <p className="text-gray-400 text-xs font-medium mb-1">
                                        COVER LETTER
                                    </p>

                                    <p className="text-gray-300 text-sm">
                                        {app.coverLetter}
                                    </p>

                                </div>

                            )}


                            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-700">

                                {/* Resume Link */}
                                {app.resume && (

                                    <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                    >
                                        📄 View Resume
                                    </a>

                                )}


                                <div className="flex gap-2 flex-wrap">

                                    <button
                                        onClick={() => handleStatusUpdate(app._id, "reviewed")}
                                        disabled={app.status === "reviewed"}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                    >
                                        👀 Reviewed
                                    </button>

                                    <button
                                        onClick={() => handleStatusUpdate(app._id, "shortlisted")}
                                        disabled={app.status === "shortlisted"}
                                        className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                    >
                                        ✅ Shortlist
                                    </button>

                                    <button
                                        onClick={() => handleStatusUpdate(app._id, "rejected")}
                                        disabled={app.status === "rejected"}
                                        className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                    >
                                        ❌ Reject
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default JobApplicants;