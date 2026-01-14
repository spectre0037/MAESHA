import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaEnvelope, FaExclamationCircle } from "react-icons/fa";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Authentication Error:", err);
    }
  };

  return (
    <div className="min-h-screen lg:min-h-[90vh] flex items-center justify-center bg-[#F7F7F7] px-4 py-10 font-['Poppins']">
      {/* Container with Entry Animation */}
      <div className="max-w-[450px] w-full bg-white p-6 sm:p-8 md:p-12 rounded-[15px] shadow-lg md:shadow-sm border border-[#EDEDED] transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {/* Branding/Header */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-[20px] md:text-[24px] font-bold text-[#212121] uppercase tracking-[0.2em] mb-2">
            <span className="text-[#BA7786]">LOGIN</span>
          </h1>
          <div className="w-10 md:w-12 h-[2px] bg-[#212121] mx-auto mb-4"></div>
          <p className="text-[#787878] text-[12px] md:text-[13px] font-medium italic px-2">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error Alert Display with Animation */}
        {error && (
          <div className="bg-[#fff1f2] border border-[#BA7786] p-4 mb-6 rounded-[8px] flex items-center gap-3 animate-bounce-short">
            <FaExclamationCircle className="text-[#BA7786] flex-shrink-0" />
            <p className="text-[#212121] text-[11px] md:text-[12px] font-bold uppercase tracking-tight">
              {typeof error === "string"
                ? error
                : error.message || "Access Denied"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Email Field */}
          <div className="space-y-2 group">
            <label className="text-[10px] md:text-[11px] font-bold text-[#212121] uppercase tracking-widest flex items-center gap-2 transition-colors group-focus-within:text-[#BA7786]">
              <FaEnvelope className="text-[#787878] group-focus-within:text-[#BA7786]" />{" "}
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-[#EDEDED] rounded-[8px] focus:border-[#BA7786] focus:ring-1 focus:ring-[#BA7786] outline-none transition-all duration-300 text-[14px] text-[#454545] bg-gray-50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2 group">
            <div className="flex justify-between items-center">
              <label className="text-[10px] md:text-[11px] font-bold text-[#212121] uppercase tracking-widest flex items-center gap-2 transition-colors group-focus-within:text-[#BA7786]">
                <FaLock className="text-[#787878] group-focus-within:text-[#BA7786]" />{" "}
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-[#787878] hover:text-[#BA7786] uppercase tracking-tighter transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-[#EDEDED] rounded-[8px] focus:border-[#BA7786] focus:ring-1 focus:ring-[#BA7786] outline-none transition-all duration-300 text-[14px] text-[#454545] bg-gray-50 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#212121] text-white py-3 md:py-4 rounded-[8px] font-bold uppercase text-[11px] md:text-[12px] tracking-widest hover:bg-[#BA7786] active:scale-[0.98] transition-all duration-300 disabled:bg-[#EDEDED] disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Secure Access"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 md:mt-10 pt-6 border-t border-[#EDEDED] text-center">
          <p className="text-[#787878] text-[11px] md:text-[12px] font-medium">
            Not a member yet?{" "}
            <Link
              to="/register"
              className="text-[#212121] font-bold hover:text-[#BA7786] transition-colors uppercase tracking-tight ml-1 inline-block"
              onClick={() => dispatch(clearError())}
            >
              register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
