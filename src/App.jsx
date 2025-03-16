import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext.jsx";
import StudentHomePage from "./pages/homepage/StudentHomePage.jsx";
import InstructorHomePage from "./pages/homepage/InstructorHomePage.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import LoginPage from "./pages/loginpage/LoginPage.jsx";
import RegisterPage from "./pages/registerpage/RegisterPage.jsx";
import SubjectPage from "./pages/subject/SubjectPage.jsx";
import SessionPage from "./pages/sessionpage/SessionPage.jsx";
import SettingsPage from "./pages/settings/SettingsPage.jsx";
import NewSubject from "./pages/newsubjectpage/NewSubjectPage.jsx";
import InstructorProfilePage from "./pages/profilepage/InstructorProfilePage.jsx";
import StudentProfilePage from "./pages/profilepage/StudentProfilePage.jsx";
import RegisterSuccessPage from "./pages/registersuccesspage/RegisterSuccessPage.jsx";
import EmailConfirmationSuccessPage from "./pages/mailconformationsuccesspage/MailConfirmationSuccessPage.jsx";
import SessionDetailsPage from "./pages/sessiondetailspage/SessionDetailsPage.jsx";

const AppContent = () => {
    const { isLoggedIn, isInstructor, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return (
        <Router>
            <div>
                {isLoggedIn && <Navbar />}
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/subject/:subjectName" element={<SubjectPage />} />
                    <Route path="/home" element={isInstructor ? <InstructorHomePage /> : <StudentHomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/my-sessions" element={<SessionPage />} />
                    <Route path="/profile" element={isInstructor ? <InstructorProfilePage /> : <StudentProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/new" element={<NewSubject />} />
                    <Route path="/register-success" element={<RegisterSuccessPage />} />
                    <Route path="/confirm-email-success" element={<EmailConfirmationSuccessPage />} />
                    <Route path="/session/:id" element={<SessionDetailsPage />} />
                </Routes>
            </div>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
