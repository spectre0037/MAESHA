import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useSelector((state) => state.auth || {});
  const location = useLocation();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setTimedOut(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [loading]);

  // 1. Loading State
  if (loading && !timedOut) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    );
  }

  // 2. If NOT logged in, redirect to login
  if (!user) {
    console.log("Access Denied: Redirecting to login from", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Check: Use the 'allowedRoles' prop from App.jsx
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn("Role Access Denied: Redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. CRITICAL FIX: Use <Outlet /> for Nested Routes
  // This is what allows /cart and /wishlist to actually show up!
  return <Outlet />;
};

export default ProtectedRoute;