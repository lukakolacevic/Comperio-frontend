import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import './MailConfirmationSuccessPage.css';

const MailConfirmationSuccessPage = () => {
  const navigate = useNavigate();

  return (

    <div className="confirmation-success-wrapper">
      <div className="confirmation-success-container">
        
        <h1>
          Email potvrđen!
        </h1>
        <p>Mail ti je potvrđen. Sad se možeš ulogirati i početi koristiti platformu.</p>
        <Button label="Prijavi se" className="p-button-rounded p-button-outlined resend-button" onClick={() => navigate("/login")}/>
      </div>
    </div>

  );
};

export default MailConfirmationSuccessPage;