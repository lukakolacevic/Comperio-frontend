import { Button, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { handleLogin } from "../../api/AuthApi";
import { Message } from 'primereact/message';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import "./LoginPage.css";

function LoginPage() {
  const [showStudentLogIn, setShowStudentLogIn] = useState(true);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [professorEmail, setProfessorEmail] = useState("");
  const [professorPassword, setProfessorPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  function handleStudentSubmit(event) {
    event.preventDefault();
    const data = { email: studentEmail, password: studentPassword };
    (async () => {
      try {
        await handleLogin(data, "student");
      } catch (error) {
        setErrorMessage("Krivi e-mail ili lozinka. Molim vas pokušajte ponovno.");
      }
    })();
  }

  function handleProfessorSubmit(event) {
    event.preventDefault();
    const data = { email: professorEmail, password: professorPassword };
    (async () => {
      try {
        await handleLogin(data, "professor");
      } catch (error) {
        setErrorMessage("Krivi e-mail ili lozinka. Molim vas pokušajte ponovno.");
      }
    })();
  }

  return (
    <div className="login-wrapper">
      <div className="logo">
        {/* Add your logo or image here */}
        <img src="/logo/dotInstrukcije-logo.png" alt = "comperioLogo"/>
      </div>

      <div className="login-container">
        <h1>{showStudentLogIn ? "Prijava studenta" : "Prijava profesora"}</h1>

        {/* Form for student or professor login */}
        <form onSubmit={showStudentLogIn ? handleStudentSubmit : handleProfessorSubmit}>
          <div className="login-form">
            <InputLabel htmlFor="email">E-mail adresa</InputLabel>
            <OutlinedInput
              id="email"
              type="text"
              placeholder="Email"
              value={showStudentLogIn ? studentEmail : professorEmail}
              onChange={(e) => (showStudentLogIn ? setStudentEmail(e.target.value) : setProfessorEmail(e.target.value))}
              startAdornment={
                <InputAdornment position="start">
                  <img src="/icons/email-icon.svg" style={{ height: "15px", width: "15px" }} />
                </InputAdornment>
              }
            />

            <InputLabel htmlFor="password">Lozinka</InputLabel>
            <OutlinedInput
              id="password"
              type="password"
              placeholder="Lozinka"
              value={showStudentLogIn ? studentPassword : professorPassword}
              onChange={(e) => (showStudentLogIn ? setStudentPassword(e.target.value) : setProfessorPassword(e.target.value))}
              startAdornment={
                <InputAdornment position="start">
                  <img src="/icons/password-icon.svg" style={{ height: "15px", width: "15px" }} />
                </InputAdornment>
              }
            />
          </div>

          {/* Form Buttons */}
          <div className="button-container">
            <Button variant="contained" type="submit" style={{ marginRight: "1rem" }}>
              Prijavi se
            </Button>
            <Button
              variant="contained"
              type="button"
              onClick={() => {
                if (showStudentLogIn) {
                  setStudentEmail("");
                  setStudentPassword("");
                } else {
                  setProfessorEmail("");
                  setProfessorPassword("");
                }
              }}
            >
              Odbaci
            </Button>
          </div>
        </form>

        {/* Bottom Buttons (Switch Login and Register) */}
        <div className="bottom-buttons-container">
          <Button variant="contained" onClick={() => setShowStudentLogIn(!showStudentLogIn)}>
            Prijavi se kao {showStudentLogIn ? "professor" : "student"}?
          </Button>
          <Link to="/register">
            <Button variant="contained">Registriraj se</Button>
          </Link>
        </div>

        {/* Error message appears beneath all buttons */}
        {errorMessage && (
          <div className="error-message">
            <Message severity="error" text={errorMessage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
