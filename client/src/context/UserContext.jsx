import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    refreshToken: null,
  });
  
  const [wasRefreshed, setWasRefreshed] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const accessToken = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");

    if (user && accessToken) {
      setAuthState({ user, accessToken, refreshToken });
    }

    const detectPageRefresh = () => {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        return true;
      }

      return performance.navigation.type === PerformanceNavigation.TYPE_RELOAD;
    };

    if (detectPageRefresh()) {
      setWasRefreshed(true);
      
      setTimeout(() => {
        setWasRefreshed(false);
      }, 5000);
    }
  }, []); 

  
  useEffect(() => {
    if (authState.user && authState.accessToken) {
      sessionStorage.setItem("user", JSON.stringify(authState.user));
      sessionStorage.setItem("access_token", authState.accessToken);
      sessionStorage.setItem("refresh_token", authState.refreshToken);
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
    }
  }, [authState]);

  const clearRefreshWarning = () => {
    setWasRefreshed(false);
  };

  const contextValue = {
    authState,
    setAuthState,
    wasRefreshed,
    clearRefreshWarning,
    isAuthenticated: !!(authState.user && authState.accessToken)
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);