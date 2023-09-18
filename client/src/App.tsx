import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { NextUIProvider } from "@nextui-org/react"
import Dashboard from "./pages/Dashboard"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    }
  ])

  return (
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  )
}

export default App
