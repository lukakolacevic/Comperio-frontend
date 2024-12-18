import { useState } from "react";
import {
  Button,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

import "./RegisterPage.css";
import { handlerRegister } from "../../api/AuthApi";

import { useEffect } from "react";

import { getSubjects } from "../../api/SubjectApi";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

function RegisterPage() {
  const [showStudentForm, setShowStudentForm] = useState(true);

  const [studentName, setStudentName] = useState("");
  const [studentSurname, setStudentSurname] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");
  const [studentProfilePicture, setStudentProfilePicture] = useState(null);

  const [instructorName, setInstructorName] = useState("");
  const [instructorSurname, setInstructorSurname] = useState("");
  const [instructorEmail, setInstructorEmail] = useState("");
  const [instructorPassword, setInstructorPassword] = useState("");
  const [instructorConfirmPassword, setInstructorConfirmPassword] = useState("");
  const [instructorProfilePicture, setInstructorProfilePicture] = useState(null);
  //const [instructorSubjects, setInstructorSubjects] = useState([]);

  const handleStudentSubmit = async (event) => {
    event.preventDefault();

    // Prepare the data to be sent
    const studentData = new FormData();
    studentData.append("name", studentName);
    studentData.append("surname", studentSurname);
    studentData.append("email", studentEmail);
    studentData.append("password", studentPassword);
    studentData.append("confirmPassword", studentConfirmPassword);
    studentData.append("profilePicture", studentProfilePicture);

    console.log(studentData);

    // Send the data to the server
    handlerRegister(studentData, 1);
  };

  const handleInstructorSubmit = async (event) => {
    event.preventDefault();

    const instructorData = new FormData();
    instructorData.append("name", instructorName);
    instructorData.append("surname", instructorSurname);
    instructorData.append("email", instructorEmail);
    instructorData.append("password", instructorPassword);
    instructorData.append("confirmPassword", instructorConfirmPassword);
    instructorData.append("profilePicture", instructorProfilePicture);
   // instructorSubjects.forEach((subject) => {
     // instructorData.append("subjects", subject.url);
    //});


    // Assuming instructorData is your FormData object
    


    handlerRegister(instructorData, 2);
  };

  const handleStudentImageChange = (event) => {
    setStudentProfilePicture(event.target.files[0]);
  };

  const handleInstructorImageChange = (event) => {
    setInstructorProfilePicture(event.target.files[0]);
  };

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getSubjects().then((response) => setSubjects(response.subjects));
  }, []);


  return (
    <>
      {showStudentForm ? (
        <div className="register-wrapper">
          <div className="register-container">
            <h1>Registracija studenta</h1>
            <form onSubmit={handleStudentSubmit}>
              <div className="register-form">
                <InputLabel htmlFor="name">Ime</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="surname">Prezime</InputLabel>
                <OutlinedInput
                  id="surname"
                  type="text"
                  value={studentSurname}
                  onChange={(e) => setStudentSurname(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/email-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="password">Lozinka</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="confirmPassword">
                  Potvrdi Lozinku
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  type="password"
                  value={studentConfirmPassword}
                  onChange={(e) => setStudentConfirmPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="profilePicture">
                  Profilna fotografija
                </InputLabel>
                <OutlinedInput
                  id="profilePicture"
                  type="file"
                  onChange={handleStudentImageChange}
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                style={{ marginRight: "1rem" }}
              >
                Registriraj se
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setStudentName("");
                  setStudentSurname("");
                  setStudentEmail("");
                  setStudentPassword("");
                  setStudentConfirmPassword("");
                  setStudentProfilePicture(null);
                }}
              >
                Odbaci
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowStudentForm(!showStudentForm)}
              >
                Registriraj se kao {showStudentForm ? "instruktor" : "student"}?
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="login-wrapper">
          <div className="login-container">
            <h1>Registracija profesora</h1>
            <form onSubmit={handleInstructorSubmit}>
              <div className="register-form">
                <InputLabel htmlFor="name">Ime</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="surname">Prezime</InputLabel>
                <OutlinedInput
                  id="surname"
                  type="text"
                  value={instructorSurname}
                  onChange={(e) => setInstructorSurname(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  value={instructorEmail}
                  onChange={(e) => setInstructorEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/email-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="password">Lozinka</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  value={instructorPassword}
                  onChange={(e) => setInstructorPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="confirmPassword">
                  Potvrdi Lozinku
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  type="password"
                  value={instructorConfirmPassword}
                  onChange={(e) => setInstructorConfirmPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/password-icon.svg"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                />

                <InputLabel htmlFor="profilePicture">
                  Profilna fotografija
                </InputLabel>
                <OutlinedInput
                  id="profilePicture"
                  type="file"
                  onChange={handleInstructorImageChange}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                style={{ marginRight: "1rem" }}
              >
                Registriraj se
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setInstructorName("");
                  setInstructorSurname("");
                  setInstructorEmail("");
                  setInstructorPassword("");
                  setInstructorConfirmPassword("");
                  setInstructorProfilePicture(null);
                }}
              >
                Odbaci
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowStudentForm(!showStudentForm)}
              >
                Registriraj se kao {showStudentForm ? "instruktor" : "student"}?
              </Button>
            </form>
          </div>
        </div>
      )}
      <div className="login-wrapper">
        <div className="login-container" style={{ flexDirection: "row" }}>

        </div>
      </div>
    </>
  );
}

export default RegisterPage;
