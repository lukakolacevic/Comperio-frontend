import { useState } from "react";
import {
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Button } from "@/components/shadcn/Button";
import styles from "./RegisterPage.module.css";
import { FileUpload } from "primereact/fileupload";
import { Link } from "react-router-dom";


function RegisterPage() {
  const [showStudentForm, setShowStudentForm] = useState(true);

  const [studentName, setStudentName] = useState("");
  const [studentSurname, setStudentSurname] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");
  const [studentProfilePicture, setStudentProfilePicture] = useState(null);
  const [studentErrors, setStudentErrors] = useState({});

  const [instructorName, setInstructorName] = useState("");
  const [instructorSurname, setInstructorSurname] = useState("");
  const [instructorEmail, setInstructorEmail] = useState("");
  const [instructorPassword, setInstructorPassword] = useState("");
  const [instructorConfirmPassword, setInstructorConfirmPassword] = useState("");
  const [instructorProfilePicture, setInstructorProfilePicture] = useState(null);
  const [instructorErrors, setInstructorErrors] = useState({});

  const handlerRegister = (formData, role) => {
    // role => 1 for Student, 2 for Instructor
    console.log("Form data:", formData);
    console.log("Role:", role === 1 ? "Student" : "Instructor");
  };

  const validateStudentForm = () => {
    const errors = {};
    if (!studentName.trim()) {
      errors.name = "Ime ne smije biti prazno.";
    }
    if (!studentSurname.trim()) {
      errors.surname = "Prezime ne smije biti prazno.";
    }
    if (!studentEmail.includes("@")) {
      errors.email = "Email mora sadržavati '@'.";
    }
    if (!studentPassword) {
      errors.password = "Lozinka ne smije biti prazna.";
    }
    if (studentPassword !== studentConfirmPassword) {
      errors.confirmPassword = "Lozinke se ne poklapaju.";
    }
    return errors;
  };

  const validateInstructorForm = () => {
    const errors = {};
    if (!instructorName.trim()) {
      errors.name = "Ime ne smije biti prazno.";
    }
    if (!instructorSurname.trim()) {
      errors.surname = "Prezime ne smije biti prazno.";
    }
    if (!instructorEmail.includes("@")) {
      errors.email = "Email mora sadržavati '@'.";
    }
    if (!instructorPassword) {
      errors.password = "Lozinka ne smije biti prazna.";
    }
    if (instructorPassword !== instructorConfirmPassword) {
      errors.confirmPassword = "Lozinke se ne poklapaju.";
    }
    return errors;
  };

  const handleStudentSubmit = (event) => {
    event.preventDefault();
    const errors = validateStudentForm();
    if (Object.keys(errors).length > 0) {
      setStudentErrors(errors);
      return;
    }
    setStudentErrors({});

    const studentData = new FormData();
    studentData.append("name", studentName);
    studentData.append("surname", studentSurname);
    studentData.append("email", studentEmail);
    studentData.append("password", studentPassword);
    studentData.append("confirmPassword", studentConfirmPassword);
    studentData.append("profilePicture", studentProfilePicture);

    handlerRegister(studentData, 1);
  };

  const handleInstructorSubmit = (event) => {
    event.preventDefault();
    const errors = validateInstructorForm();
    if (Object.keys(errors).length > 0) {
      setInstructorErrors(errors);
      return;
    }
    setInstructorErrors({});

    const instructorData = new FormData();
    instructorData.append("name", instructorName);
    instructorData.append("surname", instructorSurname);
    instructorData.append("email", instructorEmail);
    instructorData.append("password", instructorPassword);
    instructorData.append("confirmPassword", instructorConfirmPassword);
    instructorData.append("profilePicture", instructorProfilePicture);

    handlerRegister(instructorData, 2);
  };

  return (
    <div className={styles["register-wrapper"]}>
      <div className={styles["register-container"]}>
        <h1>
          {showStudentForm ? "Registracija studenta" : "Registracija instruktora"}
        </h1>

        <form
          onSubmit={showStudentForm ? handleStudentSubmit : handleInstructorSubmit}
        >
          <div className={styles["register-form"]}>
            {/* Name and Surname Fields */}
            <div className={styles["name-fields"]}>
              <div className={styles["form-field"]}>
                <InputLabel htmlFor="name">Ime</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={showStudentForm ? studentName : instructorName}
                  onChange={(e) =>
                    showStudentForm
                      ? setStudentName(e.target.value)
                      : setInstructorName(e.target.value)
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        alt="icon"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                  // <-- HERE: Use MUI's `error` prop to highlight red
                  error={
                    showStudentForm
                      ? Boolean(studentErrors.name)
                      : Boolean(instructorErrors.name)
                  }
                />
                {/* Error message below "Ime" */}
                {showStudentForm && studentErrors.name && (
                  <p className={styles["error-text"]}>{studentErrors.name}</p>
                )}
                {!showStudentForm && instructorErrors.name && (
                  <p className={styles["error-text"]}>{instructorErrors.name}</p>
                )}
              </div>

              <div className={styles["form-field"]}>
                <InputLabel htmlFor="surname">Prezime</InputLabel>
                <OutlinedInput
                  id="surname"
                  type="text"
                  value={showStudentForm ? studentSurname : instructorSurname}
                  onChange={(e) =>
                    showStudentForm
                      ? setStudentSurname(e.target.value)
                      : setInstructorSurname(e.target.value)
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <img
                        src="/icons/person-icon.svg"
                        alt="icon"
                        style={{ height: "15px", width: "15px" }}
                      />
                    </InputAdornment>
                  }
                  error={
                    showStudentForm
                      ? Boolean(studentErrors.surname)
                      : Boolean(instructorErrors.surname)
                  }
                />
                {showStudentForm && studentErrors.surname && (
                  <p className={styles["error-text"]}>{studentErrors.surname}</p>
                )}
                {!showStudentForm && instructorErrors.surname && (
                  <p className={styles["error-text"]}>{instructorErrors.surname}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              type="email"
              value={showStudentForm ? studentEmail : instructorEmail}
              onChange={(e) =>
                showStudentForm
                  ? setStudentEmail(e.target.value)
                  : setInstructorEmail(e.target.value)
              }
              startAdornment={
                <InputAdornment position="start">
                  <img
                    src="/icons/email-icon.svg"
                    alt="icon"
                    style={{ height: "15px", width: "15px" }}
                  />
                </InputAdornment>
              }
              error={
                showStudentForm
                  ? Boolean(studentErrors.email)
                  : Boolean(instructorErrors.email)
              }
            />
            {showStudentForm && studentErrors.email && (
              <p className={styles["error-text"]}>{studentErrors.email}</p>
            )}
            {!showStudentForm && instructorErrors.email && (
              <p className={styles["error-text"]}>{instructorErrors.email}</p>
            )}

            {/* Password Field */}
            <InputLabel htmlFor="password">Lozinka</InputLabel>
            <OutlinedInput
              id="password"
              type="password"
              value={showStudentForm ? studentPassword : instructorPassword}
              onChange={(e) =>
                showStudentForm
                  ? setStudentPassword(e.target.value)
                  : setInstructorPassword(e.target.value)
              }
              startAdornment={
                <InputAdornment position="start">
                  <img
                    src="/icons/password-icon.svg"
                    alt="icon"
                    style={{ height: "15px", width: "15px" }}
                  />
                </InputAdornment>
              }
              error={
                showStudentForm
                  ? Boolean(studentErrors.password)
                  : Boolean(instructorErrors.password)
              }
            />
            {showStudentForm && studentErrors.password && (
              <p className={styles["error-text"]}>{studentErrors.password}</p>
            )}
            {!showStudentForm && instructorErrors.password && (
              <p className={styles["error-text"]}>{instructorErrors.password}</p>
            )}

            <InputLabel htmlFor="confirmPassword">Potvrdi Lozinku</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type="password"
              value={
                showStudentForm
                  ? studentConfirmPassword
                  : instructorConfirmPassword
              }
              onChange={(e) =>
                showStudentForm
                  ? setStudentConfirmPassword(e.target.value)
                  : setInstructorConfirmPassword(e.target.value)
              }
              startAdornment={
                <InputAdornment position="start">
                  <img
                    src="/icons/password-icon.svg"
                    alt="icon"
                    style={{ height: "15px", width: "15px" }}
                  />
                </InputAdornment>
              }
              error={
                showStudentForm
                  ? Boolean(studentErrors.confirmPassword)
                  : Boolean(instructorErrors.confirmPassword)
              }
            />
            {showStudentForm && studentErrors.confirmPassword && (
              <p className={styles["error-text"]}>{studentErrors.confirmPassword}</p>
            )}
            {!showStudentForm && instructorErrors.confirmPassword && (
              <p className={styles["error-text"]}>{instructorErrors.confirmPassword}</p>
            )}

            {/* Profile Picture Field */}
            <InputLabel htmlFor="profilePicture">Profilna fotografija</InputLabel>
            <FileUpload
              mode="basic"
              name="profilePicture"
              accept="image/*"
              chooseLabel="Izaberi datoteku"
              auto={false}
              onSelect={(e) => {
                const file = e.files[0];
                if (showStudentForm) {
                  setStudentProfilePicture(file);
                } else {
                  setInstructorProfilePicture(file);
                }
              }}
              chooseOptions={{
                style: {
                  backgroundColor: "#F04D00",
                  border: "1px solid #F04D00",
                  color: "white",
                  fontWeight: "bold",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "center",
                  transform: "none"
                },
              }}
            />
          </div>

          {/* Buttons */}
          <div className={styles["button-container"]}>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Registriraj se
            </Button>
            <Button
              type="button"
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => {
                if (showStudentForm) {
                  setStudentName("");
                  setStudentSurname("");
                  setStudentEmail("");
                  setStudentPassword("");
                  setStudentConfirmPassword("");
                  setStudentProfilePicture(null);
                  setStudentErrors({});
                } else {
                  setInstructorName("");
                  setInstructorSurname("");
                  setInstructorEmail("");
                  setInstructorPassword("");
                  setInstructorConfirmPassword("");
                  setInstructorProfilePicture(null);
                  setInstructorErrors({});
                }
              }}
            >
              Odbaci
            </Button>
          </div>

          {/* Toggle Button */}
          <div className={styles["bottom-buttons-container"]}>
            <Button
              className="max-w-[200px] mx-auto mt-5"
              onClick={() => setShowStudentForm(!showStudentForm)}
              variant="link"
            >
              Registriraj se kao {showStudentForm ? "instruktor" : "student"}?
            </Button>

            

            <Button
              asChild
              className="bg-green-500 text-white hover:bg-green-600 mt-2 w-full"
            >
              <Link to="/login">Već imaš račun? Ulogiraj se</Link>
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
