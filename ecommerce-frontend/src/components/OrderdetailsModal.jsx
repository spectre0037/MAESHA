import React, { useEffect, useState } from "react";
import API from "../api";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { FaStar, FaTimes, FaDownload, FaPrint } from "react-icons/fa";

const OrderDetailsModal = ({ order, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get(`/orders/${order.id}/items`);
        setItems(res.data.items);
      } catch (err) {
        console.error("Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [order.id]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("printable-order-area");
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Maesha_Order_${order.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleReviewClick = (productId) => {
    onClose();
    navigate(`/product/${productId}`, { state: { scrollToReview: true } });
  };

  return (
    <div className="fixed inset-0 bg-[#21212190] backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-['Poppins']">
      <div className="bg-white rounded-[10px] p-6 md:p-10 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-8 no-print border-b border-[#EDEDED] pb-4">
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#212121] text-white rounded-[5px] font-bold text-[11px] uppercase tracking-widest hover:bg-[#FF8F9C] transition-all"
            >
              <FaDownload size={12} /> Save PDF
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-[#EDEDED] text-[#454545] rounded-[5px] font-bold text-[11px] uppercase tracking-widest hover:bg-[#F7F7F7] transition-all"
            >
              <FaPrint size={12} /> Print
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-[#787878] hover:text-[#FF8F9C] transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* PRINTABLE AREA START */}
        <div id="printable-order-area" className="bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-[#212121] tracking-tight mb-1">
                ANON <span className="text-[#FF8F9C]">MAESHA</span>
              </h1>
              <p className="text-[#787878] font-bold uppercase text-[10px] tracking-[0.3em]">
                Premium Lifestyle Store
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[11px] font-bold text-[#787878] uppercase mb-1">
                Invoice Reference
              </p>
              <p className="text-[20px] font-bold text-[#212121]">
                ORD-{order.id}
              </p>
              <p
                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-[5px] mt-2 inline-block border ${
                  order.status === "delivered"
                    ? "bg-[#5cb85c10] text-[#5cb85c] border-[#5cb85c20]"
                    : "bg-[#F7F7F7] text-[#787878] border-[#EDEDED]"
                }`}
              >
                {order.status}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-6 bg-[#F7F7F7] rounded-[10px] border border-[#EDEDED]">
            <div>
              <h3 className="text-[11px] font-bold uppercase text-[#787878] mb-3 tracking-widest border-b border-[#EDEDED] pb-1">
                Billed To
              </h3>
              <p className="font-bold text-[#212121] text-[16px]">
                {order.customer_name}
              </p>
              <p className="text-[#454545] text-[14px]">
                {order.customer_email}
              </p>
              <p className="text-[#454545] text-[14px] mt-1">
                {order.phone_number}
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="text-[11px] font-bold uppercase text-[#787878] mb-3 tracking-widest border-b border-[#EDEDED] pb-1">
                Shipment Destination
              </h3>
              <p className="text-[#454545] text-[14px] leading-relaxed italic">
                {order.address}
              </p>
              <p className="text-[#787878] text-[12px] mt-3 font-medium">
                Issued on: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-[#212121] text-left">
                  <th className="py-4 text-[#212121] text-[11px] font-bold uppercase tracking-widest">
                    Description
                  </th>
                  <th className="py-4 text-center text-[#212121] text-[11px] font-bold uppercase tracking-widest">
                    Qty
                  </th>
                  <th className="py-4 text-right text-[#212121] text-[11px] font-bold uppercase tracking-widest">
                    Price
                  </th>
                  <th className="py-4 text-right text-[#212121] text-[11px] font-bold uppercase tracking-widest">
                    Subtotal
                  </th>
                  <th className="py-4 text-center no-print text-[#212121] text-[11px] font-bold uppercase tracking-widest">
                    Review
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED]">
                {items.map((item) => (
                  <tr key={item.id} className="group">
                    <td className="py-5 font-bold text-[#212121] text-[14px]">
                      {item.product_name || "Premium Item"}
                    </td>
                    <td className="py-5 text-center text-[#454545] text-[14px]">
                      {item.quantity}
                    </td>
                    <td className="py-5 text-right text-[#454545] text-[14px]">
                      ${Number(item.price_at_purchase).toFixed(2)}
                    </td>
                    <td className="py-5 text-right font-bold text-[#212121] text-[14px]">
                      ${(item.quantity * item.price_at_purchase).toFixed(2)}
                    </td>
                    <td className="py-5 text-center no-print">
                      {order.status?.toLowerCase() === "delivered" ? (
                        <button
                          onClick={() => handleReviewClick(item.product_id)}
                          className="text-[#FF8F9C] hover:text-[#212121] transition-colors p-2"
                          title="Rate this product"
                        >
                          <FaStar size={16} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#EDEDED]">
                          <FaStar size={14} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t-2 border-[#212121] pt-6">
            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between text-[#787878] text-[13px]">
                <span>Shipping Fee</span>
                <span className="font-bold text-[#5cb85c] uppercase text-[11px]">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#212121] font-bold uppercase text-[14px]">
                  Total Amount
                </span>
                <span className="text-[24px] font-bold text-[#FF8F9C]">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="mt-12 pt-8 border-t border-dashed border-[#EDEDED]">
            <h3 className="text-[11px] font-bold uppercase text-[#787878] mb-4 tracking-widest">
              Payment Verification
            </h3>
            {order.payment_screenshot ? (
              <div className="inline-block p-1 border border-[#EDEDED] rounded-[5px]">
                <img
                  src={order.payment_screenshot}
                  alt="Payment Proof"
                  className="max-w-full h-auto rounded-[3px] max-h-[200px] grayscale hover:grayscale-0 transition-all cursor-zoom-in"
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <p className="text-[#d9534f] text-[12px] italic font-medium">
                Verified by Digital Transaction
              </p>
            )}
          </div>
        </div>
        {/* PRINTABLE AREA END */}

        <button
          onClick={onClose}
          className="w-full mt-10 py-3 bg-[#212121] text-white rounded-[5px] font-bold uppercase text-[12px] tracking-widest hover:bg-[#FF8F9C] transition-all no-print"
        >
          Return to History
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
