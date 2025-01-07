import { Button } from "@/components/shadcn/Button";
import { useState, useEffect, useRef } from "react";
import "./InstructorsComponent.css";
import DateTimeDialog from "../dialog/DateTimeDialog";
import { useParams } from "react-router-dom";
import { getSubject } from "../../api/SubjectApi";
import { Toast } from 'primereact/toast'; // Import PrimeReact Toast

function InstructorsComponent({
  instructors,      // Used on the home page and subject page
  sessions,        // Used on the profile page
  showSubject,     // Flag to show the subject name
  showInstructionsCount,
  showTime,        // Flag to show session time
  buttonText,
  buttonVariant,
  onCardClick
}) {
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
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

  const handleButtonClick = (instructorId) => {
    setSelectedInstructorId(instructorId);
  };

  const handleCloseDialog = () => {
    setSelectedInstructorId(null);
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

  const renderProfessorCard = (instructor, session, index) => (
    
    <div key={`${instructor.id}-${index}`} className="instructor" onClick={() => onCardClick(session.sessionId)}>
      {console.log(instructor)}
      <img
        src={
          instructor.profilePicture
            ? `data:image/jpeg;base64,${instructor.profilePicture}`
            : "/placeholder.png"
        }
        className="instructor-image"
        alt={instructor.name}
      />
      <div className="instructor-info">
        <h3 className="instructor-text">
          {instructor.name} {instructor.surname}
        </h3>

        {showSubject && session?.subject && (
          <p className="instructor-text">{session.subject.title}</p>
        )}

        {showInstructionsCount && (
          <div className="instructionsCount-container">
            <img src="/icons/users-icon.svg" className="users-icon" />
            <p>{instructor.instructionsCount}</p>
          </div>
        )}

        {showTime && session?.dateTime && (
          <div className="instructionsCount-container">
            <p>{new Date(session.dateTime).toLocaleString()}</p>
          </div>
        )}

        <Button
          onClick={() => handleButtonClick(instructor.id)}
          variant={buttonVariant ? buttonVariant : "contained"}
        >
          {buttonText ? buttonText : "Dogovori termin"}
        </Button>
      </div>
      {selectedInstructorId === instructor.id && (
        <DateTimeDialog
          open={selectedInstructorId === instructor.id}
          onClose={handleCloseDialog}
          instructor={instructor}
          subjectId={subjectId} // Pass subjectId if available
          isOnSubjectPage={!!subjectName} // Check if on the subject page
          onSuccess={handleSuccess}  // Handle success toast
        />
      )}
    </div>
  );

  return (
    <div className="instructor-container">
      {/* Toast for showing success messages */}
      <Toast ref={successToast} position="top-center" />

      {/* If sessions exist, render session-based view, otherwise render instructors */}
      {sessions?.length > 0
        ? sessions.map((session, index) =>
          renderProfessorCard(session.user, session, index)
        )
        : instructors?.map((instructor, index) =>
          renderProfessorCard(instructor, null, index)
        )}
    </div>
  );
}

export default InstructorsComponent;
