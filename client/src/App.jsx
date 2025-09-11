import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page1 from "./pages/page1";
import Page2 from "./pages/page2";
import Page3 from "./pages/page3";
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
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Page1 />,
        errorElement: <ErrorPage />,
      },
        {
        path: "/page2/:paperId",
        element:(

          <ProtectedRoute>
            <Page2 />
            </ProtectedRoute>
        ) ,
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
        path: "/result/:paperId",
        element: (
         // <ProtectedRoute>
            <Page5 />
         // </ProtectedRoute>
        ),
      },
      {
        path: "/page6/:paperId",
        element: (
            <Page6 />
        ),
      },
      {
        path: "/select-test",
        element: <Page7 />,
      }, 
    ],
  );

  return <RouterProvider router={router} />;
}

export default App;