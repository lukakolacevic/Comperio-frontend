import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { getSessionDetails, editSessionNote } from "../../api/SessionApi"; // Adjust path as needed
import styles from "./SessionDetailsPage.module.css";
import { useAuth } from "../../context/AuthContext";

function SessionDetailsPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState("");
  const [editing, setEditing] = useState(false);
  const toast = useRef(null);
  const { user } = useAuth();
  const roleId = user?.roleId; // Parse roleId from localStorage

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await getSessionDetails(id); // Fetch session details
        setSession(response.sessionDetails);
        setNotes(response.note || ""); // Default to empty if note is null
      } catch (error) {
        console.error("Error fetching session details:", error);
        toast.current?.show({
          severity: "error",
          summary: "Greška",
          detail: "Nije moguće dohvatiti podatke o terminu.",
          life: 3000,
        });
      }
    };

    fetchSessionDetails();
  }, [id]);

  const handleSaveNotes = async () => {
    try {
      await editSessionNote(id, notes); // Save the note
      setEditing(false);
      
    } catch (error) {
      console.error("Error saving note:", error);
      
    }
  };

  const getStatusMessage = () => {
    const currentTime = new Date();
    const dateTimeEnd = new Date(session.dateTimeEnd);

    if (session.status === "Cancelled") return "Otkazano";
    if (session.status === "Confirmed") {
      return dateTimeEnd < currentTime ? "Obavljeno" : "Potvrđeno";
    }
    return "Nepotvrđen";
  };

  if (!session) return <p>Učitavanje podataka...</p>;

  return (
    <div className={styles["session-details-page"]}>
      <Toast ref={toast} />
      <div className={styles["card-row"]}>
        <Card
          title={`Predmet: ${session.subjectTitle}`}
          className={styles["subject-card"]}
        >
          <p>
            <strong>Početak termina:</strong>{" "}
            {new Date(session.dateTime).toLocaleString()}
          </p>
          <p>
            <strong>Kraj termina:</strong>{" "}
            {new Date(session.dateTimeEnd).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {getStatusMessage()}
          </p>
        </Card>
        {roleId === 1 ? (
          <Card
            title="Detalji o profesoru"
            className={styles["student-card"]}
          >
            <p>
              <strong>Ime:</strong> {`${session.instructorName} ${session.instructorSurname}`}
            </p>
            <p>
              <strong>Email:</strong> {session.instructorEmail}
            </p>
          </Card>
        ) : (
          <Card title="Detalji o studentu" className={styles["student-card"]}>
            <p>
              <strong>Ime:</strong> {`${session.studentName} ${session.studentSurname}`}
            </p>
            <p>
              <strong>Email:</strong> {session.studentEmail}
            </p>
          </Card>
        )}
      </div>
      <div className={styles["card-row-bottom"]}>
        <Card title="Bilješka" className={styles["notes-card"]}>
          <div className={styles["note-wrapper"]}>
            {editing ? (
              <InputText
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles["note-input"]}
                placeholder="Unesite bilješku (max. 70 znakova)"
                maxLength={70}
              />
            ) : (
              <p className={styles["note-text"]}>
                {notes || "Nema bilješke za ovaj termin."}
              </p>
            )}
            {roleId === 2 && (
              <div>
                {!editing ? (
                  <i
                    className="pi pi-pencil"
                    onClick={() => setEditing(true)}
                    title="Uredi bilješku"
                  ></i>
                ) : (
                  <i
                    className="pi pi-check"
                    onClick={handleSaveNotes}
                    title="Spremi bilješku"
                  ></i>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SessionDetailsPage;
