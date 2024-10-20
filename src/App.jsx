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
import ProfilePage from './pages/profilepage/ProfilePage.jsx'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subject/:subjectName" element={<SubjectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-sessions" element={<SessionPage />} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/ping" element={<PingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/new" element={<NewSubject />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
