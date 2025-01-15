import axios from "axios";
import { googleLogout } from "@react-oauth/google";


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
      window.location.href = "/home";
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
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 201) {
      console.log('User registered successfully');

      // Extract email from FormData
      const email = formData.get('email');

      // Save email to localStorage
      // Registration code
      localStorage.setItem('email', JSON.stringify(email));

      window.location.href = '/register-success';
    } else {
      console.error(response.status + ' ' + response.statusText);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};


export const logout = async () => {

  try {
    googleLogout();
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

    if (!response.ok) {
      throw new Error("Unable to log user out.");
    }
    localStorage.removeItem("user");
    window.location.href = "/";

  } catch (error) {
    console.error("An error occurred:", error);
  }

};

export const handleGoogleLogin = async (token, roleId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/google-login/${roleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
        credentials: "include",
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
      window.location.href = "/home";
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login with Google");
    }
  } catch (error) {
    console.error("An error occurred in handleGoogleLogin:", error);
    throw error;
  }
};