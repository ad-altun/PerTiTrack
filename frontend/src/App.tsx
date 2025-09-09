import './App.css';
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const LoginForm = lazy(() => import("./components/auth/LoginForm.tsx"));
const RootLayout = lazy(() => import("./pages/RootLayout.tsx"));
const AuthLayout = lazy(() => import("./pages/AuthLayout.tsx"));
const RegisterForm = lazy(() => import("./components/auth/RegisterForm.tsx"));
const ForgotPasswordForm = lazy(() => import("./components/auth/ForgotPasswordForm.tsx"));
const Dashboard = lazy(() => import('./components/Dashboard.tsx'));

// material-ui theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    }
});

// Loading component
const LoadingSpinner = () => (
    <div style={ { display: 'flex', justifyContent: 'center', padding: '2rem' } }>
        Loading...
    </div>
);

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Suspense fallback={ <div><LoadingSpinner/></div> }>
                    <RootLayout/>
                </Suspense>
            ),
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <Dashboard/>
                        </Suspense>
                    ),
                },
                {
                    path: "dashboard",
                    element: (
                        <Suspense fallback={ <LoadingSpinner/> }>
                            <Dashboard/>
                        </Suspense>
                    ),
                },
            ]
        },
        {
            path: "/auth",
            element: (
                <Suspense fallback={ <div><LoadingSpinner/></div> }>
                    <AuthLayout/>
                </Suspense>
            ),
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <LoginForm/>
                        </Suspense>
                    ),
                },
                {
                    path: 'signin',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <LoginForm/>
                        </Suspense>
                    ),
                },
                {
                    path: 'register',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <RegisterForm/>
                        </Suspense>
                    ),
                },
                {
                    path: 'forgot-password',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <ForgotPasswordForm/>
                        </Suspense>
                    ),
                },
            ]
        },
        // Redirect old routes to new structure
        {
            path: "/signin",
            element: <Navigate to="/auth/signin" replace/>,
        },
        {
            path: "/register",
            element: <Navigate to="/auth/register" replace/>,
        },
        {
            path: "/forgot-password",
            element: <Navigate to="/auth/forgot-password" replace/>,
        },
        // Catch-all route for 404s
        {
            path: "*",
            element: <div>Page not found</div>,
        },
    ]);

    return (
        <Provider store={ store }>
            <ThemeProvider theme={ theme }>
                <CssBaseline>
                    <RouterProvider router={ router }/>
                </CssBaseline>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
