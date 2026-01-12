import React from "react";
import { FaFileSignature, FaShoppingCart, FaTruck, FaUndoAlt, FaBalanceScale } from "react-icons/fa";

const TermsAndConditions = () => {
  const lastUpdated = "January 12, 2026";

  return (
    <div className="bg-[#F7F7F7] min-h-screen font-['Poppins'] py-12 px-4 md:px-8">
      <div className="max-w-[900px] mx-auto bg-white rounded-[20px] shadow-sm border border-[#EDEDED] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#212121] p-10 md:p-16 text-center">
          <FaFileSignature className="text-[#FF8F9C] text-4xl mx-auto mb-6 opacity-80" />
          <h1 className="text-white text-[28px] md:text-[40px] font-bold uppercase tracking-[0.2em] mb-4">
            Terms of <span className="text-[#FF8F9C]">Service</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#FF8F9C] mx-auto mb-6"></div>
          <p className="text-[#787878] text-[13px] md:text-[14px] uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction Section */}
        <div className="p-8 md:p-16 border-b border-[#EDEDED] bg-[#FAFAFA]">
          <p className="text-[#454545] text-center italic text-[15px] leading-relaxed">
            "By accessing or using the ANON platform, you agree to be bound by these terms. 
            Please read them carefully to ensure a seamless premium shopping experience."
          </p>
        </div>

        {/* Terms Content */}
        <div className="p-8 md:p-16 space-y-12 text-[#454545] leading-relaxed text-[15px]">
          
          <section className="group">
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-6 flex items-center gap-4">
              <FaShoppingCart className="text-[#FF8F9C]" /> 1. Accounts & Eligibility
            </h2>
            <div className="pl-8 space-y-4 text-[#787878] border-l-2 border-[#EDEDED] group-hover:border-[#FF8F9C] transition-colors">
              <p>To use our services, you must be at least 18 years of age. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
              <p>ANON reserves the right to refuse service or terminate accounts at our sole discretion.</p>
            </div>
          </section>

          <section className="group">
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-6 flex items-center gap-4">
              <FaTruck className="text-[#FF8F9C]" /> 2. Orders & Shipping
            </h2>
            <div className="pl-8 space-y-4 text-[#787878] border-l-2 border-[#EDEDED] group-hover:border-[#FF8F9C] transition-colors">
              <p>All orders are subject to acceptance and availability. Prices are subject to change without notice.</p>
              <p>Shipping times are estimates. While we strive for precision, ANON is not liable for delays caused by third-party carriers or international customs processes.</p>
            </div>
          </section>

          <section className="group">
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-6 flex items-center gap-4">
              <FaUndoAlt className="text-[#FF8F9C]" /> 3. Returns & Refunds
            </h2>
            <div className="pl-8 space-y-4 text-[#787878] border-l-2 border-[#EDEDED] group-hover:border-[#FF8F9C] transition-colors">
              <p>Our premium collection is eligible for return within 30 days of delivery, provided items are in their original condition with all tags attached.</p>
              <p>Refunds will be processed to the original payment method within 7-10 business days of inspection.</p>
            </div>
          </section>

          <section className="group">
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-6 flex items-center gap-4">
              <FaBalanceScale className="text-[#FF8F9C]" /> 4. Intellectual Property
            </h2>
            <div className="pl-8 space-y-4 text-[#787878] border-l-2 border-[#EDEDED] group-hover:border-[#FF8F9C] transition-colors">
              <p>All content on this site, including text, graphics, logos, and images, is the property of ANON and is protected by international copyright laws.</p>
            </div>
          </section>

          {/* Legal Disclaimer Box */}
          <div className="bg-[#212121] text-white p-8 rounded-[15px] shadow-xl mt-12">
            <h3 className="text-[#FF8F9C] font-bold uppercase text-[14px] tracking-[0.2em] mb-4">
              Limitation of Liability
            </h3>
            <p className="text-[#B0B0B0] text-[13px] leading-relaxed uppercase">
              ANON shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services or products.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;