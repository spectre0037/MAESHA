import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api";

// Components
import OrderCard from "../components/orderCard";
import EditProductModal from "../components/EditProductModal";
import OrderDetailsModal from "../components/OrderdetailsModal";
import AddProductModal from "../components/AddProductModal";
import CustomerHistoryModal from "../components/CustomerHistoryModel";

// Icons
import {
  FaBox,
  FaUsers,
  FaClipboardList,
  FaPlus,
  FaChartLine,
  FaArrowRight,
  FaHome,
  FaSignOutAlt,
  FaCog,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("orders");
  const [subTab, setSubTab] = useState("all");
  const [data, setData] = useState({ orders: [], customers: [], products: [] });
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        API.get("/orders/admin/all"),
        API.get("/auth/admin/customers"),
        API.get("/products"),
      ]);

      setData({
        orders: ordersRes.data.orders || ordersRes.data || [],
        customers:
          customersRes.data.users ||
          customersRes.data.customers ||
          customersRes.data ||
          [],
        products: productsRes.data.products || productsRes.data || [],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, authLoading, navigate, fetchData]);

  const totalRevenue = data.orders
    .filter((o) => o.status === "completed")
    .reduce(
      (acc, curr) => acc + Number(curr.total_amount || curr.total_price || 0),
      0
    );

  const filteredOrders = data.orders.filter((order) => {
    if (subTab === "all") return true;
    return order.status.toLowerCase() === subTab.toLowerCase();
  });

  if (authLoading || (user && user.role !== "admin")) {
    return <LoadingSkeleton message="Verifying Admin Access..." />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] font-['Poppins'] relative">
      {/* --- SIDEBAR OVERLAY (Mobile only) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      {/* Fixed and Sticky for Desktop, Hidden/Slide-out for Mobile */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] w-[280px] bg-[#212121] text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:h-screen lg:sticky lg:top-0
      `}
      >
        <div className="p-8 flex justify-between items-center">
          <div>
            <h1 className="text-[22px] font-kenao tracking-tight">
              MAESHA<span className="text-[#FF8F9C]">HQ</span>
            </h1>
            <p className="text-[10px] text-[#787878] uppercase tracking-[0.3em] mt-2 font-bold">
              Management v2.0
            </p>
          </div>
          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          <NavItem
            active={activeTab === "orders"}
            onClick={() => {
              setActiveTab("orders");
              setIsSidebarOpen(false);
            }}
            icon={<FaClipboardList />}
            label="Orders"
          />
          <NavItem
            active={activeTab === "customers"}
            onClick={() => {
              setActiveTab("customers");
              setIsSidebarOpen(false);
            }}
            icon={<FaUsers />}
            label="Customers"
          />
          <NavItem
            active={activeTab === "products"}
            onClick={() => {
              setActiveTab("products");
              setIsSidebarOpen(false);
            }}
            icon={<FaBox />}
            label="Inventory"
          />
          <div className="pt-10 pb-4 px-4 text-[10px] font-bold text-[#787878] uppercase tracking-widest">
            System
          </div>
          <NavItem
            icon={<FaHome />}
            label="Back to Store"
            onClick={() => navigate("/")}
          />
          <NavItem icon={<FaCog />} label="Settings" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <button className="flex items-center gap-3 text-[#787878] hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <FaSignOutAlt /> Terminate
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      {/* lg:ml-[280px] ensures space is kept for the fixed sidebar on desktop */}
      <main className="flex-1 w-full lg:ml-0 overflow-x-hidden min-h-screen">
        {/* TOP BAR */}
        <header className="h-[70px] md:h-[80px] bg-white border-b border-[#EDEDED] flex items-center justify-between px-4 md:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-[#212121] p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={toggleSidebar}
            >
              <FaBars size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-4 text-[#787878]">
              <FaSearch size={14} />
              <input
                type="text"
                placeholder="Search records..."
                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-32 md:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="text-right hidden xs:block">
              <p className="text-[11px] font-bold text-[#212121] leading-none">
                {user.name}
              </p>
              <p className="text-[9px] text-[#FF8F9C] font-bold uppercase tracking-widest mt-1">
                Super Admin
              </p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-[5px] bg-[#F7F7F7] border border-[#EDEDED] flex items-center justify-center font-bold text-[#212121]">
              {user.name[0]}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-4 md:p-10">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
            <StatCard
              label="Net Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={<FaChartLine />}
              trend="+12.5%"
            />
            <StatCard
              label="Active Orders"
              value={data.orders.length}
              icon={<FaClipboardList />}
            />
            <StatCard
              label="Total Users"
              value={data.customers.length}
              icon={<FaUsers />}
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>

          {/* DYNAMIC CONTENT CANVAS */}
          <div className="bg-white border border-[#EDEDED] rounded-[10px] min-h-[500px] overflow-hidden">
            {/* Context Header */}
            <div className="p-5 md:p-6 border-b border-[#EDEDED] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
              <div>
                <h2 className="text-[16px] md:text-[18px] font-bold text-[#212121] uppercase tracking-tight">
                  {activeTab === "orders"
                    ? "Order Processing"
                    : activeTab === "customers"
                    ? "User Directory"
                    : "Catalog Master"}
                </h2>
                <p className="text-[11px] text-[#787878]">
                  Live System Synchronization Active
                </p>
              </div>

              {activeTab === "products" && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto bg-[#212121] text-white px-6 py-2.5 rounded-[5px] text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF8F9C] transition-all"
                >
                  <FaPlus /> New Product
                </button>
              )}
            </div>

            <div className="p-4 md:p-8">
              {loading ? (
                <LoadingSkeleton message="Syncing Database..." />
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* TAB: ORDERS */}
                  {activeTab === "orders" && (
                    <div className="space-y-6">
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-3 scrollbar-hide">
                        {[
                          "all",
                          "pending",
                          "processing",
                          "completed",
                          "cancelled",
                        ].map((status) => (
                          <button
                            key={status}
                            onClick={() => setSubTab(status)}
                            className={`px-4 py-2 rounded-[3px] text-[9px] font-bold uppercase tracking-widest transition-all border whitespace-nowrap ${
                              subTab === status
                                ? "bg-[#212121] border-[#212121] text-white"
                                : "bg-white text-[#787878] border-[#EDEDED] hover:border-[#FF8F9C]"
                            }`}
                          >
                            {status} (
                            {
                              data.orders.filter((o) =>
                                status === "all" ? true : o.status === status
                              ).length
                            }
                            )
                          </button>
                        ))}
                      </div>
                      <div className="grid gap-4">
                        {filteredOrders.length === 0 ? (
                          <EmptyState msg="No records found." />
                        ) : (
                          filteredOrders.map((order) => (
                            <OrderCard
                              key={order.id}
                              order={order}
                              onRefresh={fetchData}
                              onViewDetails={() => setSelectedOrder(order)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB: CUSTOMERS */}
                  {activeTab === "customers" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.customers.map((c) => (
                        <CustomerCard
                          key={c.id}
                          customer={c}
                          onClick={() => setSelectedCustomer(c)}
                        />
                      ))}
                    </div>
                  )}

                  {/* TAB: PRODUCTS */}
                  {activeTab === "products" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {data.products.map((p) => (
                        <AdminProductCard
                          key={p.id}
                          product={p}
                          onEdit={() => setEditingProduct(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onRefresh={fetchData}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onRefresh={fetchData}
        />
      )}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      {selectedCustomer && (
        <CustomerHistoryModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

/* --- SHARED SUB-COMPONENTS --- */

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[8px] transition-all group ${
      active
        ? "bg-[#FF8F9C] text-white shadow-lg shadow-[#FF8F9C]/20"
        : "text-[#787878] hover:bg-white/5 hover:text-white"
    }`}
  >
    <span
      className={`${
        active ? "text-white" : "group-hover:text-[#FF8F9C]"
      } transition-colors`}
    >
      {icon}
    </span>
    <span className="text-[12px] font-bold uppercase tracking-widest">
      {label}
    </span>
  </button>
);

