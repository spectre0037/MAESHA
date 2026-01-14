import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaEye,
  FaShoppingBag,
} from "react-icons/fa";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const isLiked = wishlistItems.some((item) => item.id === product.id);
  const originalPrice = Number(product.price);
  const salePrice = product.discount_price
    ? Number(product.discount_price)
    : null;

  const discountPercentage = salePrice
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white border border-[#EDEDED] rounded-[10px] overflow-hidden transition-all duration-300 hover:shadow-lg font-['Poppins']">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#F7F7F7]">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full aspect-square object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {salePrice && (
            <span className="bg-[#BA7786] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-[4px] shadow-sm">
              {discountPercentage}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-[#212121] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-[4px] shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Hover Actions - Classic Anon Style */}
        <div className="absolute top-3 -right-12 group-hover:right-3 transition-all duration-300 flex flex-col gap-2">
          <button
            onClick={() => dispatch(toggleWishlist(product.id))}
            className="p-2.5 bg-white border border-[#EDEDED] rounded-[5px] text-[#787878] hover:bg-[#212121] hover:text-white transition-all shadow-sm"
            title="Add to Wishlist"
          >
            {isLiked ? <FaHeart className="text-[#BA7786]" /> : <FaRegHeart />}
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-2.5 bg-white border border-[#EDEDED] rounded-[5px] text-[#787878] hover:bg-[#212121] hover:text-white transition-all shadow-sm"
          >
            <FaEye />
          </Link>
          <button className="p-2.5 bg-white border border-[#EDEDED] rounded-[5px] text-[#787878] hover:bg-[#212121] hover:text-white transition-all shadow-sm">
            <FaShoppingBag />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-[#BA7786] text-[11px] font-bold uppercase tracking-wider">
          {product.category || "Collection"}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-[#454545] text-[14px] font-medium line-clamp-1 hover:text-[#BA7786] transition-colors capitalize">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={10}
              className={
                i < Math.floor(product.avg_rating || 0)
                  ? "text-[#f0ad4e]"
                  : "text-[#EDEDED]"
              }
            />
          ))}
          <span className="text-[10px] text-[#787878] ml-1">
            ({product.review_count || 0})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-3">
          {salePrice ? (
            <>
              <span className="text-[#212121] font-bold text-[15px]">
                ${salePrice.toFixed(2)}
              </span>
              <del className="text-[#787878] text-[13px]">
                ${originalPrice.toFixed(2)}
              </del>
            </>
          ) : (
            <span className="text-[#212121] font-bold text-[15px]">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
