import "./HomePage.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InstructorsComponent from "../../components/instructors/InstructorsComponent";
import { getSubjects } from "../../api/SubjectApi";
import { getInstructors, getStudentSessions } from "../../api/InstructorApi";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";

// Calendar localizer
const localizer = momentLocalizer(moment);

function ComboBox() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getSubjects().then((response) => setSubjects(response.subjects));
  }, []);

  const handleSubjectSelect = (event, value) => {
    if (value) {
      window.location.href = `/subject/${value.url}`;
    }
  };

  return (
    <div className="search-container">
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={subjects}
        getOptionLabel={(option) => option.title}
        onChange={handleSubjectSelect}
        renderInput={(params) => (
          <TextField {...params} label="Search Subjects" variant="outlined" />
        )}
      />
    </div>
  );
}

function StudentHomePage() {
  const [instructors, setInstructors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchInstructors = async () => {
      const fetchedInstructors = await getInstructors();
      setInstructors(fetchedInstructors.instructors);
    };

    const fetchSessions = async () => {
      try {
        const response = await getStudentSessions(JSON.parse(user).id);
        setSessions([
          ...response.pastSessions.map((session) => ({
            id: session.sessionId,
            title: `${session.subject.title} (${session.user.name} ${session.user.surname})`,
            start: new Date(session.dateTime),
            end: new Date(session.dateTimeEnd),
          })),
          ...response.upcomingSessions.map((session) => ({
            id: session.sessionId,
            title: `${session.subject.title} (${session.user.name} ${session.user.surname})`,
            start: new Date(session.dateTime),
            end: new Date(session.dateTimeEnd),
          })),
        ]);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };

    fetchInstructors();
    fetchSessions();
  }, []);

  return (
    <div className="homepage-wrapper">
      <div className="homepage-container">
        {/* Left Column */}
        <div className="left-column">
          <div className="calendar-container">
            <h3 className="title">Tvoji budući i prošli termini</h3>
            <Calendar
              localizer={localizer}
              events={sessions}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={(event) =>
                alert(`You clicked on session: ${event.title}`)
              }
              eventPropGetter={() => ({
                style: {
                  backgroundColor: "#00a3f0",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                },
              })}
            />
          </div>
          <h3 className="title">Pretraži predmete</h3>
          <ComboBox />
        </div>

        {/* Right Column */}
        <div className="right-column">
          <h4 className="title">Najpopularniji instruktori:</h4>
          <InstructorsComponent
            instructors={instructors}
            sessions={null}
            showSubject={true}
            showInstructionsCount={true}
            isOnProfilePage={false}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentHomePage;
