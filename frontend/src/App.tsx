import './App.css';
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <Suspense fallback={ <div>Loading...</div> }>
                    <RootLayout/>
                </Suspense>
            ),
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={ <div>Loading...</div> }>
                            <Dashboard/>
                        </Suspense>
                    ),
                }
            ]
        },
        {
            path: "/",
            element: (
                <Suspense fallback={ <div>Loading...</div> }>
                    <AuthLayout/>
                </Suspense>
            ),
            children: [
                {
                    path: '/signin',
                    element: (
                        <Suspense fallback={ <div>Loading...</div> }>
                            <LoginForm/>
                        </Suspense>
                    ),
                },
                {
                    path: '/register',
                    element: (
                        <Suspense fallback={ <div>Loading...</div> }>
                            <RegisterForm/>
                        </Suspense>
                    ),
                },
                {
                    path: 'forgot-password',
                    element: (
                        <Suspense fallback={ <div>Loading...</div> }>
                            <ForgotPasswordForm/>
                        </Suspense>
                    ),
                },
            ]
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
