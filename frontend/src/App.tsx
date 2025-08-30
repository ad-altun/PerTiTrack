import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Root from "./pages/Root.tsx";
import './App.css'
import Home from "./pages/Home.tsx";
import Timesheet from "./pages/Timesheet.tsx";
import Login from "./pages/Login.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: '/timesheet',
                element: <Timesheet/>
            },
            {
                path: '/auth',
                element: <Login/>
            }
        ]
    }
])

function App() {

    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
