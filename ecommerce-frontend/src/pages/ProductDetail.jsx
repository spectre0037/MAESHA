import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  clearProductDetail,
} from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import {
  FaChevronLeft,
  FaShoppingBag,
  FaStar,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../api";
import ReviewForm from "../components/ReviewForm";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(id));
    fetchReviews();
    return () => dispatch(clearProductDetail());
  }, [dispatch, id, refreshKey]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      setRefreshKey((prev) => prev + 1);
      alert("Review deleted.");
    } catch (err) {
      alert("Error deleting review");
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    dispatch(addToCart({ ...product, quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#FF8F9C] border-r-transparent"></div>
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center py-32 font-['Poppins']">
        <h2 className="text-[24px] font-bold text-[#212121] mb-4">
          Product Not Found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="text-[#FF8F9C] font-semibold flex items-center justify-center gap-2 mx-auto uppercase text-[14px]"
        >
          <FaChevronLeft /> Return to Shop
        </button>
      </div>
    );

  const isOnSale = product?.discount_price && product?.discount_price > 0;

  return (
    <div className="container mx-auto px-4 py-10 font-['Poppins']">
      {/* Navigation Breadcrumb Style */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-[13px] font-medium uppercase tracking-wider text-[#787878] hover:text-[#FF8F9C] transition-colors"
      >
        <FaChevronLeft size={10} /> Back to Collection
      </button>

      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Product Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="relative border border-[#EDEDED] rounded-[10px] overflow-hidden bg-white">
            <img
              src={product.image_url || "/placeholder.png"}
              alt={product.name}
              className="w-full aspect-square object-contain p-6"
            />
            {isOnSale && (
              <p className="absolute top-5 left-5 bg-[#FF8F9C] text-white text-[12px] font-bold px-3 py-1 rounded-[5px] uppercase">
                Sale
              </p>
            )}
          </div>
        </div>

        {/* Product Content Section */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-[#FF8F9C] text-[14px] font-semibold uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="text-[#212121] text-[28px] md:text-[32px] font-bold leading-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex text-[#FF8F9C]">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={14}
                    className={
                      i < Math.round(product.avg_rating)
                        ? "text-[#FF8F9C]"
                        : "text-[#EDEDED]"
                    }
                  />
                ))}
              </div>
              <span className="text-[#787878] text-[14px]">
                ({product.review_count || 0} Customer Reviews)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="mb-8 pb-8 border-b border-[#EDEDED]">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[#FF8F9C] text-[24px] font-bold">
                $
                {Number(
                  isOnSale ? product.discount_price : product.price
                ).toFixed(2)}
              </span>
              {isOnSale && (
                <del className="text-[#787878] text-[18px]">
                  ${Number(product.price).toFixed(2)}
                </del>
              )}
            </div>
            <p className="text-[#787878] text-[15px] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Cart Actions */}
          {user?.role === "admin" ? (
            <div className="p-4 bg-[#F7F7F7] border-l-4 border-[#212121] text-[#212121] text-[14px] font-medium">
              Administrator View: You can manage stock and details in the
              dashboard.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-[#EDEDED] rounded-[5px] h-[45px]">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => q - 1)}
                    className="w-10 h-full flex items-center justify-center text-[#212121] hover:bg-[#F7F7F7] transition-colors disabled:opacity-30"
                  >
                    {" "}
                    -{" "}
                  </button>
                  <span className="px-6 font-bold text-[#212121]">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-full flex items-center justify-center text-[#212121] hover:bg-[#F7F7F7] transition-colors disabled:opacity-30"
                  >
                    {" "}
                    +{" "}
                  </button>
                </div>
                <span
                  className={`text-[12px] font-bold uppercase ${
                    product.stock > 0 ? "text-[#5cb85c]" : "text-[#d9534f]"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </span>
              </div>

              <button
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className={`w-full md:w-auto px-12 py-3 rounded-[5px] font-bold uppercase text-[13px] tracking-widest transition-all flex items-center justify-center gap-3 ${
                  added
                    ? "bg-[#5cb85c] text-white"
                    : "bg-[#212121] text-white hover:bg-[#FF8F9C]"
                }`}
              >
                {added ? <FaCheckCircle /> : <FaShoppingBag />}
                {product.stock <= 0
                  ? "Out of Stock"
                  : added
                  ? "Added to Cart"
                  : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="border-t border-[#EDEDED] pt-12">
        <h2 className="text-[#212121] text-[20px] font-bold uppercase tracking-wide mb-8 border-b-2 border-[#FF8F9C] inline-block pb-1">
          Reviews
        </h2>

        <div
          className={`grid grid-cols-1 ${
            user?.role === "admin" ? "lg:grid-cols-1" : "lg:grid-cols-2"
          } gap-12`}
        >
          <div>
            {reviewLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-24 bg-[#F7F7F7] rounded-[10px]"></div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-[#787878] italic">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="pb-6 border-b border-[#EDEDED] flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-[#212121] text-[14px] uppercase">
                          {rev.user_name}
                        </span>
                        <div className="flex text-[#FF8F9C]">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={10}
                              className={
                                i < rev.rating
                                  ? "text-[#FF8F9C]"
                                  : "text-[#EDEDED]"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#787878] text-[14px] mb-2">
                        {rev.comment}
                      </p>
                      <span className="text-[12px] text-[#787878]">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-2 text-[#787878] hover:text-[#FF6B6B] transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {user && user.role !== "admin" && (
            <div className="bg-[#F7F7F7] p-8 rounded-[10px] border border-[#EDEDED]">
              <ReviewForm
                productId={id}
                onReviewAdded={() => setRefreshKey((prev) => prev + 1)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
