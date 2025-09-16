import './App.css';
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const preloadCriticalRoutes = () => {
    // Preload Dashboard on app start
    import('./pages/HomePage.tsx');
};

// Call on app initialization
preloadCriticalRoutes();

// critical components non-lazy for faster initial load
import RootLayout from "./pages/RootLayout.tsx";
import AuthLayout from "./pages/AuthLayout.tsx";
import LoginForm from "./components/auth/LoginForm.tsx";

// lazy load heavy/rarely used components
const RegisterForm = lazy(() => import("./components/auth/RegisterForm.tsx"));
const ForgotPasswordForm = lazy(() => import("./components/auth/ForgotPasswordForm.tsx"));
const HomePage = lazy(() => import("./pages/HomePage.tsx"));

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
            element: <RootLayout/>,
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <HomePage />
                        </Suspense>
                    ),
                },
                {
                    path: "dashboard",
                    element: (
                        <Suspense fallback={ <LoadingSpinner/> }>
                            <HomePage />
                        </Suspense>
                    ),
                },
            ]
        },
        {
            path: "/auth",
            element: <AuthLayout/>,
            children: [
                {
                    index: true,
                    element: <LoginForm/>,
                },
                {
                    path: 'signin',
                    element: <LoginForm/>,
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
