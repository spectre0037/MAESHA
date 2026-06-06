import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setUser, logout, setLoading } from "./redux/slices/authSlice";
import API from "./api";

// Components loaded immediately
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Categories = lazy(() => import("./pages/Categories"));
const Wishlist = lazy(() => import("./pages/WishList"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() =>
  import("./pages/TermsAndConditions")
);
const HelpCenter = lazy(() => import("./pages/HelpCenter"));

// Large admin bundle separated
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard")
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const UnauthorizedPage = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center px-4">
    <h1 className="text-4xl font-black text-red-500 mb-2">
      Access Denied
    </h1>

    <p className="text-slate-500 max-w-md">
      You do not have the required permissions to access this page.
    </p>

    <button
      onClick={() => (window.location.href = "/")}
      className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
    >
      Back to Shop
    </button>
  </div>
);

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center py-32 text-slate-400">
    <div className="text-9xl font-black opacity-10 mb-4">
      404
    </div>

    <h2 className="text-2xl font-bold text-slate-800">
      Collection Not Found
    </h2>

    <button
      onClick={() => (window.location.href = "/")}
      className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold"
    >
      Return Home
    </button>
  </div>
);

function App() {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [isAppReady, setIsAppReady] = useState(false);

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          API.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;

          dispatch(setUser(JSON.parse(savedUser)));
        } else {
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error("Session corrupted:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        dispatch(logout());
      } finally {
        setIsAppReady(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Optional: prefetch common pages after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      import("./pages/ProductDetail");
      import("./pages/Categories");

      if (isAuthenticated) {
        import("./pages/Cart");
        import("./pages/WishList");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (!isAppReady) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />

      <Navbar />

      <div className="min-h-screen bg-slate-50 transition-colors duration-500">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />
            <Route
              path="/categories"
              element={<Categories />}
            />
            <Route
              path="/my-orders"
              element={<MyOrders />}
            />
            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route
              path="/help-center"
              element={<HelpCenter />}
            />

            {/* Guest Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Customer Routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["customer"]}
                />
              }
            >
              <Route
                path="/wishlist"
                element={<Wishlist />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={<Checkout />}
              />
              <Route
                path="/order-history"
                element={<OrderHistory />}
              />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                />
              }
            >
              <Route
                path="/admin/*"
                element={<AdminDashboard />}
              />
            </Route>

            {/* Unauthorized */}
            <Route
              path="/unauthorized"
              element={<UnauthorizedPage />}
            />

            {/* 404 */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </Router>
  );
}

export default App;