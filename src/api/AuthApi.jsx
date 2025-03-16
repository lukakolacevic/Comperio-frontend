import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";


export const handleLogin = async (data, roleId, setUser) => { // ✅ Accept setUser as a parameter
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/login/${roleId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Ensures the authentication cookie is sent
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }

    const userResponse = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/current-user`,
      {
        method: "GET",
        credentials: "include", // Ensures cookies are sent
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data after login");
    }

    const { user } = await userResponse.json();

    setUser(user); // ✅ Use the passed-in setUser function

    window.location.href = "/home";
  } catch (error) {
    console.error("Login error:", error);
    throw error;
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