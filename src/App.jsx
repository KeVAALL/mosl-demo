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
import CommonLayout from "./layout/CommonLayout/commonLayout";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import User from "./pages/authenticated/User";
import Role from "./pages/authenticated/Role";
import Dashboard from "./pages/authenticated/Dashboard";
import Project from "./pages/authenticated/Project";
import Application from "./pages/authenticated/Application";
import DynamicLink from "./pages/authenticated/DynamicLink";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { useSelector } from "react-redux";

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
          element: <SignIn />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "home",
          element: <Layout />,
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
          children: menu.map((item) => ({
            path: item.menu_url,
            element: componentMapping[item.menu_url] || <>No Component Found</>,
          })),
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
        {/* <ThemeProvider theme={theme}> */}
        <ToasterProvider>
          <RouterProvider router={appLayout} />
        </ToasterProvider>
        {/* </ThemeProvider> */}
      </ThemeCustomization>
    </>
  );
}

export default App;
