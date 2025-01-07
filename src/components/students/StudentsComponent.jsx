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
    buttonVariant,
    onCardClick
}) {
    const renderStudentCard = (student, session, index) => {
        return (
            <div
                key={`${session.sessionId}-${index}`}
                className="instructor"
                onClick={() => onCardClick(session.sessionId)} // Card click handler
            >

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
                    {/* Prevent card click propagation on buttons */}

                    <h3 className="instructor-text">
                        {student.name} {student.surname}
                    </h3>
                    <p className="instructor-text">{session.subject.title}</p>
                    <p>{new Date(session.dateTime).toLocaleString()}</p>

                    {isForPendingRequests && (
                        <div
                            className="button-wrapper"
                            onClick={(e) => e.stopPropagation()} // Stop propagation for buttons
                        >
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
                        <div
                            onClick={(e) => e.stopPropagation()} // Stop propagation for buttons
                        >
                            <PrimeButton
                                label="Otkaži"
                                severity="danger"
                                className="p-button-rounded"
                                onClick={() => onCancel(session)}
                            />
                        </div>
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