const StatCard = ({ label, value, icon, trend, className = "" }) => (
  <div
    className={`bg-white border border-[#EDEDED] p-6 md:p-8 rounded-[10px] relative overflow-hidden group hover:border-[#FF8F9C]/50 transition-all ${className}`}
  >
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-bold text-[#787878] uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <h3 className="text-[24px] md:text-[28px] font-bold text-[#212121] tracking-tight">
          {value}
        </h3>
        {trend && (
          <p className="text-[10px] font-bold text-emerald-500 mt-2">
            {trend}{" "}
            <span className="text-[#787878] font-normal italic lowercase">
              vs last month
            </span>
          </p>
        )}
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-[5px] bg-[#F7F7F7] flex items-center justify-center text-[#212121] group-hover:bg-[#212121] group-hover:text-white transition-all">
        {icon}
      </div>
    </div>
  </div>
);

const AdminProductCard = ({ product, onEdit }) => (
  <div className="bg-white border border-[#EDEDED] p-3 md:p-4 rounded-[10px] hover:shadow-md transition-all group">
    <div className="h-32 md:h-44 bg-[#F7F7F7] rounded-[5px] mb-3 md:mb-4 relative overflow-hidden flex items-center justify-center">
      <img
        src={product.image_url}
        alt=""
        className="w-full h-full object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-2 left-2 bg-white px-1.5 md:px-2 py-1 rounded-[3px] text-[8px] md:text-[9px] font-bold uppercase border border-[#EDEDED]">
        Qty: {product.stock}
      </div>
    </div>
    <h4 className="text-[11px] md:text-[13px] font-bold text-[#212121] truncate">
      {product.name}
    </h4>
    <p className="text-[#FF8F9C] font-bold text-[12px] md:text-[14px] mb-3 md:mb-4">
      ${Number(product.price).toFixed(2)}
    </p>
    <button
      onClick={onEdit}
      className="w-full py-2 bg-[#F7F7F7] text-[#212121] rounded-[5px] text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-[#212121] hover:text-white transition-all"
    >
      Manage
    </button>
  </div>
);

const CustomerCard = ({ customer, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-[#EDEDED] p-4 rounded-[10px] flex items-center gap-3 md:gap-4 hover:border-[#FF8F9C] cursor-pointer transition-all"
  >
    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#212121] text-white rounded-[5px] flex items-center justify-center font-bold text-base md:text-lg shrink-0">
      {customer.name?.[0] || "C"}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-[13px] md:text-[14px] font-bold text-[#212121] truncate">
        {customer.name}
      </h4>
      <p className="text-[10px] md:text-[11px] text-[#787878] truncate">
        {customer.email}
      </p>
    </div>
    <FaArrowRight size={10} className="text-[#EDEDED]" />
  </div>
);

const LoadingSkeleton = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-24 w-full">
    <div className="w-8 h-8 border-2 border-[#EDEDED] border-t-[#FF8F9C] rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-bold text-[#787878] uppercase tracking-[0.2em]">
      {message}
    </p>
  </div>
);

const EmptyState = ({ msg }) => (
  <div className="py-20 text-center border-2 border-dashed border-[#EDEDED] rounded-[10px] w-full">
    <p className="text-[#787878] text-[13px] italic font-medium">{msg}</p>
  </div>
);

export default AdminDashboard;
