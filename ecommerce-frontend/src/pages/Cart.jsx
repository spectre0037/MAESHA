import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  selectCartTotal,
} from "../redux/slices/cartSlice";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaTag } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [] } = useSelector((state) => state.cart || {});
  const { user } = useSelector((state) => state.auth || {});
  const totalPrice = useSelector(selectCartTotal) || 0;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/checkout");
  };

  // --- EMPTY STATE ---
  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center font-['Poppins']">
        <div className="w-24 h-24 bg-[#F7F7F7] rounded-full flex items-center justify-center mx-auto mb-6">
          <FaShoppingCart className="text-[#EDEDED] text-4xl" />
        </div>
        <h2 className="text-[24px] font-bold text-[#212121] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#787878] mb-8 max-w-sm mx-auto text-[15px]">
          Looks like you haven't made your choice yet.
        </p>
        <Link
          to="/categories"
          className="bg-[#BA7786] text-white px-8 py-3 rounded-[5px] hover:bg-[#212121] transition-all inline-flex items-center gap-3 font-bold uppercase text-[13px] tracking-widest"
        >
          <FaArrowLeft size={12} /> Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl min-h-screen font-['Poppins']">
      <header className="mb-10 border-b border-[#EDEDED] pb-6">
        <h1 className="text-[#212121] text-[28px] font-bold uppercase tracking-wide">
          Shopping Cart
        </h1>
        <p className="text-[#787878] mt-1 text-[14px]">
          You have {items.length} items in your bag.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CART ITEMS LIST */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const hasDiscount =
              item.discount_price && Number(item.discount_price) > 0;
            const displayPrice = hasDiscount ? item.discount_price : item.price;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center bg-white border border-[#EDEDED] p-5 rounded-[10px] hover:shadow-md transition-shadow"
              >
                <div className="relative border border-[#EDEDED] rounded-[5px] p-2 bg-white">
                  <img
                    src={item.image_url || "/placeholder.png"}
                    alt={item.name}
                    className="w-24 h-24 object-contain"
                  />
                  {hasDiscount && (
                    <div className="absolute -top-2 -left-2 bg-[#BA7786] text-white p-1.5 rounded-full">
                      <FaTag size={8} />
                    </div>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
                  <h2 className="font-bold text-[16px] text-[#212121] mb-1">
                    {item.name}
                  </h2>
                  <p className="text-[#787878] text-[12px] uppercase tracking-wider mb-3">
                    {item.category}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <p className="text-[#BA7786] font-bold text-[18px]">
                      {Number(displayPrice).toFixed(2)} PKR
                    </p>
                    {hasDiscount && (
                      <span className="text-[#787878] line-through text-[14px]">
                        {Number(item.price).toFixed(2)} PKR
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-6 sm:mt-0">
                  {/* Quantity Toggle */}
                  <div className="flex items-center border border-[#EDEDED] rounded-[5px] h-[35px] bg-white">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      className="w-8 h-full flex items-center justify-center hover:bg-[#F7F7F7] text-[#212121] disabled:opacity-20"
                      disabled={item.quantity <= 1}
                    >
                      —
                    </button>
                    <span className="px-4 font-bold text-[#212121] text-[14px]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="w-8 h-full flex items-center justify-center hover:bg-[#F7F7F7] text-[#212121]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-[#787878] hover:text-[#FF6B6B] transition-colors p-2"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-[#F7F7F7] p-8 rounded-[10px] h-fit border border-[#EDEDED] lg:sticky lg:top-24">
          <h2 className="text-[18px] font-bold text-[#212121] mb-6 uppercase tracking-wider border-b border-[#EDEDED] pb-3">
            Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-[#787878] text-[15px]">
              <span>Subtotal</span>
              <span className="text-[#212121] font-semibold">
                {totalPrice.toFixed(2)} PKR
              </span>
            </div>
            <div className="flex justify-between text-[#787878] text-[15px]">
              <span>Shipping</span>
              <span className="text-[#5cb85c] font-bold text-[12px] uppercase">
                Free
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#EDEDED]">
            <span className="text-[#212121] font-bold uppercase text-[14px]">
              Total
            </span>
            <span className="text-[22px] font-bold text-[#BA7786]">
              {totalPrice.toFixed(2)} PKR
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-8 bg-[#212121] text-white py-3 rounded-[5px] font-bold uppercase text-[13px] tracking-widest hover:bg-[#BA7786] transition-all"
          >
            {user ? "Proceed to Checkout" : "Login to Checkout"}
          </button>

          <p className="text-center mt-4 text-[11px] text-[#787878] uppercase tracking-tighter">
            Secure Checkout Guaranteed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
