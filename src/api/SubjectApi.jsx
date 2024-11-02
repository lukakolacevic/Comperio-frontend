export async function getSubjects() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/subjects`,
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
    const subjects = response.json();
    return subjects;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function getSubject(url) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/subject/${url}`,
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
    const subject = response.json();
    return subject;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function createSubject(data) {

  console.log(localStorage.getItem("token")) // kad sam stavio ovo, predmeti su se spremali u bazu, a kad sam maknuo je iskakao error 400
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/subjects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const subject = response.json();
    return subject;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

export async function getSubjectsForProfessor(professorId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/professors/${professorId}/subjects`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
}

//dodaj poziv na backend ovdje
export async function getTopSubjectsForStudent(studentId) {

  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/students/${studentId}/stats/popular-subjects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const subjects = response.json();
    return subjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }

}