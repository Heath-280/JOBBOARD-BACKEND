const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./init/db");

dotenv.config();

const app = express();

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
    "http://localhost:5173",
    "https://jobbard-frontend.vercel.app",
    "https://jobbard-frontend-6g1f.vercel.app",
    process.env.CLIENT_URL
];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


//routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

app.get("/", (req,res) =>{
    res.send("JOB board API is running");
});

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});


app.use((err, req, res, next) => {
    console.error(err.stack);

    // multer error (wrong file type)
    if (err.message === "Only PDF files are allowed" || err.message === "Only JPG and PNG images are allowed") {
        return res.status(400).json({ message: err.message });
    }

    // mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(", ") });
    }

    // mongoose bad ObjectId (e.g. /api/jobs/invalidid)
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});