import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { selectCartCount } from "../redux/slices/cartSlice";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaShieldAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaHome,
  FaThLarge,
  FaHistory,
} from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const cartCount = useSelector(selectCartCount);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/");
    }
  };

  // Close menu when a link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="header-main bg-white border-b border-[#EDEDED] py-4 md:py-5 sticky top-0 z-[60] shadow-[0_5px_20px_hsla(0,0%,0%,0.05)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center gap-4">
            {/* 1. Hamburger Menu (Mobile Only) */}
            <button
              className="lg:hidden text-[#212121] p-2"
              onClick={() => setIsMenuOpen(true)}
            >
              <FaBars size={22} />
            </button>

            {/* 2. Logo */}
            <Link
              to="/"
              className="text-[28px] md:text-[34px] font-kenao font-extrabold text-[#76081F] tracking-[-0.04em] shrink-0 leading-none"
            >
              MaEsha
            </Link>

            {/* 3. Desktop Search Bar */}
            <div className="hidden lg:block flex-1 max-w-[500px] mx-10">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex w-full"
              >
                <input
                  type="text"
                  placeholder="What are you looking for?..."
                  className="w-full border border-[#EDEDED] text-[#454545] text-[14px] rounded-full py-2.5 px-6 outline-none focus:border-[#FF8F9C] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#787878] hover:text-[#FF8F9C]"
                >
                  <FaSearch size={16} />
                </button>
              </form>
            </div>

            {/* 4. Action Icons */}
            <div className="flex items-center space-x-3 md:space-x-6">
              {/* Search Toggle (Mobile Only) */}
              <button className="lg:hidden text-[#212121] p-2">
                <FaSearch size={20} />
              </button>

              {/* Admin Link (Desktop Only) */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-2 text-[#212121] hover:text-[#FF8F9C] text-[13px] font-bold uppercase tracking-widest transition-all"
                >
                  <FaShieldAlt /> ADMIN PANEL
                </Link>
              )}

              {/* Account (Desktop Only) */}
              <div className="hidden lg:flex items-center gap-2 group cursor-pointer relative">
                <FaUser size={20} className="text-[#212121]" />
                <div className="flex flex-col text-[12px] leading-none">
                  {user ? (
                    <>
                      <span className="text-[#787878] mb-1 truncate max-w-[80px]">
                        Hi, {user.name.split(" ")[0]}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="text-[#212121] font-bold text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[#787878] mb-1">Account</span>
                      <Link to="/login" className="text-[#212121] font-bold">
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Wishlist */}
              {user?.role === "customer" && (
                <Link
                  to="/wishlist"
                  className="relative text-[#212121] hover:text-[#FF8F9C] p-2"
                >
                  <FaHeart size={22} />
                  <span className="absolute top-1 right-1 bg-[#FF8F9C] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                </Link>
              )}

              {/* Cart */}
              {user?.role === "customer" && (
                <Link
                  to="/cart"
                  className="relative text-[#212121] hover:text-[#FF8F9C] p-2"
                >
                  <FaShoppingCart size={22} />
                  <span className="absolute top-1 right-1 bg-[#FF8F9C] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* 5. Mobile Search Bar (Only visible on small screens below Desktop) */}
          <div className="mt-4 lg:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-[#F7F7F7] border-none text-[14px] rounded-lg py-2.5 px-4 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#787878]"
              />
            </form>
          </div>
        </div>

        {/* 6. Desktop Menu Links */}
        <div className="hidden lg:block border-t border-[#EDEDED] mt-5 pt-4">
          <div className="container mx-auto px-4 flex justify-center space-x-12">
            <MenuLinks location={location} user={user} />
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[101] shadow-2xl transition-transform duration-300 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[#EDEDED] flex justify-between items-center">
          <span className="text-xl font-bold uppercase tracking-widest text-[#76081F]">
            Menu
          </span>
          <button onClick={closeMenu} className="text-[#212121]">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 flex flex-col space-y-6">
          <MenuLinks
            location={location}
            user={user}
            mobile
            onClick={closeMenu}
          />
          <hr className="border-[#EDEDED]" />
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <p className="text-[#787878] text-sm">
                  Logged in as{" "}
                  <span className="text-[#212121] font-bold">{user.name}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="text-left text-[#212121] font-bold uppercase text-sm tracking-widest text-red-500"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-[#212121] font-bold uppercase text-sm tracking-widest"
              >
                Sign In / Register
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="text-[#FF8F9C] font-bold uppercase text-sm tracking-widest flex items-center gap-2"
              >
                <FaShieldAlt /> Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION (App Style) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#EDEDED] px-6 py-3 flex justify-between items-center z-[55]">
        <BottomTab
          to="/"
          icon={<FaHome size={20} />}
          label="Home"
          active={location.pathname === "/"}
        />
        <BottomTab
          to="/categories"
          icon={<FaThLarge size={20} />}
          label="Shop"
          active={location.pathname === "/categories"}
        />
        <BottomTab
          to="/cart"
          icon={<FaShoppingCart size={20} />}
          label="Cart"
          active={location.pathname === "/cart"}
          badge={cartCount}
        />
        <BottomTab
          to="/wishlist"
          icon={<FaHeart size={20} />}
          label="Loved"
          active={location.pathname === "/wishlist"}
        />
        <BottomTab
          to={user ? "/order-history" : "/login"}
          icon={<FaUser size={20} />}
          label="Profile"
          active={location.pathname === "/order-history"}
        />
      </div>
    </>
  );
};

/* Helper Components */

const MenuLinks = ({ location, user, mobile, onClick }) => {
  const baseClass = mobile
    ? "text-[#212121] text-[16px] font-bold uppercase tracking-wide hover:text-[#FF8F9C]"
    : "text-[#212121] text-[15px] font-semibold uppercase hover:text-[#FF8F9C] transition-colors";

  return (
    <>
      <Link
        to="/"
        onClick={onClick}
        className={`${baseClass} ${
          location.pathname === "/" ? "text-[#FF8F9C]" : ""
        }`}
      >
        Home
      </Link>
      <Link
        to="/categories"
        onClick={onClick}
        className={`${baseClass} ${
          location.pathname === "/categories" ? "text-[#FF8F9C]" : ""
        }`}
      >
        Categories
      </Link>
      {user?.role === "customer" && (
        <Link
          to="/order-history"
          onClick={onClick}
          className={`${baseClass} ${
            location.pathname === "/order-history" ? "text-[#FF8F9C]" : ""
          }`}
        >
          Order History
        </Link>
      )}
    </>
  );
};

const BottomTab = ({ to, icon, label, active, badge }) => (
  <Link
    to={to}
    className={`flex flex-col items-center gap-1 relative ${
      active ? "text-[#FF8F9C]" : "text-[#787878]"
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-tighter">
      {label}
    </span>
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-[#FF8F9C] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

export default Navbar;
