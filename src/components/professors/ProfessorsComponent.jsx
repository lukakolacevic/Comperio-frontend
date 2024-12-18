import { Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import "./ProfessorsComponent.css";
import DateTimeDialog from "../dialog/DateTimeDialog";
import { useParams } from "react-router-dom";
import { getSubject } from "../../api/SubjectApi";
import { Toast } from 'primereact/toast'; // Import PrimeReact Toast

function ProfessorsComponent({
  professors,      // Used on the home page and subject page
  sessions,        // Used on the profile page
  showSubject,     // Flag to show the subject name
  showInstructionsCount,
  showTime,        // Flag to show session time
  buttonText,
  buttonVariant,
}) {
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const { subjectName } = useParams(); // This will be undefined on the main page
  const successToast = useRef(null);  // Ref for the success toast

  useEffect(() => {
    // Fetch the subject ID if we are on the subject page
    if (subjectName) {
      const fetchSubjectId = async () => {
        try {
          const subjectOnPage = await getSubject(subjectName);
          if (subjectOnPage && subjectOnPage.subject.id) {
            setSubjectId(subjectOnPage.subject.id);
          } else {
            console.error("Invalid subject data received.");
            setSubjectId(null);
          }
        } catch (error) {
          console.error("Error fetching subject ID:", error);
          setSubjectId(null);
        }
      };
      fetchSubjectId();
    } else {
      setSubjectId(null);
    }
  }, [subjectName]); 

  const handleButtonClick = (professorId) => {
    setSelectedProfessorId(professorId);
  };

  const handleCloseDialog = () => {
    setSelectedProfessorId(null);
  };

  const handleSuccess = () => {
    
    if (successToast.current) {
      successToast.current.show({
        severity: 'success',
        summary: 'Zahtjev za instrukcije uspješno poslan.',
        life: 5000
      });
    }
  };

  const renderProfessorCard = (professor, session, index) => (
    
    <div key={`${professor.id}-${index}`} className="professor">
      {console.log(professor)}
      <img
        src={
          professor.profilePicture
            ? `data:image/jpeg;base64,${professor.profilePicture}`
            : "/placeholder.png"
        }
        className="professor-image"
        alt={professor.name}
      />
      <div className="professor-info">
        <h3 className="professor-text">
          {professor.name} {professor.surname}
        </h3>

        {showSubject && session?.subject && (
          <p className="professor-text">{session.subject.title}</p>
        )}

        {showInstructionsCount && (
          <div className="instructionsCount-container">
            <img src="/icons/users-icon.svg" className="users-icon" />
            <p>{professor.instructionsCount}</p>
          </div>
        )}

        {showTime && session?.dateTime && (
          <div className="instructionsCount-container">
            <p>{new Date(session.dateTime).toLocaleString()}</p>
          </div>
        )}

        <Button
          onClick={() => handleButtonClick(professor.id)}
          variant={buttonVariant ? buttonVariant : "contained"}
        >
          {buttonText ? buttonText : "Dogovori termin"}
        </Button>
      </div>
      {selectedProfessorId === professor.id && (
        <DateTimeDialog
          open={selectedProfessorId === professor.id}
          onClose={handleCloseDialog}
          professor={professor}
          subjectId={subjectId} // Pass subjectId if available
          isOnSubjectPage={!!subjectName} // Check if on the subject page
          onSuccess={handleSuccess}  // Handle success toast
        />
      )}
    </div>
  );

  return (
    <div className="professor-container">
      {/* Toast for showing success messages */}
      <Toast ref={successToast} position="top-center" />

      {/* If sessions exist, render session-based view, otherwise render professors */}
      {sessions?.length > 0
        ? sessions.map((session, index) =>
          renderProfessorCard(session.user, session, index)
        )
        : professors?.map((professor, index) =>
          renderProfessorCard(professor, null, index)
        )}
    </div>
  );
}

export default ProfessorsComponent;
