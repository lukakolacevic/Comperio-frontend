import React from 'react';
import { Button } from 'primereact/button'; // Replace with your preferred UI library
import { useNavigate } from 'react-router-dom';
import './RegisterSuccessPage.css'; // Custom styles

const RegisterSuccessPage = () => {
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/resend-confirmation-email`;
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user.email)
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error resending confirmation email', error);
    }
  };

  return (
    <div className="confirm-email-wrapper">
      <div className="confirm-email-container">
        <h2>Skoro si gotov...</h2>
        <p>Hvala ti što si se registrirao na našoj platformi. Poslali smo ti link potvrde na email adresu pa ga samo na brzinu potvrdi.</p>
        
        <div className="resend-wrapper">
          <p>Ako nisi dobio email, klikni gumb dolje da bi ti ga ponovno poslali.</p>
          <Button label="Ponovno pošalji mail potvrde" onClick={handleResendEmail} className="p-button-rounded p-button-outlined resend-button"/>
        </div>
        
        <p className="login-link">Već si potvrđen? <span onClick={() => navigate('/login')}>Prijavi se</span></p>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;