import React from "react";
import { FaShieldAlt, FaLock, FaEye, FaUserShield } from "react-icons/fa";

const PrivacyPolicy = () => {
  const lastUpdated = "January 12, 2026";

  return (
    <div className="bg-[#F7F7F7] min-h-screen font-['Poppins'] py-12 px-4 md:px-8">
      <div className="max-w-[900px] mx-auto bg-white rounded-[20px] shadow-sm border border-[#EDEDED] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#212121] p-10 md:p-16 text-center">
          <h1 className="text-white text-[28px] md:text-[40px] font-bold uppercase tracking-[0.2em] mb-4">
            Privacy <span className="text-[#BA7786]">Policy</span>
          </h1>
          <div className="w-16 h-[2px] bg-[#BA7786] mx-auto mb-6"></div>
          <p className="text-[#787878] text-[13px] md:text-[14px] uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Quick Summary Cards (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 md:p-10 border-b border-[#EDEDED] bg-[#FAFAFA]">
          <SummaryCard 
            icon={<FaLock className="text-[#BA7786]" />} 
            title="Secure" 
            desc="We use industry-standard encryption to protect your data."
          />
          <SummaryCard 
            icon={<FaEye className="text-[#BA7786]" />} 
            title="Transparent" 
            desc="We never sell your personal information to third parties."
          />
          <SummaryCard 
            icon={<FaUserShield className="text-[#BA7786]" />} 
            title="Your Control" 
            desc="You have the right to access or delete your data anytime."
          />
        </div>

        {/* Policy Content */}
        <div className="p-8 md:p-16 space-y-12 text-[#454545] leading-relaxed text-[15px]">
          
          <section>
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-4 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#BA7786] block"></span> 1. Information We Collect
            </h2>
            <p className="mb-4">
              When you join <span className="font-bold">ANON</span>, we collect information necessary to provide our premium services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#787878]">
              <li>Personal identifiers (Name, Email Address, Phone Number).</li>
              <li>Transaction details and purchase history.</li>
              <li>Device information and IP addresses for security and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-4 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#BA7786] block"></span> 2. How We Use Your Data
            </h2>
            <p>
              Your data is used to process orders, personalize your shopping experience, and communicate important updates regarding your account. We may also use data to improve our website functionality and detect fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-4 flex items-center gap-3">
              <span className="w-2 h-6 bg-[#BA7786] block"></span> 3. Data Retention
            </h2>
            <p>
              We keep your information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section className="bg-[#F9F9F9] p-8 rounded-[15px] border-l-4 border-[#212121]">
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-4">
              4. Your Rights
            </h2>
            <p className="mb-4">You have the legal right to:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-bold uppercase tracking-tight">
              <div className="bg-white p-3 rounded border border-[#EDEDED]">Request Data Export</div>
              <div className="bg-white p-3 rounded border border-[#EDEDED]">Request Data Deletion</div>
              <div className="bg-white p-3 rounded border border-[#EDEDED]">Opt-out of Marketing</div>
              <div className="bg-white p-3 rounded border border-[#EDEDED]">Correct Inaccurate Info</div>
            </div>
          </section>

          <section className="text-center pt-10">
            <h2 className="text-[#212121] text-[18px] font-bold uppercase tracking-wider mb-4">
              Questions?
            </h2>
            <p className="text-[#787878] mb-6">
              If you have any questions about your privacy, contact our support team.
            </p>
            <a 
              href="mailto:support@anon.com" 
              className="inline-block bg-[#212121] text-white px-10 py-4 rounded-[5px] font-bold uppercase text-[12px] tracking-widest hover:bg-[#BA7786] transition-all shadow-md"
            >
              Contact Support
            </a>
          </section>

        </div>
      </div>
    </div>
  );
};

// Helper Component for Summary Cards
const SummaryCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-[12px] border border-[#EDEDED] text-center hover:shadow-md transition-shadow">
    <div className="text-[24px] mb-3 flex justify-center">{icon}</div>
    <h3 className="text-[#212121] font-bold uppercase text-[12px] tracking-widest mb-2">{title}</h3>
    <p className="text-[#787878] text-[12px] leading-relaxed">{desc}</p>
  </div>
);

export default PrivacyPolicy;