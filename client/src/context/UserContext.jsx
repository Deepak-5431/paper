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

    
    useEffect(() => {
      if (authState.user && authState.accessToken) {
        localStorage.setItem("user", JSON.stringify(authState.user));
        localStorage.setItem("access_token", authState.accessToken);
        localStorage.setItem("refresh_token", authState.refreshToken);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }, [authState]);

    return (
      <UserContext.Provider value={{ authState, setAuthState }}>
        {children}
      </UserContext.Provider>
    );
  };


  export const useUser = () => useContext(UserContext);