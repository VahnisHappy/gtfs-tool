import type { RouteObject } from "react-router-dom";
import App from "../components/pages/App/App";
import Dashboard from "../components/pages/Dashboard";
import Login from "../components/pages/Login";
import LoginCallback from "../components/pages/LoginCallback";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/organisms/ProtectedRoute";

const routes: Array<RouteObject> = [
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/login/callback",
        element: <LoginCallback/>
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <DashboardLayout/>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard/>
            },{
                path: "app",
                element: <App/>
            }
        ]
    }
]
export default routes;