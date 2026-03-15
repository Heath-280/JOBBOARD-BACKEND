const express = require("express");
const router = express.Router();
const {createCompany, getAllCompanies, getCompanyById, getMyCompanies, updateCompany, deleteCompany} = require("../controllers/companyController");
const {protect} = require("../middleware/authMiddleware");
const {authorizeRoles} = require("../middleware/roleMiddleware");
const {uploadLogo} = require("../config/multer.js");

router.get("/", getAllCompanies);
router.get("/mycompanies", protect, getMyCompanies); // ✅ MUST be before /:id
router.get("/:id", getCompanyById);
router.post("/", protect, authorizeRoles("recruiter","admin"), uploadLogo.single("logo"), createCompany);
router.put("/:id", protect, authorizeRoles("recruiter","admin"), uploadLogo.single("logo"), updateCompany);
router.delete("/:id", protect, authorizeRoles("recruiter","admin"), deleteCompany);

module.exports = router;