import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateCompany() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleLogoChange(e) {
        const file = e.target.files[0];
        setLogo(file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("website", website);
            if (logo) formData.append("logo", logo);

            await API.post("/companies", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to create company";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Create Company</h1>
                <p className="text-gray-400">Register your company to start posting jobs</p>
            </div>

            {error && (
                <div className="bg-red-900 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-2xl p-8 space-y-6">

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Company Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Google, Microsoft"
                        className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Tell applicants about your company..."
                        className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Website
                    </label>
                    <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourcompany.com"
                        className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                        Company Logo <span className="text-gray-500">(JPG/PNG, max 2MB)</span>
                    </label>
                    <div className="bg-gray-800 border border-gray-600 border-dashed rounded-lg p-6 text-center">
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="w-24 h-24 object-cover rounded-xl mx-auto mb-2"
                                />
                            ) : (
                                <p className="text-5xl mb-2">🏢</p>
                            )}
                            <p className="text-gray-400 text-sm">
                                {logo ? logo.name : "Click to upload company logo"}
                            </p>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                    >
                        {loading ? "Creating..." : "Create Company"}
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

export default CreateCompany;