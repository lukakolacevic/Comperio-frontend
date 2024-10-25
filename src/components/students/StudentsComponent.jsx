import React from "react";
import "./StudentsComponent.css";
import "../professors/ProfessorsComponent.css";
import { Button as PrimeButton } from 'primereact/button';

function StudentsComponent({
    sessions,
    isForPendingRequests,
    isForUpcomingSessions,
    onAccept,
    onCancel,
    buttonText,
    buttonVariant
}) {

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
                                label="Prihvati"
                                severity="success"
                                rounded
                                onClick={() => onAccept(session)}
                            />
                            <PrimeButton
                                label="Odbij"
                                severity="danger"
                                rounded
                                onClick={() => onCancel(session)}
                            />
                        </div>
                    )}

                    {isForUpcomingSessions && (
                        <PrimeButton
                            label="Otkaži"
                            severity="danger"
                            className="p-button-rounded"
                            onClick={() => onCancel(session)}
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
        </div>
    );
}

export default StudentsComponent;
