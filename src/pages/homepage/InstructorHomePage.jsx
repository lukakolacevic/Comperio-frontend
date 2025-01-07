import React, { useState, useEffect, useRef } from "react";
import styles from "./StudentHomePage.module.css"; // Using the same CSS module

// PrimeReact components
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

// Big Calendar
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useLocation } from "react-router-dom";

// API calls
import { getInstructorSessions } from "../../api/InstructorApi";

// Localize the calendar with moment
const localizer = momentLocalizer(moment);

export default function InstructorHomePage() {
  const [sessions, setSessions] = useState([]);
  const toast = useRef(null);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch the instructor's sessions for the calendar
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getInstructorSessions(user.id);
        setSessions([
          ...response.pendingRequests.map((session) => ({
            id: session.sessionId,
            title: `${session.subject.title} (${session.user.name} ${session.user.surname})`,
            start: new Date(session.dateTime),
            end: new Date(session.dateTimeEnd),
            status: "Pending",
          })),
          ...response.upcomingSessions.map((session) => ({
            id: session.sessionId,
            title: `${session.subject.title} (${session.user.name} ${session.user.surname})`,
            start: new Date(session.dateTime),
            end: new Date(session.dateTimeEnd),
            status: "Confirmed",
          })),
        ]);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };

    if (user?.id) {
      fetchSessions();
    }
  }, [user.id, location]);

  return (
    <div className={styles["profile-page-wrapper"]}>
      {/* Toast for notifications */}
      <Toast ref={toast} />

      <div className={styles["content-wrapper"]}>
        <div className={styles["side-by-side"]}>
          {/* LEFT CARD: Calendar */}
          <Card
            title="Tvoji zahtjevi za instrukcije i budući termini instrukcija"
            className={`${styles["subject-card"]} ${styles["my-subjects"]}`}
          >
            <div className={styles["scrollable-subject-list"]}>
              <Calendar
                className={styles["calendar"]}
                localizer={localizer}
                events={sessions}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={(event) =>
                  alert(`You clicked on session: ${event.title}`)
                }
                eventPropGetter={(event) => {
                  let backgroundColor;
                  if (event.status === "Pending") {
                    backgroundColor = "#ffc107"; // Yellow for pending
                  } else if (event.status === "Confirmed") {
                    backgroundColor = "#28a745"; // Green for confirmed
                  } else {
                    backgroundColor = "#00a3f0"; // Default color
                  }
                  return {
                    style: {
                      backgroundColor,
                      color: "black", // Text color for better contrast
                      borderRadius: "8px",
                      border: "none",
                    },
                  };
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
