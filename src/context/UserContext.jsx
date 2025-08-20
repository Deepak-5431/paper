
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (user && accessToken) {
      setAuthState({ user, accessToken, refreshToken });
    }
  }, []);

  const logout = () => {
    console.log("Logout function called, clearing all local storage...");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userAnswers");
    localStorage.removeItem("questionStatus"); 
    localStorage.removeItem("questions");
    localStorage.removeItem("currentPaperId");

    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  };

  return (
    <UserContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);