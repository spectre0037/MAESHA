import React, { useEffect, useState } from "react";
import API from "../api";
import { FaTimes, FaUserCircle, FaShoppingBag, FaWallet, FaCalendarAlt } from "react-icons/fa";

const CustomerHistoryModal = ({ customer, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get(`/orders/admin/user/${customer.id}`);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching customer history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [customer.id]);

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

  return (
    <div className="fixed inset-0 bg-[#212121]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-['Poppins']">
      <div className="bg-white rounded-[10px] p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-[#EDEDED] relative">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#EDEDED]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F7F7F7] rounded-full flex items-center justify-center text-[#212121] border border-[#EDEDED]">
              <FaUserCircle size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#212121] uppercase tracking-tight leading-none">
                {customer.name}
              </h2>
              <p className="text-[#787878] text-[13px] font-medium">{customer.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#787878] hover:text-[#FF8F9C] transition-colors p-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Brand Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatBox 
            label="Order Volume" 
            value={orders.length} 
            icon={<FaShoppingBag />} 
            color="bg-[#212121]" 
          />
          <StatBox 
            label="Lifetime Value" 
            value={`$${totalSpent.toFixed(2)}`} 
            icon={<FaWallet />} 
            color="bg-[#FF8F9C]" 
          />
          <StatBox 
            label="Member Since" 
            value={new Date(customer.created_at).toLocaleDateString()} 
            icon={<FaCalendarAlt />} 
            color="bg-[#787878]" 
          />
        </div>

        {/* Detailed History List */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#212121]">Transaction History</h3>
            <span className="text-[10px] font-bold text-[#787878] bg-[#F7F7F7] px-2 py-1 rounded-[3px]">
              {orders.length} RECORDS FOUND
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="w-8 h-8 border-2 border-[#EDEDED] border-t-[#FF8F9C] rounded-full animate-spin mb-4"></div>
              <p className="text-[12px] font-bold text-[#787878] uppercase tracking-widest">Retrieving Archive...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-[#F7F7F7] rounded-[5px] border border-dashed border-[#EDEDED]">
              <p className="text-[#787878] text-[14px] italic font-medium">No purchase history found for this account.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-[#EDEDED] rounded-[5px] hover:border-[#FF8F9C] transition-all">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#212121] text-[14px]">ORDER #{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#787878] font-medium">
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-[#EDEDED]"></span>
                      <span>{order.item_count || 1} items</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 text-left md:text-right">
                    <p className="font-bold text-[#212121] text-[18px] tracking-tight">
                      ${Number(order.total_amount).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-[#FF8F9C] font-bold uppercase tracking-tighter">
                      Verified Transaction
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-6 border-t border-[#EDEDED]">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[#212121] text-white rounded-[5px] font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-[#FF8F9C] transition-all duration-300 shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- Refined Sub-components --- */

const StatBox = ({ label, value, icon, color }) => (
  <div className={`${color} p-5 rounded-[5px] text-white shadow-sm flex items-center justify-between overflow-hidden relative group`}>
    <div className="z-10">
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{label}</p>
      <p className="text-[20px] font-bold tracking-tight">{value}</p>
    </div>
    <div className="text-white opacity-20 group-hover:scale-110 transition-transform duration-500">
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const isCompleted = status.toLowerCase() === 'completed';
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-[3px] font-bold uppercase tracking-tighter ${
      isCompleted ? 'bg-[#e6f4ea] text-[#1e7e34]' : 'bg-[#fff4e5] text-[#b45d00]'
    }`}>
      {status}
    </span>
  );
};

export default CustomerHistoryModal;