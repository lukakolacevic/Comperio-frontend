import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import Navbar from './components/navbar/Navbar.jsx';
import LoginPage from './pages/loginpage/LoginPage.jsx';
import RegisterPage from './pages/registerpage/RegisterPage.jsx';
import SubjectPage from './pages/subject/SubjectPage.jsx';
import SessionPage from './pages/sessionpage/SessionPage.jsx';
import PingPage from './pages/pages/PingPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import NewSubject from './pages/newsubjectpage/NewSubjectPage.jsx';
import InstructorProfilePage from './pages/profilepage/InstructorProfilePage.jsx'
import StudentProfilePage from './pages/profilepage/StudentProfilePage.jsx'
import RegisterSuccessPage from './pages/registersuccesspage/RegisterSuccessPage.jsx';
import EmailConfirmationSuccessPage from "./pages/mailconformationsuccesspage/MailConfirmationSuccessPage.jsx"


function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user; // true if user exists, false if not
  const isInstructor = isLoggedIn && user.status === "instructor";
  const isStudent = isLoggedIn && user.status === "student";

  return (
    <Router>
      <div>
        {isLoggedIn && <Navbar/>}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subject/:subjectName" element={<SubjectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-sessions" element={<SessionPage />} />
          <Route path="/profile" element={isInstructor ? <InstructorProfilePage /> : <StudentProfilePage />} />
          <Route path="/ping" element={<PingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/new" element={<NewSubject />} />
          <Route path="/register-success" element={<RegisterSuccessPage/>}/>
          <Route path="/confirm-email-success" element={<EmailConfirmationSuccessPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
