import { GoogleLogin } from "@react-oauth/google";
import { InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { Button } from "@/components/shadcn/Button";
import { Separator } from "@/components/shadcn/Separator";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ Import useAuth
import { handleLogin, handleGoogleLogin } from "../../api/AuthApi";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const [showStudentLogIn, setShowStudentLogIn] = useState(true);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [instructorEmail, setInstructorEmail] = useState("");
  const [instructorPassword, setInstructorPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { setUser } = useAuth(); // ✅ Get setUser from context

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const roleId = showStudentLogIn ? 1 : 2;

      const response = await handleGoogleLogin(googleToken, roleId);
      console.log("Google login response:", response);

    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google login failed");
  };

  function validateForm(email, password) {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Molim te unesi email adresu.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Unesite valjanu e-mail adresu.";
    }

    if (!password) {
      newErrors.password = "Molim te unesi lozinku.";
    }

    return newErrors;
  }

  async function handleSubmit(event, isStudent) {
    event.preventDefault();
    const email = isStudent ? studentEmail : instructorEmail;
    const password = isStudent ? studentPassword : instructorPassword;

    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const data = { email, password };

    try {
      await handleLogin(data, isStudent ? 1 : 2, setUser); // ✅ Pass setUser here
    } catch (error) {
      setErrors({
        ...validationErrors,
        form: "Krivi e-mail ili lozinka. Molim vas pokušajte ponovno.",
      });
    }
  }

  const emailValue = showStudentLogIn ? studentEmail : instructorEmail;
  const passwordValue = showStudentLogIn ? studentPassword : instructorPassword;

  return (
    <div className={styles["login-wrapper"]}>
      <div className={styles["login-container"]}>
        <h1>{showStudentLogIn ? "Prijava studenta" : "Prijava profesora"}</h1>

        <form onSubmit={(e) => handleSubmit(e, showStudentLogIn)}>
          <div className={styles["login-form"]}>
            <InputLabel htmlFor="email">E-mail adresa</InputLabel>
            <OutlinedInput
              id="email"
              type="text"
              value={emailValue}
              onChange={(e) => {
                showStudentLogIn
                  ? setStudentEmail(e.target.value)
                  : setInstructorEmail(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <img
                    src="/icons/email-icon.svg"
                    alt="icon"
                    style={{ height: "15px", width: "15px" }}
                  />
                </InputAdornment>
              }
              error={Boolean(errors.email)}
              placeholder="Email"
            />
            {errors.email && (
              <span className={styles["error-text"]}>{errors.email}</span>
            )}

            <InputLabel htmlFor="password">Lozinka</InputLabel>
            <OutlinedInput
              id="password"
              type="password"
              value={passwordValue}
              onChange={(e) => {
                showStudentLogIn
                  ? setStudentPassword(e.target.value)
                  : setInstructorPassword(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <img
                    src="/icons/password-icon.svg"
                    alt="icon"
                    style={{ height: "15px", width: "15px" }}
                  />
                </InputAdornment>
              }
              error={Boolean(errors.password)}
              placeholder="Lozinka"
            />
            {errors.password && (
              <span className={styles["error-text"]}>{errors.password}</span>
            )}

            {errors.form && (
              <div className={styles["form-error"]}>{errors.form}</div>
            )}
          </div>

          <div className={styles["button-container"]}>
            <Button variant="default" type="submit">
              Prijavi se
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={() => {
                setStudentEmail("");
                setStudentPassword("");
                setInstructorEmail("");
                setInstructorPassword("");
                setErrors({});
              }}
            >
              Odbaci
            </Button>
          </div>
        </form>

        <div className={styles["bottom-buttons-container"]}>
          <Button
            className="max-w-[200px] mx-auto mt-3"
            variant="link"
            onClick={() => setShowStudentLogIn(!showStudentLogIn)}
          >
            Prijavi se kao {showStudentLogIn ? "professor" : "student"}
          </Button>
          <Button
            asChild
            className="bg-green-500 text-white hover:bg-green-600 mt-2 w-full"
          >
            <Link to="/register">Nemaš račun? Registriraj se</Link>
          </Button>
          <Separator className="my-4 bg-gray-300 h-[2px]" />

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            text="continue_with"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
