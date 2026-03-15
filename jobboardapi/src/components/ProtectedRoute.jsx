import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null"); // ✅ get stored user

    if (!token) {
        return <Navigate to="/login" />;
    }

    // ✅ if roles specified, check if user's role is allowed
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;