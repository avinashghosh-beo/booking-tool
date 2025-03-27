import React, { ReactNode, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BookingTool from "./screens/BookingTool";
import LoginScreen from "./screens/Login";
import PageNotFound from "./screens/PageNotFound";
import { useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/hoc/MainLayout";
import Register from "./screens/Register";
import ForgotPassword from "./screens/ForgotPassword";
import PaymentSuccess from "./screens/Payment/PaymentSuccess";
import OrderStatus from "./screens/OrderStatus";
import FullScreenLayout from "./components/hoc/FullScreenLayout";
import Landing from "./screens/Landing";
import Spinner from "./components/common/Spinner";

// PrivateRoute component to protect private routes
interface PrivateRouteProps {
  children: ReactNode;
}

export const adminRoutes = [];

export const userRoutes = [
  {
    name: "Payment Success",
    alias: "paymentSuccess",
    route: "/payment/success",
    component: <PaymentSuccess />,
  },
  {
    name: "Order Success",
    alias: "orderSuccess",
    route: "/order-success",
    component: <OrderStatus />,
  },
  {
    name: "Booking Tool",
    alias: "bookingTool",
    route: "/booking-tool",
    requiredRights: ["BookingRights"],
    component: <BookingTool />,
  },
];

export const commonRoutes = [];

const protectedFullScreenRoutes = [];

function PrivateRoute({ children }: PrivateRouteProps) {
  const { auth, loading } = useAuth();

  // Show a loading spinner or placeholder while auth is being initialized
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppNavigator() {
  const { auth, loading } = useAuth();

  const rightsArray = useMemo(() => {
    //only return the keys that are true
    return Object.keys(auth?.user?.rights || {}).filter(
      (key) => auth?.user?.rights[key]
    );
  }, [auth?.user?.rights]);

  const userRole = useMemo(() => {
    let roleId = auth?.user?.role?.ID;
    if (roleId === 2) return "user";
    if (roleId === 4) return "admin";
    return false;
  }, [auth?.user?.role]);

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={auth ? <Navigate to="/" replace /> : <LoginScreen />}
      />
      <Route
        path="/register"
        element={auth ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={auth ? <Navigate to="/" replace /> : <ForgotPassword />}
      />
      <Route path="/" element={<Landing />} />
      <Route element={<MainLayout />}>
        {userRole == "admin"
          ? adminRoutes.map((item, key) => {
              if (item?.requiredRights) {
                const hasAllRights = item.requiredRights.every((right) =>
                  rightsArray.includes(right)
                );
                if (!hasAllRights) {
                  return (
                    <Route
                      key={key}
                      path={item.route}
                      element={<div>You donot have access to this page</div>}
                    />
                  );
                }
                return (
                  <Route
                    key={key}
                    path={item.route}
                    element={<PrivateRoute>{item.component}</PrivateRoute>}
                  />
                );
              }
              return (
                <Route
                  key={key}
                  path={item.route}
                  element={<PrivateRoute>{item.component}</PrivateRoute>}
                />
              );
            })
          : userRoutes.map((item, key) => {
              if (item.requiredRights) {
                const hasAllRights = item.requiredRights.every((right) =>
                  rightsArray.includes(right)
                );
                if (!hasAllRights) {
                  return (
                    <Route
                      key={key}
                      path={item.route}
                      element={<div>You donot have access to this page</div>}
                    />
                  );
                }
                return (
                  <Route
                    key={key}
                    path={item.route}
                    element={<PrivateRoute>{item.component}</PrivateRoute>}
                  />
                );
              }
              return (
                <Route
                  key={key}
                  path={item.route}
                  element={<PrivateRoute>{item.component}</PrivateRoute>}
                />
              );
            })}

        {commonRoutes.map((item, key) => {
          return (
            <Route
              key={key}
              path={item.route}
              element={<PrivateRoute>{item.component}</PrivateRoute>}
            />
          );
        })}
      </Route>

      <Route element={<FullScreenLayout />}>
        {auth?.user?.role !== "admin" &&
          protectedFullScreenRoutes.map((item, key) => {
            return (
              <Route
                key={key}
                path={item.route}
                element={<PrivateRoute>{item.component}</PrivateRoute>}
              />
            );
          })}
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppNavigator;
