import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCompany from "./pages/CreateCompany";
import Profile from "./pages/Profile";
import EditJob from "./pages/EditJob"; 
import MyApplications from "./pages/MyApplications";
import AdminPanel from "./pages/AdminPanel"; 
import JobApplicants from "./pages/JobApplicants";
import PostJob from "./pages/PostJob";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";


function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected - any logged in user */}
                    <Route path="/my-applications" element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    } />

                    {/* Protected - recruiter only */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/post-job" element={
                        <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                            <PostJob />
                        </ProtectedRoute>
                    } />
                    <Route path="/job-applications/:jobId" element={
                        <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                            <JobApplicants />
                        </ProtectedRoute>
                    } />
                    <Route path="/create-company" element={
                      <ProtectedRoute allowedRoles={["recruiter","admin"]}>
                        <CreateCompany/>
                      </ProtectedRoute>
                    } />
                    <Route path="/edit-job/:id" element={
                     <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                       <EditJob />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                     <ProtectedRoute>
                       <Profile />
                       </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                     <ProtectedRoute allowedRoles={["admin"]}>
                       <AdminPanel />
                      </ProtectedRoute>
                    } />

                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;