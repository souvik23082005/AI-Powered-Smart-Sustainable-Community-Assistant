import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy Loading Components for Performance Optimization (Phase 13)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const ComplaintForm = lazy(() => import("./pages/ComplaintForm"));
const AdminComplaints = lazy(() => import("./pages/AdminComplaints"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const CarbonCalculator = lazy(() => import("./pages/CarbonCalculator"));
const CarbonHistory = lazy(() => import("./pages/CarbonHistory"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const Leaderboard = lazy(() => import("./pages/Leaderboard")); // Phase 10

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/report" element={<ComplaintForm />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/carbon" element={<CarbonCalculator />} />
          <Route path="/carbon-history" element={<CarbonHistory />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
