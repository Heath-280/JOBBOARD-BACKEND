import { useState, useEffect } from "react";
import API from "../services/api";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await API.get("/auth/me");
                setUser(res.data.user);
                setName(res.data.user.name);
            } catch (error) {
                console.error(error);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    async function handleUpdate(e) {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setUpdating(true);

        try {
            const res = await API.put("/auth/update", {
                name,
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined
            });

            const storedUser = JSON.parse(localStorage.getItem("user"));
            localStorage.setItem("user", JSON.stringify({ ...storedUser, name: res.data.user.name }));

            setUser(res.data.user);
            setSuccessMessage("Profile updated successfully!");
            setEditMode(false);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to update profile";
            setError(msg);
        } finally {
            setUpdating(false);
        }
    }

    const roleColors = {
        applicant: "bg-blue-900 text-blue-300",
        recruiter: "bg-purple-900 text-purple-300",
        admin: "bg-red-900 text-red-300"
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your account details</p>
            </div>

            {successMessage && (
                <div className="bg-green-900 border border-green-600 text-green-300 px-4 py-3 rounded-lg mb-6">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Avatar and basic info */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                        <p className="text-gray-400">{user?.email}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize mt-2 inline-block ${roleColors[user?.role]}`}>
                            {user?.role}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-700">
                    <div>
                        <p className="text-gray-400 text-sm">Member Since</p>
                        <p className="text-white font-medium">
                            {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Account Role</p>
                        <p className="text-white font-medium capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            {!editMode ? (
                <button
                    onClick={() => setEditMode(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                    ✏️ Edit Profile
                </button>
            ) : (
                <form onSubmit={handleUpdate} className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-5">
                    <h2 className="text-xl font-bold text-white mb-2">Edit Profile</h2>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="border-t border-gray-700 pt-5">
                        <p className="text-gray-400 text-sm mb-4">Leave password fields empty if you don't want to change it</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                        >
                            {updating ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditMode(false);
                                setError("");
                                setCurrentPassword("");
                                setNewPassword("");
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Profile;