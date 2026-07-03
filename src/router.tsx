import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom";
import MainScreen from "./screens/main-screen";
import LoginScreen from "./screens/login-screen";
import MyInfoScreen from "./screens/my-info-screen";
import OtherInfoScreen from "./screens/other-info-screen";
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
      { path: "/my-info", element: <MyInfoScreen /> },
      { path: "/other-info", element: <OtherInfoScreen /> },
      { path: "/payment", element: <PaymentScreen /> },
    ],
  },
]);

export default router;
