export async function getSessionDetails(sessionId) {
  const url = `${import.meta.env.VITE_REACT_BACKEND_URL}/sessions/${sessionId}`;
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  return makeRequestWithRetry(url, options);
}

