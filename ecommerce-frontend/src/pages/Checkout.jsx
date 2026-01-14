import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartItems,
  selectCartTotal,
  placeOrder,
} from "../redux/slices/cartSlice";
import {
  FaTruck,
  FaFileInvoiceDollar,
  FaRegCheckCircle,
  FaChevronRight,
} from "react-icons/fa";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { loading, error } = useSelector((state) => state.cart);

  const [useUrl, setUseUrl] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    phone_number: "",
    payment_screenshot_url: "",
  });

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.phone_number) {
      alert("Please provide your delivery details.");
      return;
    }
    if (!useUrl && !file) {
      alert("Please provide proof of payment.");
      return;
    }

    const orderData = new FormData();
    orderData.append("address", formData.address);
    orderData.append("phone_number", formData.phone_number);
    orderData.append("items", JSON.stringify(cartItems));
    orderData.append("total_amount", total);

    if (useUrl) {
      orderData.append("payment_screenshot", formData.payment_screenshot_url);
    } else {
      orderData.append("payment_screenshot", file);
    }

    const resultAction = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(resultAction)) {
      navigate("/my-orders");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 font-['Poppins']">
        <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">🛍️</span>
        </div>
        <h2 className="text-[24px] font-bold text-[#212121] mb-2 uppercase">
          Your Bag is Empty
        </h2>
        <p className="text-[#787878] mb-8 text-[15px]">
          Add items to your cart to proceed with checkout.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-10 py-3 bg-[#BA7786] text-white rounded-[5px] font-bold uppercase tracking-widest text-[13px] hover:bg-[#212121] transition-all"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl font-['Poppins']">
      <header className="mb-10 border-b border-[#EDEDED] pb-6">
        <h1 className="text-[#212121] text-[28px] font-bold uppercase tracking-wide">
          Secure <span className="text-[#BA7786]">Checkout</span>
        </h1>
        <p className="text-[#787878] text-[14px] mt-1">
          Provide delivery and payment verification to finalize your order.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* FORM SECTION */}
        <form onSubmit={handleConfirmOrder} className="lg:col-span-7 space-y-8">
          {/* LOGISTICS */}
          <section className="bg-white p-6 rounded-[10px] border border-[#EDEDED]">
            <h2 className="text-[16px] font-bold mb-6 flex items-center text-[#212121] uppercase tracking-wider">
              <FaTruck className="text-[#BA7786] mr-3" />
              Delivery Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#454545] uppercase mb-2 block">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-3 border border-[#EDEDED] rounded-[5px] outline-none focus:border-[#BA7786] text-[14px] transition-all"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#454545] uppercase mb-2 block">
                  Shipping Address
                </label>
                <textarea
                  name="address"
                  placeholder="Street name, Apartment, City, Postal Code"
                  rows="3"
                  className="w-full p-3 border border-[#EDEDED] rounded-[5px] outline-none focus:border-[#BA7786] text-[14px] transition-all"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* PAYMENT */}
          <section className="bg-white p-6 rounded-[10px] border border-[#EDEDED]">
            <h2 className="text-[16px] font-bold mb-6 flex items-center text-[#212121] uppercase tracking-wider">
              <FaFileInvoiceDollar className="text-[#BA7786] mr-3" />
              Payment Verification
            </h2>

            <div className="bg-gradient-to-r from-[#BA7786] to-[#ffb1ba] text-white p-6 rounded-[10px] mb-6 relative overflow-hidden shadow-md">
              <div className="relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-widest opacity-90 mb-3">
                  Bank Transfer Details
                </p>
                <p className="text-[13px] font-medium mb-1">
                  Maesha Global Treasury
                </p>
                <p className="text-[24px] font-bold tracking-wider">
                  4400-9921-0082
                </p>
              </div>
              <FaRegCheckCircle className="absolute -right-4 -bottom-4 text-white/20 text-8xl" />
            </div>

            <div className="flex bg-[#F7F7F7] p-1 rounded-[5px] mb-6">
              <button
                type="button"
                onClick={() => setUseUrl(false)}
                className={`flex-1 py-2 rounded-[5px] text-[11px] font-bold uppercase tracking-widest transition-all ${
                  !useUrl
                    ? "bg-white text-[#BA7786] shadow-sm"
                    : "text-[#787878]"
                }`}
              >
                Upload Screenshot
              </button>
              <button
                type="button"
                onClick={() => setUseUrl(true)}
                className={`flex-1 py-2 rounded-[5px] text-[11px] font-bold uppercase tracking-widest transition-all ${
                  useUrl
                    ? "bg-white text-[#BA7786] shadow-sm"
                    : "text-[#787878]"
                }`}
              >
                Paste Image URL
              </button>
            </div>

            <div className="space-y-4">
              {useUrl ? (
                <input
                  type="url"
                  name="payment_screenshot_url"
                  placeholder="https://imgur.com/your-receipt.jpg"
                  className="w-full p-3 border border-[#EDEDED] rounded-[5px] outline-none focus:border-[#BA7786] text-[14px]"
                  value={formData.payment_screenshot_url}
                  onChange={handleInputChange}
                />
              ) : (
                <div
                  className={`border-2 border-dashed rounded-[10px] p-6 text-center transition-all ${
                    preview
                      ? "border-[#BA7786] bg-[#FFF5F6]"
                      : "border-[#EDEDED] bg-[#F7F7F7]"
                  }`}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Receipt Preview"
                      className="h-32 mx-auto mb-4 rounded-[5px] shadow-sm border-2 border-white object-cover"
                    />
                  ) : (
                    <div className="mb-4 text-[#787878]">
                      <p className="text-[11px] font-bold uppercase tracking-widest">
                        Click to select image
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="text-[11px] font-bold text-[#454545] cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-[5px] file:border-0 file:text-[11px] file:font-bold file:bg-[#212121] file:text-white"
                  />
                </div>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#212121] text-white py-4 rounded-[5px] font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-[#BA7786] transition-all disabled:bg-[#EDEDED] disabled:text-[#787878]"
          >
            {loading ? "Processing..." : "Confirm & Place Order"}
          </button>
          {error && (
            <p className="text-[#d9534f] mt-4 text-center font-bold text-[12px] uppercase">
              {error}
            </p>
          )}
        </form>

        {/* SUMMARY SIDEBAR */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-10 bg-[#F7F7F7] p-8 rounded-[10px] border border-[#EDEDED]">
            <h2 className="text-[18px] font-bold mb-6 text-[#212121] uppercase tracking-wide border-b border-[#EDEDED] pb-3">
              Order Summary
            </h2>
            <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map((item) => {
                const currentPrice =
                  item.discount_price > 0 ? item.discount_price : item.price;
                return (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-white border border-[#EDEDED] rounded-[5px] overflow-hidden flex-shrink-0 p-1">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-[#212121] text-[13px] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#787878] uppercase">
                        QTY: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#212121] text-[14px]">
                        {(currentPrice * item.quantity).toFixed(2)} PKR
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-[#EDEDED] space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#787878]">Subtotal</span>
                <span className="font-semibold text-[#212121]">
                  {total.toFixed(2)} PKR
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#787878]">Shipping</span>
                <span className="font-bold text-[#5cb85c] text-[11px] uppercase">
                  Free
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#EDEDED]">
                <span className="text-[#212121] font-bold uppercase text-[12px]">
                  Total Amount
                </span>
                <span className="text-[24px] font-bold text-[#BA7786]">
                  {total.toFixed(2)} PKR
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
