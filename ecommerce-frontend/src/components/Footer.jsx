import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaInstagram, FaFacebookF, FaTwitter, 
  FaPinterestP, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt 
} from "react-icons/fa";

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-[#212121] text-white pt-16 font-['Poppins'] overflow-hidden"
    >
      <div className="container mx-auto px-6">
        
        {/* --- NEWSLETTER SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-white/10 items-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-[24px] md:text-[32px] font-bold uppercase tracking-[0.2em]">
              Join the <span className="text-[#FF8F9C]">Inner Circle</span>
            </h2>
            <p className="text-gray-400 text-[14px] mt-2">Get early access to drops and premium style edits.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative group">
            <div className="flex bg-white/5 backdrop-blur-md rounded-full border border-white/10 p-1.5 focus-within:border-[#FF8F9C] transition-all duration-500">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-transparent border-none outline-none px-6 py-3 w-full text-[14px] text-white placeholder:text-gray-500"
              />
              <button className="bg-[#FF8F9C] text-white px-8 py-3 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-[#212121] transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- MAIN LINKS SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-[20px] font-black tracking-[0.3em] text-white">
              MAESHA<span className="text-[#FF8F9C]">.</span>
            </h3>
            <p className="text-gray-400 text-[13px] leading-relaxed">
              Curating high-performance essentials for the modern minimalist. Precision crafted. Ethically sourced.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaFacebookF, FaTwitter, FaPinterestP].map((Icon, idx) => (
                <motion.a 
                  key={idx}
                  whileHover={{ y: -5, color: "#FF8F9C" }}
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <FooterColumn 
            title="Collections" 
            links={["Men's Wear", "Women's Wear", "Tech Gear", "New Arrivals"]} 
          />
          
          <FooterColumn 
            title="Support" 
            links={["Help Center", "Privacy Policy", "Terms of Service", "Return Portal"]} 
          />

          {/* Contact Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#FF8F9C]">Connect</h4>
            <div className="space-y-4">
              <ContactItem icon={<FaMapMarkerAlt />} text="22nd Fashion Ave, New York" />
              <ContactItem icon={<FaPhoneAlt />} text="+1 (234) 567-890" />
              <ContactItem icon={<FaEnvelope />} text="support@anon.com" />
            </div>
          </motion.div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-white/5 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-[11px] uppercase tracking-widest">
            © 2026 MAESHA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

// Sub-components for cleaner code
const FooterColumn = ({ title, links }) => (
  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="space-y-6">
    <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#FF8F9C]">{title}</h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link}>
          <motion.div whileHover={{ x: 5 }}>
            <Link 
              to={`/${link.toLowerCase().replace(" ", "-")}`} 
              className="text-gray-400 text-[13px] hover:text-white transition-colors"
            >
              {link}
            </Link>
          </motion.div>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ContactItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 text-[13px] text-gray-400">
    <span className="text-[#FF8F9C]">{icon}</span>
    <span>{text}</span>
  </div>
);

export default Footer;
