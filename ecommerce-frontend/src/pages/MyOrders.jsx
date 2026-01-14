import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from "react-icons/fa";

const MyOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20 min-h-[70vh] flex items-center justify-center font-['Poppins']">
      <div className="max-w-lg w-full text-center bg-white border border-[#EDEDED] rounded-[10px] p-10 shadow-sm transition-all hover:shadow-md">
        
        {/* Success Icon Section */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-[#BA7786] opacity-20 rounded-full animate-ping"></div>
          <div className="relative bg-white text-[#BA7786] p-4 rounded-full border-2 border-[#BA7786]">
            <FaCheckCircle size={48} />
          </div>
        </div>

        {/* Content Section */}
        <h1 className="text-[28px] font-bold text-[#212121] uppercase tracking-tight mb-4">
          Order <span className="text-[#BA7786]">Confirmed</span>
        </h1>
        
        <div className="w-16 h-[2px] bg-[#212121] mx-auto mb-6"></div>

        <p className="text-[#787878] text-[15px] leading-relaxed mb-10">
          Thank you for choosing <span className="font-bold text-[#212121]">Anon Maesha</span>. 
          Your order has been placed successfully and is currently being processed by our logistics team.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-[#212121] text-white px-8 py-3 rounded-[5px] font-bold text-[12px] uppercase tracking-widest hover:bg-[#BA7786] transition-all duration-300 shadow-sm"
          >
            <FaShoppingBag size={14} /> Continue Shopping
          </Link>
          
          <button 
            onClick={() => navigate("/order-history")}
            className="flex items-center justify-center gap-2 border border-[#EDEDED] text-[#454545] px-8 py-3 rounded-[5px] font-bold text-[12px] uppercase tracking-widest hover:bg-[#F7F7F7] transition-all duration-300"
          >
            View History <FaArrowRight size={12} />
          </button>
        </div>

        {/* Support Link */}
        <p className="mt-10 text-[12px] text-[#787878] font-medium italic">
          Need help? <Link to="/contact" className="text-[#BA7786] hover:underline">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
};

export default MyOrders;