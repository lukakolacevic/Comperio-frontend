export async function getProfessors() {
  try {
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/professors",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const professors = await response.json();
    console.log("Professors returned from database!")
    return professors;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function sentInstructionDate(selectedDate, professorId, subjectId) {
  try {
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          dateTime: selectedDate,
          professorId: professorId,
          subjectId: subjectId
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || "An unknown error occurred.");
      error.code = errorData.code; // Attach the error code
      throw error; // Throw the custom error with the code
    }

    const date = await response.json();
    return date;

  } catch (error) {
    console.error("Error in sentInstructionDate:", error);
    throw error;  // Re-throwing the error with code to the caller
  }
}


export async function getStudentSessions() {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_BACKEND_URL}/student/sessions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const instructions = await response.json();
  return instructions;
}

export async function getProfessorSessions() {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_BACKEND_URL}/professor/sessions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const sessions = response.json()
  return sessions;
}

export async function manageSessionRequest(sessionId, newStatus) {
  try {
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/sessions",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          sessionId: sessionId,
          newStatus: newStatus
        })
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJSON = await response.json();
    return responseJSON;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    throw error;
  }
}

export async function removeProfessorFromSubject(professorId, subjectId) {
  try {
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/professor-subjects",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          professorId: professorId,
          subjectId: subjectId
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("There has been an error with removing professor from subject.")
    throw error;
  }
}

export async function joinSubject(professorId, subjectId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/professor/${professorId}/subjects/${subjectId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json();
  } catch (error) {
    console.error("There has been an error with joining professor to subject.")
    throw error;
  }
}