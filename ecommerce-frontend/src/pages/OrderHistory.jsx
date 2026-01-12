import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaArrowLeft,
  FaReceipt,
  FaStar,
  FaClock,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import OrderDetailsModal from "../components/OrderdetailsModal";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-[#5cb85c15] text-[#5cb85c] border-[#5cb85c30]";
      case "shipped":
        return "bg-[#44b0ff15] text-[#44b0ff] border-[#44b0ff30]";
      case "pending":
        return "bg-[#f0ad4e15] text-[#f0ad4e] border-[#f0ad4e30]";
      case "cancelled":
        return "bg-[#d9534f15] text-[#d9534f] border-[#d9534f30]";
      default:
        return "bg-[#F7F7F7] text-[#787878] border-[#EDEDED]";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle size={10} />;
      case "shipped":
        return <FaTruck size={10} />;
      case "pending":
        return <FaClock size={10} />;
      case "cancelled":
        return <FaTimesCircle size={10} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 font-['Poppins']">
        <div className="w-10 h-10 border-4 border-[#EDEDED] border-t-[#FF8F9C] rounded-full animate-spin mb-4"></div>
        <p className="text-[#787878] font-semibold text-[14px]">
          Loading History...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-['Poppins']">
      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#EDEDED] pb-8">
        <div>
          <Link
            to="/"
            className="text-[#FF8F9C] text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 hover:text-[#212121] transition-colors"
          >
            <FaArrowLeft size={10} /> Back to Shop
          </Link>
          <h1 className="text-[28px] font-bold text-[#212121] uppercase tracking-tight">
            Order History
          </h1>
          <p className="text-[#787878] text-[14px] mt-1">
            Track and manage your previous acquisitions.
          </p>
        </div>
        <div className="bg-[#F7F7F7] border border-[#EDEDED] px-6 py-4 rounded-[10px] min-w-[180px]">
          <span className="text-[#787878] text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">
            Total Orders
          </span>
          <span className="text-[24px] font-bold text-[#212121]">
            {orders?.length || 0}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-[#d9534f10] border border-[#d9534f20] rounded-[5px] text-[#d9534f] text-[13px] font-medium text-center uppercase tracking-wide">
          {typeof error === "string"
            ? error
            : "Authentication error. Please refresh."}
        </div>
      )}

      {/* Main Content */}
      {!orders || orders.length === 0 ? (
        <div className="bg-white border border-[#EDEDED] rounded-[10px] py-20 flex flex-col items-center justify-center text-center">
          <div className="bg-[#F7F7F7] p-8 rounded-full mb-6 text-[#EDEDED]">
            <FaBoxOpen size={48} />
          </div>
          <h3 className="text-[18px] font-bold text-[#212121] uppercase">
            No Orders Found
          </h3>
          <p className="text-[#787878] mb-8 text-[14px]">
            You haven't placed any orders with us yet.
          </p>
          <Link
            to="/"
            className="bg-[#212121] text-white px-10 py-3 rounded-[5px] font-bold uppercase text-[12px] tracking-widest hover:bg-[#FF8F9C] transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              onClick={() => handleOpenOrder(order)}
              className="bg-white border border-[#EDEDED] rounded-[10px] overflow-hidden hover:shadow-md cursor-pointer transition-all group flex flex-col md:flex-row items-stretch"
            >
              {/* Index Number Tag */}
              <div className="bg-[#F7F7F7] group-hover:bg-[#212121] w-full md:w-14 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#EDEDED] transition-colors">
                <span className="text-[14px] font-bold text-[#787878] group-hover:text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 flex-1">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] border text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>

                    {order.status?.toLowerCase() === "delivered" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] border border-[#FF8F9C30] bg-[#FF8F9C10] text-[#FF8F9C] text-[10px] font-bold uppercase tracking-wider">
                        <FaStar size={9} /> Rate Products
                      </span>
                    )}
                  </div>
                  <h3 className="text-[16px] font-bold text-[#212121]">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[#787878] text-[10px] font-bold uppercase tracking-widest mb-1">
                      Total Amount
                    </p>
                    <p className="text-[20px] font-bold text-[#FF8F9C]">
                      $
                      {(
                        Number(order.total_amount || order.total_price) || 0
                      ).toFixed(2)}
                    </p>
                  </div>
                  <button className="bg-[#F7F7F7] group-hover:bg-[#FF8F9C] group-hover:text-white p-4 rounded-[5px] transition-all text-[#212121]">
                    <FaReceipt size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
