import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import "./ProfessorsComponent.css";
import DateTimeDialog from "../dialog/DateTimeDialog";
import { useParams } from "react-router-dom";
import { getSubject } from "../../api/SubjectApi";
import SubjectPage from "../../pages/subject/SubjectPage";

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
          setSubjectId(null); // Reset subjectId if there's an error
        }
      };
      fetchSubjectId();
    } else {
      setSubjectId(null);
    }
  }, [subjectName]); // Runs whenever the subjectName changes

  const handleButtonClick = (professorId) => {
    setSelectedProfessorId(professorId);
  };

  const handleCloseDialog = () => {
    setSelectedProfessorId(null);
  };

  const renderProfessorCard = (professor, session, index) => (
    <div key={`${professor.professorId}-${index}`} className="professor">
      <img
        src={
          professor.profilePictureBase64String
            ? `data:image/jpeg;base64,${professor.profilePictureBase64String}`
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
            {/*<img src="/icons/clock-icon.svg" className="clock-icon" />*/}
            <p>{new Date(session.dateTime).toLocaleString()}</p>
          </div>
        )}

        <Button
          onClick={() => handleButtonClick(professor.professorId)}
          variant={buttonVariant ? buttonVariant : "contained"}
        >
          {buttonText ? buttonText : "Dogovori termin"}
        </Button>
      </div>
      {selectedProfessorId === professor.professorId && (
        <DateTimeDialog
          open={selectedProfessorId === professor.professorId}
          onClose={handleCloseDialog}
          professor={professor}
          subjectId={subjectId} // Pass subjectId if available
          isOnSubjectPage={!!subjectName} // Check if on the subject page
        />
      )}
    </div>
  );

  return (
    <div className="professor-container">
      {/* If sessions exist, render session-based view, otherwise render professors */}
      {sessions?.length > 0
        ? sessions.map((session, index) =>
          renderProfessorCard(session.professor, session, index)
        )
        : professors?.map((professor, index) =>
          renderProfessorCard(professor, null, index)
        )}
    </div>
  );
}

export default ProfessorsComponent;
