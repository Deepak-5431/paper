import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page1 from "./pages/page1";
import Page2 from "./pages/page2";
import Page3 from "./pages/page3";
import Page4 from "./pages/page4";
import Page5 from "./pages/Page5";
import Page6 from "./pages/page6";


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
      element: <Page1 />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/page2",
      element: <Page2 />,
    },
    {
      path: "/page3",
      element: <Page3 />,
    },
    {
      path: "/page4",
      element: <Page4 />,
    },
    {
      path: "/page5",
      element: <Page5 />,
    },
    {
      path: "/page6",
      element: <Page6 />,
    },
  ],
  {
    basename: "/paper", 
  }

);

  return <RouterProvider router={router} />;
}

export default App;
