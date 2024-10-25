import ProfessorsComponent from "../../components/professors/ProfessorsComponent.jsx";
import StudentsComponent from "../../components/students/StudentsComponent.jsx";
import { getStudentSessions, getProfessorSessions, manageSessionRequest } from "../../api/ProfessorApi.jsx";
import "./SessionPage.css";
import React, { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import ConfirmSelectionDialog from '../../components/dialog/ConfirmSelectionDialog.jsx';

function SessionPage() {
  if (!localStorage.getItem("token")) {
    window.location.href = '/login';
  }
  let user = JSON.parse(localStorage.getItem('user'));
  const userType = user.status;

  const [pastSessions, setPastSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);

  // Moved state variables from StudentsComponent
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const toast = useRef(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (userType === 'student') {
          const studentSessions = await getStudentSessions();
          setPastSessions(studentSessions.pastSessions);
          setUpcomingSessions(studentSessions.upcomingSessions);
          setPendingRequests(studentSessions.pendingRequests);
          setCancelledSessions(studentSessions.cancelledSessions);
        } else if (userType === 'professor') {
          const professorSessions = await getProfessorSessions();
          setPastSessions(professorSessions.pastSessions);
          setUpcomingSessions(professorSessions.upcomingSessions);
          setPendingRequests(professorSessions.pendingRequests);
          setCancelledSessions(professorSessions.cancelledSessions);
        }
      } catch (error) {
        console.error("Error fetching sessions/requests:", error);
      }
    };

    fetchSessions();
  }, [userType]);

  // Callback when accept button is clicked
  const handleAccept = (session) => {
    setSelectedSessionId(session.sessionId);
    setSelectedSession(session);
    setShowAcceptDialog(true);
  };

  // Callback when cancel/reject button is clicked
  const handleCancel = (session) => {
    setSelectedSessionId(session.sessionId);
    setSelectedSession(session);

    if (session.status === "Confirmed") {
      setCancelMessage("Jeste li sigurni da želite otkazati termin?");
      setToastMessage("Termin otkazan.");
    } else {
      setCancelMessage("Jeste li sigurni da želite odbiti zahtjev za termin?");
      setToastMessage("Zahtjev za termin odbijen.");
    }
    setShowRejectDialog(true);
  };

  const confirmAction = async () => {
    if (selectedSession) {
      const sessionToProcess = selectedSession;

      // Optimistically update UI
      const updatedSession = { ...sessionToProcess, status: "Confirmed" };

      setUpcomingSessions(prev => [...prev, updatedSession]);
      setPendingRequests(prev => prev.filter(s => s.sessionId !== selectedSessionId));

      try {
        await manageSessionRequest(selectedSessionId, "Confirmed");
        setShowAcceptDialog(false);
        toast.current?.show({
          severity: 'info',
          summary: 'Zahtjev za termin prihvaćen',
          life: 3000
        });
      } catch (error) {
        console.error("Error accepting session:", error);
        // Revert changes on error
        setPendingRequests(prev => [...prev, { ...sessionToProcess }]);
        setUpcomingSessions(prev => prev.filter(s => s.sessionId !== selectedSessionId));

        setSelectedSessionId(null);
        setShowAcceptDialog(false);
        toast.current?.show({
          severity: 'warn',
          summary: 'Dogodila se greška. Molim vas pokušajte ponovno.',
          life: 3000
        });
      }
    }
  };

  const cancelAction = async () => {
    if (selectedSession) {
      const sessionToCancel = selectedSession;
      const updatedSession = { ...sessionToCancel, status: "Cancelled" };

      // Optimistically update UI
      if (sessionToCancel.status === "Confirmed") {
        setUpcomingSessions(prev => prev.filter(s => s.sessionId !== selectedSessionId));
      } else {
        setPendingRequests(prev => prev.filter(s => s.sessionId !== selectedSessionId));
      }
      setCancelledSessions(prev => [...prev, updatedSession]);

      try {
        await manageSessionRequest(selectedSessionId, "Cancelled");
        setShowRejectDialog(false);
        toast.current?.show({
          severity: 'info',
          summary: toastMessage,
          life: 3000
        });
      } catch (error) {
        console.error("Error cancelling session:", error);

        // Revert changes on error
        if (sessionToCancel.status === "Confirmed") {
          setUpcomingSessions(prev => [...prev, { ...sessionToCancel }]);
        } else {
          setPendingRequests(prev => [...prev, { ...sessionToCancel }]);
        }
        setCancelledSessions(prev => prev.filter(s => s.sessionId !== selectedSessionId));

        setShowRejectDialog(false);
        setSelectedSessionId(null);

        toast.current?.show({
          severity: 'warn',
          summary: 'Dogodila se greška. Molim vas pokušajte ponovno.',
          life: 3000
        });
      }
    }
  };

  return (
    <>
      <div className="profilepage-wrapper">
        <div className="profilepage-container">
          <div className="student-info">
            <img
              src={
                user.profilePictureBase64String
                  ? `data:image/jpeg;base64,${user.profilePictureBase64String}`
                  : "/placeholder.png"
              }
              className="professor-image"
              alt={user.name}
            />
            <div>
              <h1>{user.name} {user.surname}</h1>
              <p>{user.description}</p>
            </div>
          </div>

          {userType === "student" ? (
            <>
              <div>
                <h4>Poslani zahtjevi za instrukcije:</h4>
                <ProfessorsComponent
                  professors={null}
                  sessions={pendingRequests}
                  showTime={true}
                  showSubject={true}
                  showInstructionsCount={false}
                  buttonText={"Promijeni"}
                  buttonVariant={"outlined"}
                  isOnProfilePage={true}
                />
              </div>

              <div>
                <h4>Nadolazeće instrukcije:</h4>
                <ProfessorsComponent
                  professors={null}
                  sessions={upcomingSessions}
                  showTime={true}
                  showSubject={true}
                  showInstructionsCount={false}
                  buttonText={"Promijeni"}
                  buttonVariant={"outlined"}
                  isOnProfilePage={true}
                />
              </div>

              <div>
                <h4>Povijest instrukcija:</h4>
                <ProfessorsComponent
                  professors={null}
                  sessions={pastSessions}
                  showTime={true}
                  showSubject={true}
                  showInstructionsCount={false}
                  buttonText={"Ponovno dogovori"}
                  isOnProfilePage={true}
                />
              </div>

              <div>
                <h4>Otkazane/odbijene instrukcije:</h4>
                <ProfessorsComponent
                  professors={null}
                  sessions={cancelledSessions}
                  showTime={true}
                  showSubject={true}
                  showInstructionsCount={false}
                  buttonText={"Ponovno dogovori"}
                  isOnProfilePage={true}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <h4>Pristigli zahtjevi za instrukcije:</h4>
                <StudentsComponent
                  sessions={pendingRequests}
                  onAccept={handleAccept}
                  onCancel={handleCancel}
                  isForPendingRequests={true}
                  isForUpcomingSessions={false}
                />
              </div>

              <div>
                <h4>Nadolazeće instrukcije:</h4>
                <StudentsComponent
                  sessions={upcomingSessions}
                  onAccept={handleAccept}
                  onCancel={handleCancel}
                  isForPendingRequests={false}
                  isForUpcomingSessions={true}
                />
              </div>

              <div>
                <h4>Povijest instrukcija:</h4>
                <StudentsComponent
                  sessions={pastSessions}
                  isForPendingRequests={false}
                  isForUpcomingSessions={false}
                />
              </div>

              <div>
                <h4>Otkazane/odbijene instrukcije:</h4>
                <StudentsComponent
                  sessions={cancelledSessions}
                  isForPendingRequests={false}
                  isForUpcomingSessions={false}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Include Toast and Dialogs */}
      <Toast ref={toast} />

      {/* Accept Confirmation Dialog */}
      <ConfirmSelectionDialog
        visible={showAcceptDialog}
        message="Jeste li sigurni da želite prihvatiti zahtjev za termin?"
        header="Prihvati zahtjev"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-primary"
        rejectClassName="p-button-secondary"
        onConfirm={confirmAction}
        onCancel={() => setShowAcceptDialog(false)}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmSelectionDialog
        visible={showRejectDialog}
        message={cancelMessage}
        header="Odbij zahtjev"
        icon="pi pi-info-circle"
        acceptClassName="p-button-danger"
        rejectClassName="p-button-secondary"
        onConfirm={cancelAction}
        onCancel={() => setShowRejectDialog(false)}
      />
    </>
  );
}

export default SessionPage;
