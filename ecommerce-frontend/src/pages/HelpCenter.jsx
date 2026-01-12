import React, { useState } from "react";
import { 
  FaSearch, FaShippingFast, FaUndo, FaUserCircle, 
  FaCreditCard, FaQuestionCircle, FaChevronRight, FaLifeRing 
} from "react-icons/fa";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 1, icon: <FaShippingFast />, title: "Delivery", desc: "Track orders, shipping costs, and timelines." },
    { id: 2, icon: <FaUndo />, title: "Returns", desc: "How to return items and refund policies." },
    { id: 3, icon: <FaUserCircle />, title: "Account", desc: "Manage password, profile, and preferences." },
    { id: 4, icon: <FaCreditCard />, title: "Payment", desc: "Secure checkout and payment methods." },
  ];

  const popularFaqs = [
    "How do I track my order?",
    "What is the ANON return policy?",
    "How do I change my shipping address?",
    "Do you ship internationally?",
  ];

  return (
    <div className="bg-[#F7F7F7] min-h-screen font-['Poppins']">
      
      {/* --- HERO SEARCH SECTION --- */}
      <section className="bg-[#212121] py-16 md:py-24 px-4 text-center">
        <div className="max-w-[700px] mx-auto">
          <h1 className="text-white text-[28px] md:text-[42px] font-bold uppercase tracking-[0.2em] mb-6">
            HOW CAN WE <span className="text-[#FF8F9C]">HELP?</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 pb-20">
        
        {/* --- CATEGORY CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white p-8 rounded-[15px] border border-[#EDEDED] shadow-sm hover:border-[#FF8F9C] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-[28px] text-[#212121] group-hover:text-[#FF8F9C] transition-colors mb-4">
                {cat.icon}
              </div>
              <h3 className="text-[#212121] font-bold uppercase text-[14px] tracking-widest mb-2">{cat.title}</h3>
              <p className="text-[#787878] text-[12px] leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* --- POPULAR ARTICLES --- */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-widest flex items-center gap-3">
              <FaQuestionCircle className="text-[#FF8F9C]" /> Popular Articles
            </h2>
            <div className="bg-white rounded-[15px] border border-[#EDEDED] overflow-hidden">
              {popularFaqs.map((faq, index) => (
                <div 
                  key={index}
                  className="p-5 border-b border-[#EDEDED] last:border-none flex items-center justify-between hover:bg-[#FAFAFA] cursor-pointer group transition-colors"
                >
                  <span className="text-[#454545] text-[14px] font-medium group-hover:text-[#212121]">{faq}</span>
                  <FaChevronRight className="text-[#EDEDED] group-hover:text-[#FF8F9C] text-[12px]" />
                </div>
              ))}
            </div>
          </div>

          {/* --- CONTACT SIDEBAR --- */}
          <div className="bg-[#212121] p-8 rounded-[15px] text-white shadow-2xl relative overflow-hidden">
            <FaLifeRing className="absolute -right-4 -top-4 text-white/5 text-[120px]" />
            <h2 className="text-[18px] font-bold uppercase tracking-widest mb-4">Still Need Help?</h2>
            <p className="text-[#B0B0B0] text-[13px] mb-8 leading-relaxed">
              Our premium support team is available 24/7 to assist with your inquiries.
            </p>
            <div className="space-y-4">
              <button className="w-full bg-[#FF8F9C] text-white py-4 rounded-[8px] font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-[#212121] transition-all">
                Live Chat
              </button>
              <button className="w-full bg-transparent border border-white/20 text-white py-4 rounded-[8px] font-bold uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all">
                Email Support
              </button>
            </div>
          </div>

        </div>

        {/* --- FOOTER BADGE --- */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-[#EDEDED] text-[12px] text-[#787878] font-medium uppercase tracking-tighter">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> 
            All Systems Operational
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;