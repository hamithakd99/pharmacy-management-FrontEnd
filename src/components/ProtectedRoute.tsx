import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let user: { role?: string } | null = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // Not logged in
  if (!token || !user?.role) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in, check role
//   if (user?.role !== "ADMIN") {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

  return <Outlet />;
}