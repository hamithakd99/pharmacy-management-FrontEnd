
import { Navigate } from "react-router-dom";

type UserRole = "ADMIN" | "CASHIER" | "EMPLOYEE";

export default function RoleBasedRedirect() {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    const role = user.role as UserRole;

    switch (role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;

      case "CASHIER":
        return <Navigate to="/cashier" replace />;

      case "EMPLOYEE":
        return <Navigate to="/employee" replace />;

      default:
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}
