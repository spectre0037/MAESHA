import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen font-['Poppins']">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#EDEDED] pb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#212121] uppercase tracking-tight">
            My <span className="text-[#FF8F9C]">Wishlist</span>
          </h1>
          <p className="text-[#787878] text-[14px] mt-1">
            You have {items.length} premium{" "}
            {items.length === 1 ? "item" : "items"} saved in your collection.
          </p>
        </div>
        <Link
          to="/categories"
          className="text-[12px] font-bold text-[#212121] uppercase tracking-widest hover:text-[#FF8F9C] transition-colors border-b-2 border-[#FF8F9C] pb-1"
        >
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#EDEDED] rounded-[10px]">
          <div className="bg-[#F7F7F7] p-8 rounded-full mb-6 text-[#EDEDED]">
            <FaHeart size={48} />
          </div>
          <h2 className="text-[18px] font-bold text-[#212121] uppercase tracking-wide">
            Your wishlist is empty
          </h2>
          <p className="text-[#787878] text-[14px] mb-8 max-w-xs text-center">
            Looks like you haven't added any products to your wishlist yet.
          </p>
          <Link
            to="/categories"
            className="bg-[#212121] text-white px-10 py-3 rounded-[5px] font-bold uppercase text-[12px] tracking-widest hover:bg-[#FF8F9C] transition-all shadow-sm"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
