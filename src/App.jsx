import { createTheme, ThemeProvider } from "@mui/material";
import { ToasterProvider } from "./context/ToasterProvider";
import AuthGuard from "./utils/route-guard/AuthGuard";
import GuestGuard from "./utils/route-guard/GuestGuard";
import ThemeCustomization from "./themes";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "./layout/mainLayout";
import SignIn from "./pages/auth/SignIn";
import User from "./pages/authenticated/User";
import Role from "./pages/authenticated/Role";
import Dashboard from "./pages/authenticated/Dashboard";
import Project from "./pages/authenticated/Project";
import Application from "./pages/authenticated/Application";
import DynamicLink from "./pages/authenticated/DynamicLink";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { useSelector } from "react-redux";
import ResetSignIn from "./pages/auth/ResetSignIn.";
import LinkData from "./pages/authenticated/LinkData";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  const { menu } = useSelector((state) => state.menu);

  const componentMapping = {
    dashboard: <Dashboard />,
    project: <Project />,
    application: <Application />,
    "dynamic-links": <DynamicLink />,
    user: <User />,
    role: <Role />,
  };

  const appLayout = createBrowserRouter([
    {
      path: `/`,
      // element: (
      //   // <AuthGuard>
      //   // </AuthGuard>
      //   // <CommonLayout />
      // ),
      children: [
        {
          path: "/",
          element: <Navigate to="/sign-in" />,
        },
        {
          path: "sign-in",
          element: (
            <GuestGuard>
              <SignIn />
            </GuestGuard>
          ),
        },
        {
          path: "reset-sign-in",
          element: (
            <GuestGuard>
              <ResetSignIn />
            </GuestGuard>
          ),
        },
        {
          path: "forgot-password",
          element: (
            <GuestGuard>
              <ForgotPassword />
            </GuestGuard>
          ),
        },
        {
          path: "reset-password",
          element: (
            <GuestGuard>
              <ResetPassword />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "home",
          element: (
            <AuthGuard>
              <Layout />
            </AuthGuard>
          ),
          children: [
            ...menu
              ?.filter((m) => m?.display_flag === 1)
              ?.map((item) => ({
                path: item.menu_url,
                element: componentMapping[item.menu_url] || (
                  <>No Component Found</>
                ),
              })),
            {
              path: ":link_id",
              element: <LinkData />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <>No page found</>,
    },
  ]);

  return (
    <>
      <ThemeCustomization>
        <ToasterProvider>
          <RouterProvider router={appLayout} />
        </ToasterProvider>
      </ThemeCustomization>
    </>
  );
}

export default App;

// children: [
//   {
//     path: "dashboard",
//     element: <Dashboard />,
//   },
//   {
//     path: "user",
//     element: <User />,
//   },
//   {
//     path: "role",
//     element: <Role />,
//   },
//   {
//     path: "project",
//     element: <Project />,
//   },
//   {
//     path: "application",
//     element: <Application />,
//   },
//   { path: "dynamic-links", element: <DynamicLink /> },
// ],
