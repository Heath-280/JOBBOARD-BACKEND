const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);

// ✅ Admin only routes
router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ count: users.length, users });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/users/:id", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/users/:id/role", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ["applicant", "recruiter", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Role updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;