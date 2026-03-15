const express = require("express");

const router = express.Router();

const {applyToJob,
    getMyApplications,
    getApplicationsByJob,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication} = require("../controllers/applicationController");
const {protect} = require("../middleware/authMiddleware");
const {authorizeRoles} = require("../middleware/roleMiddleware");
const {uploadResume} = require("../config/multer");

router.post("/:jobId/apply", protect, authorizeRoles("applicant"), uploadResume.single("resume"), applyToJob);
router.get("/my", protect, authorizeRoles("applicant"), getMyApplications);
router.delete("/:id", protect , authorizeRoles("applicant","recruiter","admin"), deleteApplication);

router.get("/job/:jobId", protect, authorizeRoles("recruiter","admin"), getApplicationsByJob);
router.get("/:id", protect, authorizeRoles("applicant","recruiter","admin"), getApplicationById);
router.put("/:id/status", protect, authorizeRoles("recruiter","admin"), updateApplicationStatus);


module.exports = router;