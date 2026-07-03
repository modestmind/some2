import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom";
import MainScreen from "./screens/main-screen";
import LoginScreen from "./screens/login-screen";
import MyProfileScreen from "./screens/my-profile-screen";
import OtherProfileScreen from "./screens/other-profile-screen";
import PaymentScreen from "./screens/payment-screen";
import ToastComponent from "./components/toast-component";

const RootLayout = () => (
  <>
    <ScrollRestoration />
    <Outlet />
    <ToastComponent />
  </>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <MainScreen /> },
      { path: "/main", element: <MainScreen /> },
      { path: "/login", element: <LoginScreen /> },
      { path: "/my-profile", element: <MyProfileScreen /> },
      { path: "/other-profile", element: <OtherProfileScreen /> },
      { path: "/payment", element: <PaymentScreen /> },
    ],
  },
]);

export default router;
