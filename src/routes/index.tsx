import type { RouteObject } from "react-router-dom";
import App from "../components/pages/App/App";

const routes: Array<RouteObject> = [
    {
        path: "/",
        element: <App/>
    }
]
export default routes;