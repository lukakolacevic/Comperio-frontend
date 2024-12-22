import { makeRequestWithRetry } from "./MakeRequest";

export async function getInstructors() {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/instructors`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function sentInstructionDate(selectedDate, selectedLength, instructorId, subjectId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/sessions`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      dateTime: selectedDate,
      sessionLength: selectedLength,
      instructorId: instructorId,
      subjectId: subjectId,
    }),
  };
  return makeRequestWithRetry(url, options);
}

export async function getStudentSessions(studentId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/sessions/students/${studentId}`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function getInstructorSessions(instructorId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/sessions/instructors/${instructorId}`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function manageSessionRequest(sessionId, newStatus) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/sessions`;
  const options = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ sessionId: sessionId, newStatus: newStatus }),
  };
  return makeRequestWithRetry(url, options);
}

export async function removeInstructorFromSubject(instructorId, subjectId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/instructor/${instructorId}/subjects/${subjectId}`;
  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function joinSubject(instructorId, subjectId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/instructor/${instructorId}/subjects/${subjectId}`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}