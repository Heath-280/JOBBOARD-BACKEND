const express = require("express");
const router = express.Router();

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
    updateJobStatus  // ✅ FIXED - was missing before
} = require("../controllers/jobcontroller");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getAllJobs);
router.get("/myjobs", protect, getMyJobs);
router.get("/:id", getJobById);

router.post("/", protect, authorizeRoles("recruiter","admin"), createJob);
router.put("/:id", protect, authorizeRoles("recruiter","admin"), updateJob);
router.delete("/:id", protect, authorizeRoles("recruiter","admin"), deleteJob);
router.put("/:id/status", protect, authorizeRoles("recruiter","admin"), updateJobStatus); // ✅ FIXED - was calling updateJob before

module.exports = router;