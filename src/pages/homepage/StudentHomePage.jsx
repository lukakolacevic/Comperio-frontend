import React, { useState, useEffect, useRef } from "react";
import styles from "./StudentHomePage.module.css"; // <-- CSS module

// PrimeReact components
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";

// Big Calendar
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useNavigate } from "react-router-dom";

// API calls
import { getSubjects } from "../../api/SubjectApi";
import { getStudentSessions } from "../../api/InstructorApi";
import { useLocation } from 'react-router-dom';

// Localize the calendar with moment
const localizer = momentLocalizer(moment);

function StudentHomePage() {
  const [sessions, setSessions] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch the student’s sessions for the calendar
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getStudentSessions(user.id);
        setSessions([
          ...response.pendingRequests.map((session) => ({
            id: session.sessionId,
            title: `${session.subject.title} (${session.user.name} ${session.user.surname})`,
            start: new Date(session.dateTime),
            end: new Date(session.dateTimeEnd),
            status: "Pending"
          })),
          ...response.upcomingSessions.map((session) => ({
            id: session.sessionId,
            title: `${session.subject.title} (${session.user.name} ${session.user.surname})`,
            start: new Date(session.dateTime),
            end: new Date(session.dateTimeEnd),
            status: "Confirmed"
          })),
        ]);
        console.log(sessions);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };

    if (user?.id) {
      fetchSessions();

    }
  }, [user.id, location]);

  // Fetch all subjects for the “Pretraži predmete” card
  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        const fetchedSubjects = await getSubjects();
        setAllSubjects(fetchedSubjects.subjects);
        setFilteredSubjects(fetchedSubjects.subjects);
      } catch (error) {
        console.error("Error fetching subjects.", error);
      }
    };

    if (user?.id) {
      fetchAllSubjects();
    }
  }, [user.id]);

  // Filter subjects by searchTerm
  useEffect(() => {
    const filtered = allSubjects.filter((subject) =>
      subject.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubjects(filtered);
  }, [searchTerm, allSubjects]);

  const goToSubject = (subjectUrl) => {
    navigate(`/subject/${subjectUrl}`);
  };

  return (
    <>

      <div className={styles["profile-page-wrapper"]}>
        {/* Toast for notifications */}
        <Toast ref={toast} />

        <div className={styles["content-wrapper"]}>
          <div className={styles["content-wrapper"]}>
            <div className={styles["side-by-side"]}>
              {/* LEFT CARD: Calendar */}
              <Card
                title="Tvoji zahtjevi i budući termini"
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
                    onSelectEvent={(event) => alert(`You clicked on session: ${event.title}`)}
                    eventPropGetter={(event) => {
                      let backgroundColor;
                      if (event.status === "Pending") {
                        backgroundColor = "#ffc107";
                      } else if (event.status === "Confirmed") {
                        backgroundColor = "#28a745";
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

              {/* RIGHT CARD: “Pretraži predmete” */}
              <Card
                title="Pretraži predmete"
                className={`${styles["subject-card"]} ${styles["join-subject-card"]}`}
              >
                <InputText
                  placeholder="Pretraži predmete"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles["subject-search"]}
                />

                <div className={styles["scrollable-subject-list"]}>
                  <Accordion multiple>
                    {filteredSubjects.map((subject) => (
                      <AccordionTab
                        key={subject.id}
                        header={<h4>{subject.title}</h4>}
                      >
                        <div className={styles["subject-item-content"]}>
                          <p>
                            {subject.description || "No description available."}
                          </p>
                          <Button
                            label="Odi na stranicu predmeta"
                            className={styles["p-button-success"]}
                            rounded
                            onClick={() => goToSubject(subject.url)}
                          />

                        </div>
                      </AccordionTab>
                    ))}
                  </Accordion>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentHomePage;
