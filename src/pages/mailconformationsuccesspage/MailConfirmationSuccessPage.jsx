import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MailConfirmationSuccessPage.css';

const MailConfirmationSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmationSuccessWrapper">
      <div className="confirmationSuccessContainer">
        <h1 className="successHeader">
          ✅ Email potvrđen!
        </h1>
        <p>
          Mail ti je potvrđen. Sad se možeš ulogirati i početi koristiti platformu.
        </p>
        <button
          className="primaryButton"
          onClick={() => navigate("/")}
        >
          Prijavi se
        </button>
      </div>
    </div>
  );
};

export default MailConfirmationSuccessPage;
