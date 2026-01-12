import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout, setLoading } from "./redux/slices/authSlice"; // Added setLoading
import { fetchWishlist } from "./redux/slices/wishlistSlice";
import API from "./api";

// Pages & Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Wishlist from "./pages/WishList";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory"; 
import MyOrders from "./pages/MyOrders"; 
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsandConditions";
import HelpCenter from "./pages/HelpCenter";

// Scroll Reset Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isAppReady, setIsAppReady] = useState(false);

  // 1. Initialize Auth on App Load
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Set Axios default header
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const parsedUser = JSON.parse(savedUser);
          
          // Sync Redux State & Turn off loading
          dispatch(setUser(parsedUser));
        } catch (error) {
          console.error("Session corrupted:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(logout());
        }
      } else {
        // If no user/token, tell Redux to stop loading state
        dispatch(setLoading(false));
      }
      // Tell the app initialization is complete
      setIsAppReady(true);
    };

    initializeAuth();
  }, [dispatch]);

  // 2. Sync Wishlist: Only fetch if user is a CUSTOMER
  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      dispatch(fetchWishlist());
    }
  }, [user, isAuthenticated, dispatch]);

  // 3. Initial App Loading Screen
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
        <Routes>
          {/* --- PUBLIC ACCESSIBLE ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/my-orders" element={<MyOrders/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/Terms-And-Conditions" element={<TermsAndConditions/>} />
          <Route path="/Help-center" element={<HelpCenter/>} />
          

          {/* --- GUEST ONLY ROUTES --- */}
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

          {/* --- CUSTOMER ONLY ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory />} />
          </Route>

          {/* --- ADMIN ONLY ROUTES --- */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          {/* --- ERROR HANDLING --- */}
          <Route
            path="/unauthorized"
            element={
              <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <h1 className="text-4xl font-black text-red-500 mb-2">Access Denied</h1>
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
            }
          />

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <div className="text-9xl font-black opacity-10 mb-4">404</div>
                <h2 className="text-2xl font-bold text-slate-800">Collection Not Found</h2>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold"
                >
                  Return Home
                </button>
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
