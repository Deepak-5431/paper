import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const SessionProtector = ({ children }) => {
  const { logout, hasActiveSession } = useUser();

  useEffect(() => {
    // Only apply protection if there is an active session
    if (!hasActiveSession) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave? Your session will end.";
    };

    const handleUnload = () => {
      logout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [logout, hasActiveSession]);

  return children;
};

export default SessionProtector;