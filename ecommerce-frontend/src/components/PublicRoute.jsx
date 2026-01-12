import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth || {});
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // If loading is false, we are done initializing
    if (!loading) {
      setIsInitializing(false);
    } 
    // Safety: If stuck in loading for more than 1.5 seconds, force render
    const timer = setTimeout(() => setIsInitializing(false), 1500);
    return () => clearTimeout(timer);
  }, [loading]);

  // 1. Show nothing (or a spinner) only during the brief initial check
  if (isInitializing && loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. If user is logged in, redirect them away from Login/Register
  if (user) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // 3. If guest, show the page
  return children;
};

export default PublicRoute;