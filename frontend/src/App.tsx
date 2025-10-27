import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";

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
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import { CustomThemeProvider } from "./contexts/ThemeContext.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// lazy load heavy/rarely used components
const RegisterForm = lazy(() => import("./components/auth/RegisterForm.tsx"));
// const ForgotPasswordForm = lazy(() => import("./components/auth/ForgotPasswordForm.tsx"));
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const Dashboard = lazy(() => import("./components/MainPage/Dashboard.tsx"));
const TimeSheetPage = lazy(() => import("./pages/TimeSheetPage.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage.tsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.tsx"));
const AbsenceCalendarPage = lazy(() => import("./pages/AbsenceCalendarPage.tsx"));

const LegalLayout = lazy(() => import("./pages/legalRequirements/LegalLayout.tsx"));
const ImpressumPage = lazy(() => import("./pages/legalRequirements/ImpressumPage.tsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/legalRequirements/PrivacyPolicyPage.tsx"));
const TermsOfService = lazy(() => import("./pages/legalRequirements/TermsOfService.tsx"));
const AccessibilityStatement = lazy(() => import("./pages/legalRequirements/AccessibilityStatement.tsx"));
const ContactPage = lazy(() => import("./pages/legalRequirements/ContactPage.tsx"));
const LandingLayout = lazy(() => import("./pages/LandingLayout.tsx"));

function App() {
    const router = createBrowserRouter([

        // landing page layout
        {
            path: "/",
            element: <LandingLayout/>,
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <HomePage/>
                        </Suspense>
                    ),
                },
                {
                    path: 'home',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            < HomePage/>
                        </Suspense>
                    ),
                },
            ],
        },
        // main application routes
        {
            element: <RootLayout/>,
            children: [
                {
                    path: "dashboard",
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <Dashboard/>
                        </Suspense>
                    ),
                },
                {
                    path: 'timesheet',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <TimeSheetPage/>
                        </Suspense>
                    )
                },
                {
                    path: 'absence-calendar',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <AbsenceCalendarPage/>
                        </Suspense>
                    )
                },
                {
                    path: "account-settings",
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <SettingsPage/>
                        </Suspense>
                    )
                },
            ]
        },

        // authentication pages
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
                // route deactivated until contact form is ready
                // {
                //     path: 'forgot-password',
                //     element: (
                //         <Suspense fallback={ <div><LoadingSpinner/></div> }>
                //             <ForgotPasswordForm/>
                //         </Suspense>
                //     ),
                // },
            ]
        },

        // legally required pages - accessible by everyone
        {
            path: '/legal',
            element: (
                <Suspense fallback={ <div><LoadingSpinner/></div> }>
                    <LegalLayout/>
                </Suspense>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to="/legal/impressum" replace/>,
                },
                {
                    path: 'impressum',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <ImpressumPage/>
                        </Suspense>
                    ),
                },
                {
                    path: 'privacy-policy',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <PrivacyPolicyPage/>
                        </Suspense>
                    )
                },
                {
                    path: 'accessibility-statement',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <AccessibilityStatement/>
                        </Suspense>
                    )
                },
                {
                    path: 'contact',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <ContactPage/>
                        </Suspense>
                    )
                },
                {
                    path: 'terms-of-service',
                    element: (
                        <Suspense fallback={ <div><LoadingSpinner/></div> }>
                            <TermsOfService/>
                        </Suspense>
                    )
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
        {
            path: "/unauthorized",
            element: (
                <Suspense fallback={ <div><LoadingSpinner/></div> }>
                    <UnauthorizedPage/>
                </Suspense>
            )
        },
        {
            path: "/forbidden",
            element: (
                <Suspense fallback={ <div><LoadingSpinner/></div> }>
                    <UnauthorizedPage
                        message="You don't have permission to access this page."
                        showHomeButton={ true }
                    />
                </Suspense>
            )
        },
        {
            path: "/404",
            element: (
                <Suspense fallback={ <div><LoadingSpinner/></div> }>
                    <NotFoundPage/>
                </Suspense>
            )
        },
        // Catch-all route for 404s
        {
            path: "*",
            element: (
                <Suspense fallback={ <div><LoadingSpinner/></div> }>
                    <NotFoundPage/>
                </Suspense>
            )
        },
    ]);

    return (
        <Provider store={ store }>
            <CustomThemeProvider>
                <LocalizationProvider dateAdapter={ AdapterDayjs }>
                    <RouterProvider router={ router }/>
                </LocalizationProvider>
            </CustomThemeProvider>
        </Provider>
    );
}

export default App;
