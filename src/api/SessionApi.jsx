import { makeRequestWithRetry } from "./MakeRequest";

export async function getSessionDetails(sessionId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/sessions/${sessionId}`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

export async function editSessionNote(sessionId, newNote){
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/sessions/${sessionId}/edit-note`;
  const options = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ newNote: newNote })
  };
  return makeRequestWithRetry(url, options);
}