import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Page1 from "./pages/page1";
import Page2 from "./pages/page2";
import Page3 from "./pages/page3";
import Page4 from "./pages/page4";
import Page5 from "./pages/page5";
import Page6 from "./pages/page6";
import Page7 from "./pages/page7";
import ProtectedRoute from "./components/protectedRoute";

const ErrorPage = () => (
  <div>
    <h2>404 - Page Not Found</h2>
    <p>This route doesn't exist. Please go back.</p>
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Page1 />, // Public route
      errorElement: <ErrorPage />,
    },
    {
      path: "/page1", 
      element: <Page1 />, // Public route (same as '/')
    },
    {
      path: "/page2/:paperId",
      element: (
        <ProtectedRoute>
          <Page2 />
        </ProtectedRoute>
      ),
    },
    {
      path: "/page3/:paperId",
      element: (
        <ProtectedRoute>
          <Page3 />
        </ProtectedRoute>
      ),
    },
    {
      path: "/summary-page/:paperId",
      element: (
        <ProtectedRoute>
          <Page4 />
        </ProtectedRoute>
      ),
    },
    {
      path: "/result/:paperId",
      element: (
        <ProtectedRoute>
          <Page5 />
        </ProtectedRoute>
      ),
    },
    {
      path: "/page6/:paperId",
      element: (
        <ProtectedRoute>
          <Page6 />
        </ProtectedRoute>
      ),
    },
    {
      path: "/select-test",
      element: (
        <ProtectedRoute>
          <Page7 />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;