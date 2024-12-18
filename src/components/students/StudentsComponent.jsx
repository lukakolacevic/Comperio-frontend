import React from "react";
import "./StudentsComponent.css";
import "../instructors/InstructorsComponent.css";
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
        console.log(student);
        return (
            <div key={`${session.sessionId}-${index}`} className="instructor">
                <img
                    src={
                        student.profilePicture
                            ? `data:image/jpeg;base64,${student.profilePicture}`
                            : "/placeholder.png"
                    }
                    className="instructor-image"
                    alt={student.name}
                />
                <div className="instructor-info">
                    <h3 className="instructor-text">
                        {student.name} {student.surname}
                    </h3>
                    <p className="instructor-text">{session.subject.title}</p>
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
        <div className="instructor-container">
            {sessions.map((session, index) =>
                renderStudentCard(session.user, session, index)
            )}
        </div>
    );
}

export default StudentsComponent;
