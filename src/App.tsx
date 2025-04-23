import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import NotFound from "./pages/NotFound/NotFound"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  {
    path: "*",
    element: <NotFound message="Please provide relevant path"/>
  }

])

export const App = ()  => {
  
  return <RouterProvider router={router} />
  
}

