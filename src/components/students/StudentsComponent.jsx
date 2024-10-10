import React, { useState, useRef, useEffect } from "react";
import { Toast } from 'primereact/toast';
import "./StudentsComponent.css";
import "../professors/ProfessorsComponent.css";
import { manageSessionRequest } from "../../api/ProfessorApi";
import { Button as PrimeButton } from 'primereact/button';
import ConfirmSelectionDialog from '../dialog/ConfirmSelectionDialog';

function StudentsComponent({
    sessions,
    setSessions,
    setUpcomingSessions,
    setPendingRequests,
    setCancelledSessions,
    setPastSessions,
    buttonText,
    buttonVariant,
    isForPendingRequests,
    isForUpcomingSessions
}) {
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    // In ProfilePage component
    

    useEffect(() => {
        console.log('Sessions Updated:', sessions);
    }, [sessions]);


    const handleConfirm = (session) => {
        console.log("Ovdje sam")
        setSelectedSessionId(session.sessionId);
        setShowAcceptDialog(true);
        console.log("opet")
    };

    const handleCancel = (session) => {
        setSelectedSessionId(session.sessionId);

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
        const sessionToProcess = sessions.find(s => s.sessionId === selectedSessionId);

        if (sessionToProcess) {
            setLoading(true);
            // Update session status
            const updatedSession = { ...sessionToProcess, status: "Confirmed" };

            // Update session arrays
            setUpcomingSessions(prevUpcoming => [...prevUpcoming, updatedSession]);
            setPendingRequests(prevPending => prevPending.filter(s => s.sessionId !== selectedSessionId));



            try {
                await manageSessionRequest(selectedSessionId, "Accepted");
                setShowAcceptDialog(false);
                if (toast.current) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Confirmed',
                        detail: 'Zahtjev za termin prihvaćen',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error("Error accepting session:", error);
                // Revert changes on error
                setPendingRequests(prevPending => [...prevPending, {...sessionToProcess}]);
                setUpcomingSessions(prevUpcoming => prevUpcoming.filter(s => s.sessionId !== selectedSessionId));
                if (toast.current) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Neka poruka',
                        detail: 'Molim vas pokušajte ponovno.',
                        life: 3000
                    });
                }
            }
            finally {
                console.log("dddd")
                setLoading(false);
            }
        }
    };

    const cancelAction = async () => {
        const sessionToCancel = sessions.find(s => s.sessionId === selectedSessionId);

        if (sessionToCancel) {
            setLoading(true);
            // Update session status
            const updatedSession = { ...sessionToCancel, status: "Cancelled" };

            // Update session arrays
            if (isForUpcomingSessions) {
                setUpcomingSessions(prevUpcoming => prevUpcoming.filter(s => s.sessionId !== selectedSessionId));
            } else if (isForPendingRequests) {
                setPendingRequests(prevPending => prevPending.filter(s => s.sessionId !== selectedSessionId));
            }
            setCancelledSessions(prevCancelled => [...prevCancelled, updatedSession]);



            try {
                await manageSessionRequest(selectedSessionId, "Cancelled");
                setShowRejectDialog(false);
                if (toast.current) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Cancelled',
                        detail: toastMessage,
                        life: 3000
                    });
                }
            } catch (error) {
                console.error("Error cancelling session:", error);
                // Revert changes on error
                if (isForUpcomingSessions) {
                    setUpcomingSessions(prevUpcoming => [...prevUpcoming, {...sessionToCancel}]);
                } else if (isForPendingRequests) {
                    setPendingRequests(prevPending => [...prevPending, {...sessionToCancel}]);
                }
                setCancelledSessions(prevCancelled => prevCancelled.filter(s => s.sessionId !== selectedSessionId));
            }

            finally {

                setLoading(false); // Re-enable buttons after the request completes
            }
        }
    };

    const renderStudentCard = (student, session, index) => {
        return (
            <div key={`${session.sessionId}-${index}`} className="professor">
                <img
                    src={
                        student.profilePictureBase64String
                            ? `data:image/jpeg;base64,${student.profilePictureBase64String}`
                            : "/placeholder.png"
                    }
                    className="professor-image"
                    alt={student.name}
                />
                <div className="professor-info">
                    <h3 className="professor-text">
                        {student.name} {student.surname}
                    </h3>
                    <p className="professor-text">{session.subject.title}</p>
                    <p>{new Date(session.dateTime).toLocaleString()}</p>

                    {isForPendingRequests && (
                        <div className="button-wrapper">
                            <PrimeButton
                                label="Accept"
                                severity="success"
                                rounded
                                onClick={() => handleConfirm(session)}
                                disabled={loading}
                            />
                            <PrimeButton
                                label="Reject"
                                severity="danger"
                                rounded
                                onClick={() => handleCancel(session)}
                                disabled={loading}
                            />
                        </div>
                    )}

                    {isForUpcomingSessions && (
                        <PrimeButton
                            label="Cancel Session"
                            severity="warning"
                            className="p-button-rounded"
                            onClick={() => handleCancel(session)}
                            disabled={loading}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="professor-container">
            {sessions.map((session, index) =>
                renderStudentCard(session.student, session, index)
            )}

            <Toast ref={toast} />

            {/* Accept Confirmation Dialog */}
            <ConfirmSelectionDialog
                visible={showAcceptDialog}
                message="Jeste li sigurni da želite prihvatiti zahtjev za termin?"
                header="Confirmation"
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
                header="Delete Confirmation"
                icon="pi pi-info-circle"
                acceptClassName="p-button-danger"
                rejectClassName="p-button-secondary"
                onConfirm={cancelAction}
                onCancel={() => setShowRejectDialog(false)}
            />
        </div>
    );
}

export default StudentsComponent;
