import { Link } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isRecruiter = user?.role === "recruiter" || user?.role === "admin";
    const isApplicant = user?.role === "applicant";

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    }

    return (
        <nav className="bg-gray-900 border-b border-gray-700 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-400 tracking-tight">
                    Job<span className="text-white">Board</span>
                </Link>

                {/* Links */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
                    <Link to="/jobs" className="text-gray-300 hover:text-white transition">Jobs</Link>

                    {token && isApplicant && (
                        <Link to="/my-applications" className="text-gray-300 hover:text-white transition">
                            My Applications
                        </Link>
                    )}

                    {token && isRecruiter && (
                        <Link to="/create-company" className="text-gray-300 hover:text-white transition">
                            Create Company
                        </Link>
                    )}

                    {token && isRecruiter && (
                        <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                            Dashboard
                        </Link>
                    )}

                    {token && user?.role === "admin" && (
                        <Link to="/admin" className="text-gray-300 hover:text-white transition">
                            Admin Panel
                        </Link>
                    )}

                    {token && (
                        <Link to="/profile" className="text-gray-300 hover:text-white transition">
                            Profile
                        </Link>
                    )}

                    {!token && (
                        <Link to="/login" className="text-gray-300 hover:text-white transition">
                            Login
                        </Link>
                    )}

                    {!token && (
                        <Link
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Register
                        </Link>
                    )}

                    {token && (
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;