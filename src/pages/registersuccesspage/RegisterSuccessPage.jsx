import React from 'react';
import { Button } from "@/components/shadcn/Button"; // Your shadcn Button component
import { useNavigate } from 'react-router-dom';
import styles from './RegisterSuccessPage.module.css'; // Custom styles

const RegisterSuccessPage = () => {
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    try {
      const email = JSON.parse(localStorage.getItem('email'));
      const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/resend-confirmation-email`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error resending confirmation email', error);
    }
  };

  return (
    <div className={styles.confirmEmailWrapper}>
      <div className={styles.confirmEmailContainer}>
        <h2>Provjeri svoj email</h2>
        <p>Hvala ti što si se registrirao na našoj platformi! Da bi dovršio registraciju,
          otvori svoj email i klikni na link za potvrdu. Ako ne vidiš email, provjeri i
          mapu neželjene pošte (spam).</p>
        <div className={styles.resendWrapper}>
          <p>Nisi dobio email? Klikni na gumb ispod kako bismo ga ponovno poslali.</p>
          <Button onClick={handleResendEmail} className={styles.resendButton}>
            Ponovno pošalji mail za potvrdu
          </Button>
        </div>
        <p className={styles.loginLink}>
          Već si potvrdio račun?{" "}
          <span onClick={() => navigate("/")}>Prijavi se</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
