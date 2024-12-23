import axios from "axios";

export const handleLogin = async (data, roleId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/login/${roleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Include cookies
      }
    );

    if (response.ok) {
      const result = await response.json();

      // Clear any old stored data
      localStorage.removeItem("user");

      // Add role status and store user info
      const user = { ...result.user, status: roleId === 1 ? "student" : "instructor" };

      localStorage.setItem("user", JSON.stringify(user));

      // Redirect the user
      window.location.href = "/";
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }
  } catch (error) {
    console.error("An error occurred in handleLogin:", error);
    throw error; // Propagate error
  }
};



export const handlerRegister = async (formData, roleId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/register/${roleId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.status === 201) {
      console.log(user + " registered successfully");
      window.location.href = "/register-success";
    } else {
      console.error(response.status + " " + response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};


export const logout = async () => {

  try {
    const response = await fetch(
      import.meta.env.VITE_REACT_BACKEND_URL + "/logout",
      {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        credentials: "include"
      }
    );
    window.location.href = "/login";
    if (!response.ok) {
      throw new Error("Unable to log user out.");
    }
    localStorage.removeItem("user");

  } catch (error) {
    console.error("An error occurred:", error);
  }

};
