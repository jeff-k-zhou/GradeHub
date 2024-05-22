import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { NextUIProvider } from "@nextui-org/react"
import Grades from "./pages/Grades"
import Error from "./pages/Error"
import GPA from "./pages/GPA"
import Support from "./pages/Support"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/grades",
      element: <Grades />
    },
    {
      path: "/gpa",
      element: <GPA />
    },
    {
      path: "/support",
      element: <Support />
    }
  ])

  return (
    <NextUIProvider>
      { /* <main className="dark"> */}
      <RouterProvider router={router} />
      { /* </main> */}
    </NextUIProvider>
  )
}

export default App
