import ProfessorsComponent from "../../components/professors/ProfessorsComponent.jsx";
import StudentsComponent from "../../components/students/StudentsComponent.jsx";
import { getStudentSessions, getProfessorSessions } from "../../api/ProfessorApi";
import "./ProfilePage.css";
import React, { useEffect, useState } from 'react';

function ProfilePage() {
  if (!localStorage.getItem("token")) {
    window.location.href = '/login';
  }
  let user = JSON.parse(localStorage.getItem('user'));
  const userType = user.status;

  const [pastSessions, setPastSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);

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

  return (
    <>
      <div className="profilepage-wrapper">
        <div className="profilepage-container">
          <div className="student-info">
            <img src={user.image} className="student-image" />
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
                  buttonText={"Prihvati zahtjev"}
                  setUpcomingSessions={setUpcomingSessions}  // Pass setter for optimistic update
                  setPendingRequests={setPendingRequests}    // Pass setter for optimistic update
                  setPastSessions={setPastSessions}
                  setCancelledSessions={setCancelledSessions}
                  isForUpcomingSessions={false}
                  isForPendingRequests={true}
                />
              </div>

              <div>
                <h4>Nadolazeće instrukcije:</h4>
                <StudentsComponent
                  sessions={upcomingSessions}
                  buttonText={"Otkaži instrukcije"}
                  setUpcomingSessions={setUpcomingSessions}  // Pass setter for optimistic update
                  setPendingRequests={setPendingRequests}    // Pass setter for optimistic update
                  setPastSessions={setPastSessions}
                  setCancelledSessions={setCancelledSessions}
                  isForUpcomingSessions={true}
                  isForPendingRequests={false}
                />
              </div>

              <div>
                <h4>Povijest instrukcija:</h4>
                <StudentsComponent
                  sessions={pastSessions}
                  buttonText={"Prihvati zahtjev"}
                  isForPastSessions={false}
                  isForPendingRequests={false}
                />
              </div>

              <div>
                <h4>Otkazane/odbijene instrukcije:</h4>
                <StudentsComponent
                  sessions={cancelledSessions}
                  buttonText={"Prihvati zahtjev"}
                  isForPastSessions={false}
                  isForPendingRequests={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
