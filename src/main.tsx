import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import store from "./store";
import {Provider} from "react-redux";
import {createHashRouter, RouterProvider} from "react-router-dom";
import routes from "./routes";
import AuthProvider from "./components/organisms/AuthProvider";


const router = createHashRouter(routes);
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </Provider>
    </React.StrictMode>,
)
