import React, { useEffect, useState, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import InstructorsComponent from "../../components/instructors/InstructorsComponent.jsx";
import StudentsComponent from "../../components/students/StudentsComponent.jsx";
import { getStudentSessions, getInstructorSessions, manageSessionRequest } from "../../api/InstructorApi.jsx";
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Toast } from 'primereact/toast';
import ConfirmSelectionDialog from '../../components/dialog/ConfirmSelectionDialog.jsx';
import "./SessionPage.css";
import { useNavigate } from "react-router-dom";
import { getSessionDetails } from '../../api/SessionApi.jsx';
import { useAuth } from "../../context/AuthContext"; 

function SessionPage() {


  const { user } = useAuth();
  const roleId = user.roleId;
  const id = user.id;

  const [pastSessions, setPastSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const toast = useRef(null);
  const location = useLocation(); // Hook to detect route changes
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (roleId === 1) {
          const studentSessions = await getStudentSessions(user.id);
          setPastSessions(studentSessions.pastSessions);
          setUpcomingSessions(studentSessions.upcomingSessions);
          setPendingRequests(studentSessions.pendingRequests);
          setCancelledSessions(studentSessions.cancelledSessions);
        } else if (roleId === 2) {
          const instructorSessions = await getInstructorSessions(user.id);
          setPastSessions(instructorSessions.pastSessions);
          setUpcomingSessions(instructorSessions.upcomingSessions);
          setPendingRequests(instructorSessions.pendingRequests);
          setCancelledSessions(instructorSessions.cancelledSessions);
        }
      } catch (error) {
        console.error("Error fetching sessions/requests:", error);
      }
    };
    console.log(user);
    fetchSessions();

  }, [id, location]);

  const handleCardClick = (sessionId) => {
    navigate(`/session/${sessionId}`); // Navigate to session details page
  };

  const handleAccept = (session) => {
    setSelectedSessionId(session.sessionId);
    setSelectedSession(session);
    setShowAcceptDialog(true);
  };

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
      <div className="session-page-wrapper">
        <div className="session-page-container">
          <TabView>
            <TabPanel header="Zahtjevi za instrukcije">
              <div className="session-card-container">
                {roleId === 1 ? (
                  <InstructorsComponent
                    sessions={pendingRequests}
                    showTime={true}
                    showSubject={true}
                    buttonText="Promijeni"
                    cardClass="session-card pending"
                    onCardClick={handleCardClick}
                  />
                ) : (
                  <StudentsComponent
                    sessions={pendingRequests}
                    onAccept={handleAccept}
                    onCancel={handleCancel}
                    isForPendingRequests={true}
                    cardClass="session-card pending"
                    onCardClick={handleCardClick}
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel header="Nadolezeće instrukcije">
              <div className="session-card-container">
                {roleId === 1 ? (
                  <InstructorsComponent
                    sessions={upcomingSessions}
                    showTime={true}
                    showSubject={true}
                    buttonText="Promijeni"
                    cardClass="session-card upcoming"
                    onCardClick={handleCardClick}
                  />
                ) : (
                  <StudentsComponent
                    sessions={upcomingSessions}
                    onAccept={handleAccept}
                    onCancel={handleCancel}
                    isForUpcomingSessions={true}
                    cardClass="session-card upcoming"
                    onCardClick={handleCardClick}
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel header="Prošle instrukcije">
              <div className="session-card-container">
                {roleId === 1 ? (
                  <InstructorsComponent
                    sessions={pastSessions}
                    showTime={true}
                    showSubject={true}
                    buttonText="Ponovno dogovori"
                    cardClass="session-card past"
                    onCardClick={handleCardClick}
                  />
                ) : (
                  <StudentsComponent
                    sessions={pastSessions}
                    cardClass="session-card past"
                    onCardClick={handleCardClick}
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel header="Otkazane instrukcije">
              <div className="session-card-container">
                {roleId === 1 ? (
                  <InstructorsComponent
                    sessions={cancelledSessions}
                    showTime={true}
                    showSubject={true}
                    buttonText="Ponovno dogovori"
                    cardClass="session-card cancelled"
                    onCardClick={handleCardClick}
                  />
                ) : (
                  <StudentsComponent
                    sessions={cancelledSessions}
                    cardClass="session-card cancelled"
                    onCardClick={handleCardClick}
                  />
                )}
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>

      <Toast ref={toast} />

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