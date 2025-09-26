import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    refreshToken: null,
  });
  
  const [wasRefreshed, setWasRefreshed] = useState(false);

  // Initialize auth state from sessionStorage - runs ONLY on actual page load
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const accessToken = sessionStorage.getItem("access_token");
    const refreshToken = sessionStorage.getItem("refresh_token");

    if (user && accessToken) {
      setAuthState({ user, accessToken, refreshToken });
    }

    // Detect ACTUAL page refresh (not SPA navigation)
    const detectPageRefresh = () => {
      // Method 1: Performance Navigation API
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        return true;
      }

      // Method 2: Check if page was loaded normally (not from cache)
      return performance.navigation.type === PerformanceNavigation.TYPE_RELOAD;
    };

    if (detectPageRefresh()) {
      setWasRefreshed(true);
      // Auto-clear after 5 seconds
      setTimeout(() => {
        setWasRefreshed(false);
      }, 5000);
    }
  }, []); // Empty dependency array - runs ONLY on initial page load

  // Persist auth state to sessionStorage
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