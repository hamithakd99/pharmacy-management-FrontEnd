
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

interface StoredUser {
    role?: string;
}

export default function ProtectedRoute({
    allowedRoles,
}: ProtectedRouteProps) {
    const location = useLocation();

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    let user: StoredUser | null = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    // Login වී නැත්නම් හෝ user data වලංගු නොවේ නම්
    if (!token || !user?.role) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Role එකට අවසර නැත්නම් අදාළ dashboard එකට යවන්න
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        switch (user.role) {
            case "ADMIN":
                return <Navigate to="/admin" replace />;

            case "CASHIER":
                return <Navigate to="/cashier" replace />;

            case "EMPLOYEE":
                return <Navigate to="/employee" replace />;

            default:
                return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
}
