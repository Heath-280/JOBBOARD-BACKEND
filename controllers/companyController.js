const Company = require("../models/Company");

const createCompany = async (req,res) => {
    try{
        const {name,description,website} = req.body;
        if(!name){
            return res.status(400).json({message:"All credentials are required"});
        }

        const existing = await Company.findOne({name});
        if(existing){
            return res.status(409).json({message:"Comapny with these name already exists"});
        }

        const company = await Company.create({
            name,
            description,
            website,
            createdBy: req.user._id,
            logo: req.file ? req.file.path : undefined
        });

        return res.status(201).json({message:"Company created Successfully",company});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server error"});
    }
};

const getAllCompanies = async (req,res) =>{
    try{
        const companies = await Company.find().populate("createdBy","name email");
        res.status(200).json({count:companies.length,companies});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getCompanyById = async (req,res) => {
    try{
        const company = await Company.findById(req.params.id).populate("createdBy","name email");
        if(!company){
            return res.status(404).json({message: "Company not found"});
        }
        res.status(200).json({company});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

// ✅ NEW - Get only the logged-in recruiter's companies
const getMyCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ createdBy: req.user._id });
        res.status(200).json({ count: companies.length, companies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateCompany = async (req,res) => {
    try{
        const company = await Company.findById(req.params.id);
        if(!company){
            return res.status(404).json({message: "Company not found"});
        }

        if(company.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            return res.status(403).json({message: "You are not allowed to update this company"});
        }

        const updated = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true , runValidators: true}
        );

        res.status(200).json({message: "Company updated successfully",company:updated});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const deleteCompany = async (req,res) => {
    try{
        const company = await Company.findById(req.params.id);
        if(!company){
            return res.status(404).json({message: "Company not found"});
        }

        await company.deleteOne();
        res.status(200).json({message: "Company deleted successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = { createCompany, getAllCompanies, getCompanyById, getMyCompanies, updateCompany, deleteCompany };