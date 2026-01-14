import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, registerUser } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaExclamationCircle,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Password Validation States
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    const password = formData.password;
    setValidations({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const isPasswordStrong = Object.values(validations).every(Boolean);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong) return;
    try {
      await dispatch(registerUser({ ...formData, role: "customer" })).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen lg:min-h-[90vh] flex items-center justify-center bg-[#F7F7F7] px-4 py-8 font-['Poppins']">
      <div className="max-w-[480px] w-full bg-white p-6 sm:p-10 md:p-12 rounded-[15px] shadow-lg md:shadow-sm border border-[#EDEDED] transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-6">
        <div className="text-center mb-8">
          <h1 className="text-[20px] md:text-[24px] font-bold text-[#212121] uppercase tracking-[0.2em] mb-2">
            JOIN <span className="text-[#BA7786]">MAESHA</span>
          </h1>
          <div className="w-12 h-[2px] bg-[#212121] mx-auto mb-4"></div>
          <p className="text-[#787878] text-[12px] md:text-[13px] font-medium italic">
            Create your account for a premium experience
          </p>
        </div>

        {error && (
          <div className="bg-[#fff1f2] border border-[#BA7786] p-4 mb-6 rounded-[8px] flex items-center gap-3 animate-shake">
            <FaExclamationCircle className="text-[#BA7786] flex-shrink-0" />
            <p className="text-[#212121] text-[11px] md:text-[12px] font-bold uppercase tracking-tight">
              {error.message || error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Name & Email Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-[10px] md:text-[11px] font-bold text-[#212121] uppercase tracking-widest flex items-center gap-2 group-focus-within:text-[#BA7786] transition-colors">
                <FaUser
                  className="text-[#787878] group-focus-within:text-[#BA7786]"
                  size={12}
                />{" "}
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-[#EDEDED] rounded-[8px] focus:border-[#BA7786] focus:ring-1 focus:ring-[#BA7786] outline-none transition-all duration-300 text-[14px] text-[#454545] bg-gray-50 focus:bg-white"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[10px] md:text-[11px] font-bold text-[#212121] uppercase tracking-widest flex items-center gap-2 group-focus-within:text-[#BA7786] transition-colors">
                <FaEnvelope
                  className="text-[#787878] group-focus-within:text-[#BA7786]"
                  size={12}
                />{" "}
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-3 border border-[#EDEDED] rounded-[8px] focus:border-[#BA7786] focus:ring-1 focus:ring-[#BA7786] outline-none transition-all duration-300 text-[14px] text-[#454545] bg-gray-50 focus:bg-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Enhanced Password Field */}
          <div className="space-y-1.5 md:space-y-2 group">
            <label className="text-[10px] md:text-[11px] font-bold text-[#212121] uppercase tracking-widest flex items-center gap-2 group-focus-within:text-[#BA7786] transition-colors">
              <FaLock
                className="text-[#787878] group-focus-within:text-[#BA7786]"
                size={12}
              />{" "}
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              className={`w-full px-4 py-3 border rounded-[8px] outline-none transition-all duration-300 text-[14px] text-[#454545] bg-gray-50 focus:bg-white ${
                formData.password && !isPasswordStrong
                  ? "border-orange-300"
                  : "border-[#EDEDED] focus:border-[#BA7786]"
              }`}
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Strength Meter Bars */}
            <div className="flex gap-1.5 mt-2 px-1">
              {[1, 2, 3].map((level) => {
                const strengthCount =
                  Object.values(validations).filter(Boolean).length;
                return (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      strengthCount >= level
                        ? level === 1
                          ? "bg-red-400"
                          : level === 2
                          ? "bg-orange-400"
                          : "bg-[#BA7786]"
                        : "bg-[#EDEDED]"
                    }`}
                  ></div>
                );
              })}
            </div>

            {/* Dynamic Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2">
              <ValidationItem
                isMet={validations.minLength}
                label="At least 8 characters"
              />
              <ValidationItem
                isMet={validations.hasNumber}
                label="At least one number"
              />
              <ValidationItem
                isMet={validations.hasSpecial}
                label="Special character (!@#$)"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#212121] text-white py-3.5 md:py-4 rounded-[8px] font-bold uppercase text-[11px] md:text-[12px] tracking-widest hover:bg-[#BA7786] active:scale-[0.98] transition-all duration-300 disabled:bg-[#EDEDED] disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-6"
            disabled={loading || !isPasswordStrong}
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 md:mt-10 pt-6 border-t border-[#EDEDED] text-center">
          <p className="text-[#787878] text-[12px] font-medium">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-[#212121] font-bold hover:text-[#BA7786] transition-colors ml-1 inline-block uppercase tracking-tight"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper component for validation items
const ValidationItem = ({ isMet, label }) => (
  <div
    className={`flex items-center gap-2 transition-all duration-300 ${
      isMet ? "text-[#212121]" : "text-[#B0B0B0]"
    }`}
  >
    {isMet ? (
      <FaCheckCircle className="text-[#BA7786] animate-in zoom-in" size={12} />
    ) : (
      <FaCircle className="opacity-20" size={8} />
    )}
    <span className="text-[10px] md:text-[11px] font-medium">{label}</span>
  </div>
);

export default Signup;
