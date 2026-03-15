import { Link } from "react-router-dom";

function Home() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-8 py-24 text-center">
                <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                    Find Your <span className="text-blue-400">Dream Job</span>
                </h1>
                <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                    Browse thousands of job listings from top companies. Your next career move starts here.
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/jobs"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
                    >
                        Browse Jobs
                    </Link>

                    {!user && (
                        <Link
                            to="/register"
                            className="border border-gray-500 hover:border-white text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h2 className="text-4xl font-bold text-blue-400 mb-2">1000+</h2>
                        <p className="text-gray-400 text-lg">Jobs Available</p>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-blue-400 mb-2">500+</h2>
                        <p className="text-gray-400 text-lg">Companies Hiring</p>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-blue-400 mb-2">10k+</h2>
                        <p className="text-gray-400 text-lg">Successful Placements</p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose JobBoard?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
                        <p className="text-gray-400">Filter jobs by location, salary, job type and more to find exactly what you're looking for.</p>
                    </div>
                    <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 text-center">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-semibold mb-3">Easy Apply</h3>
                        <p className="text-gray-400">Apply to jobs with just your resume in seconds. Track all your applications in one place.</p>
                    </div>
                    <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 text-center">
                        <div className="text-4xl mb-4">🏢</div>
                        <h3 className="text-xl font-semibold mb-3">Top Companies</h3>
                        <p className="text-gray-400">Connect with leading companies actively looking for talented professionals like you.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-700 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to find your next job?</h2>
                <p className="text-blue-100 mb-8 text-lg">Join thousands of job seekers who found their dream job on JobBoard</p>
                <Link
                    to="/register"
                    className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition"
                >
                    Create Free Account
                </Link>
            </div>

        </div>
    );
}

export default Home;