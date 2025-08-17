import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home.jsx";
import Contact from "../Pages/Contact/Contact.jsx";
import Login from "../Auth/Login/Login.jsx";
import Register from "../Auth/Register/Register.jsx";
import ErrorPage from "../Pages/Error/ErrorPage.jsx";
import PrivateRoute from "../Components/PrivateRoute.jsx";
import Dashboard from "../Pages/Dashboard/Dashboard.jsx";
import EmployeeDetails from "../Pages/Dashboard/HR/EmployeeDetails.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/dashboard",
                element: <PrivateRoute><Dashboard /></PrivateRoute>,
            },
            {
                path: "/dashboard/employee-details/:email",
                element: <PrivateRoute><EmployeeDetails /></PrivateRoute>,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ]
    },
], {
    future: {
        v7_startTransition: true,
    }
});
