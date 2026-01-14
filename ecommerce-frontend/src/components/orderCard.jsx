import React, { useState } from "react";
import API from "../api";
import {
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaChevronRight,
} from "react-icons/fa";

const OrderCard = ({ order, onRefresh, onViewDetails }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Helper for status styling & icons
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return {
          class: "bg-[#e6f4ea] text-[#1e7e34] border-[#1e7e34]/10",
          icon: <FaCheckCircle size={10} />,
        };
      case "pending":
        return {
          class: "bg-[#fff4e5] text-[#b45d00] border-[#b45d00]/10",
          icon: <FaClock size={10} />,
        };
      case "processing":
      case "shipped":
        return {
          class: "bg-[#e8f0fe] text-[#1967d2] border-[#1967d2]/10",
          icon: <FaTruck size={10} />,
        };
      case "cancelled":
        return {
          class: "bg-[#fce8e6] text-[#c5221f] border-[#c5221f]/10",
          icon: <FaTimesCircle size={10} />,
        };
      default:
        return {
          class: "bg-[#F7F7F7] text-[#787878] border-[#EDEDED]",
          icon: null,
        };
    }
  };

  const statusStyle = getStatusConfig(order.status);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await API.put(`/orders/admin/${order.id}/status`, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete Order #${order.id}?`))
      return;
    try {
      await API.delete(`/orders/admin/${order.id}`);
      onRefresh();
    } catch (err) {
      alert("Could not delete order.");
    }
  };

  return (
    <div
      className={`bg-white border border-[#EDEDED] rounded-[10px] p-6 transition-all duration-300 hover:shadow-md hover:border-[#BA7786]/30 group font-['Poppins'] ${
        isUpdating ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Left Section: Order Identification */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-[#212121] uppercase tracking-tight">
              Order #{order.id}
            </h2>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-[9px] font-bold border uppercase tracking-widest ${statusStyle.class}`}
            >
              {statusStyle.icon}
              {order.status}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border-l-2 border-[#F7F7F7] pl-3">
              <p className="text-[10px] font-bold text-[#787878] uppercase tracking-widest mb-1">
                Customer
              </p>
              <p className="font-bold text-[#212121] text-[14px] leading-tight">
                {order.customer_name || "Guest User"}
              </p>
              <p className="text-[12px] text-[#787878] mt-0.5">
                {order.customer_email || "No Email"}
              </p>
            </div>
            <div className="border-l-2 border-[#F7F7F7] pl-3">
              <p className="text-[10px] font-bold text-[#787878] uppercase tracking-widest mb-1">
                Placement Date
              </p>
              <p className="text-[13px] font-bold text-[#212121]">
                {new Date(order.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-[11px] text-[#787878] font-medium">
                {new Date(order.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Revenue & Actions */}
        <div className="flex flex-col md:items-end justify-between gap-6">
          <div className="md:text-right">
            <p className="text-[10px] font-bold text-[#787878] uppercase tracking-widest mb-1">
              Total Amount
            </p>
            <p className="text-[28px] font-bold text-[#BA7786] tracking-tighter leading-none">
              ${Number(order.total_amount || order.total_price).toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Details */}
            <button
              onClick={() => onViewDetails(order)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#212121] text-white text-[10px] font-bold uppercase tracking-widest rounded-[5px] hover:bg-[#BA7786] transition-all shadow-sm active:scale-95"
            >
              <FaEye size={12} /> Manage
            </button>

            {/* Quick Status Select */}
            <div className="relative group/select">
              <select
                className="bg-[#F7F7F7] border border-[#EDEDED] text-[10px] font-bold uppercase tracking-widest rounded-[5px] pl-3 pr-8 py-2.5 focus:border-[#BA7786] outline-none cursor-pointer appearance-none hover:bg-white transition-colors"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#787878]">
                <FaChevronRight size={8} className="rotate-90" />
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="p-2.5 text-[#EDEDED] hover:text-[#BA7786] hover:bg-red-50 rounded-[5px] transition-all"
              title="Delete Record"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="mt-6 pt-4 border-t border-[#F7F7F7] flex items-center justify-between">
        <p className="text-[9px] font-bold text-[#EDEDED] uppercase tracking-[0.2em] group-hover:text-[#787878] transition-colors">
          Anon Transactional Protocol v2.0
        </p>
        <p className="text-[9px] font-bold text-[#EDEDED] uppercase tracking-tighter">
          Ref: {order.id.toString().slice(-8)}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
