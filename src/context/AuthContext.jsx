import { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_REACT_BACKEND_URL}/current-user`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      
                      credentials: "include", // Include cookies
                    }
                  );
                
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user.data); // Save user in state
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    const isLoggedIn = !!user;
    const isInstructor = isLoggedIn && user.roleId === 2;
    //const isStudent = isLoggedIn && user.role === 1;

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, isInstructor, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
