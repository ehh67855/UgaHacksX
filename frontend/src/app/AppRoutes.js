import { Outlet, useRoutes } from "react-router-dom";
import LayoutPage from "src/layout/LayoutPage";
import App from "./App";
import NotFound from "src/notFound/NotFound";
import Login from "src/login/Login";
import RegisterPage from "src/register/RegisterPage";
import ForgotPassword from "src/ForgotPassword/ForgotPassword";
import PasswordReset from "src/ForgotPassword/PasswordReset";
import ActivateAccount from "src/register/ActivateAccount";
import SignupConfirmation from "src/register/SignupConfirmation";
import NewProject from "src/newProject/newproject";

const AppRoutes = () => {
    let routes = useRoutes([
      {
        path: '/',
        element: <LayoutPage><Outlet /></LayoutPage>,
        children: [
          { index: true, element: <App /> },
          { path: 'login', element: <Login /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'reset-password', element: <PasswordReset /> },
          { path: 'activate-account', element: <ActivateAccount /> },
          { path: 'signup-confirmation', element: <SignupConfirmation /> },
          { path: 'newproject', element: <NewProject /> },
          { path: '*', element: <NotFound /> }
        ]
      }
    ]);
    return routes;
};

export default AppRoutes;