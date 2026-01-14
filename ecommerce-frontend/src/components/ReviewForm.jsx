import React, { useState } from "react";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import API from "../api";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");

    setIsSubmitting(true);
    try {
      await API.post("/reviews", { product_id: productId, rating, comment });
      setComment("");
      setRating(0);
      onReviewAdded(); // Refresh the review list
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-10 rounded-[20px] shadow-sm border border-[#EDEDED] mt-8 transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 font-['Poppins']"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-[18px] md:text-[20px] font-bold text-[#212121] uppercase tracking-widest">
          Share Your <span className="text-[#BA7786]">Experience</span>
        </h3>
        <div className="w-10 h-[2px] bg-[#212121] mt-2"></div>
      </div>

      {/* Star Rating Section */}
      <div className="space-y-2 mb-6">
        <label className="text-[11px] font-bold text-[#787878] uppercase tracking-[0.1em]">
          Overall Rating
        </label>
        <div className="flex gap-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            const isActive = ratingValue <= (hover || rating);
            return (
              <FaStar
                key={index}
                className={`cursor-pointer transition-all duration-200 transform ${
                  isActive ? "scale-110" : "scale-100"
                }`}
                color={isActive ? "#BA7786" : "#EDEDED"}
                size={window.innerWidth < 768 ? 24 : 28}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>
      </div>

      {/* Comment Section */}
      <div className="space-y-2 mb-6">
        <label className="text-[11px] font-bold text-[#787878] uppercase tracking-[0.1em]">
          Your Comments
        </label>
        <textarea
          className="w-full p-4 md:p-5 rounded-[12px] border border-[#EDEDED] outline-none focus:border-[#BA7786] focus:ring-1 focus:ring-[#BA7786] transition-all text-[14px] text-[#454545] bg-[#F9F9F9] focus:bg-white min-h-[120px] md:min-h-[150px] resize-none"
          placeholder="What did you like or dislike? Your feedback helps the collection grow..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#212121] text-white px-10 py-4 rounded-[10px] font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-[#BA7786] active:scale-95 transition-all duration-300 disabled:bg-[#EDEDED] disabled:cursor-not-allowed shadow-sm"
      >
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            Post Review <FaPaperPlane size={12} className="opacity-70" />
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
