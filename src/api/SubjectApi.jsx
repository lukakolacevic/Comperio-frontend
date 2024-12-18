import { makeRequestWithRetry } from "./MakeRequest";

export async function getSubjects() {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/subjects`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function getSubject(url) {
  const fullUrl = `${import.meta.env.VITE_REACT_BACKEND_URL}/subject/${url}`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(fullUrl, options);
}

export async function createSubject(data) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/subjects`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  };
  return makeRequestWithRetry(url, options);
}

export async function getSubjectsForProfessor(instructorId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/instructors/${instructorId}/subjects`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function getTopSubjectsForStudent(studentId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/students/${studentId}/stats/popular-subjects`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function getTopProfessorsForStudent(studentId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/students/${studentId}/stats/popular-instructors`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}
