import React, { useState, useEffect } from "react";
import API from "../api";
import { FaTag, FaUpload, FaLink, FaTimes } from "react-icons/fa";

const AddProductModal = ({ onClose, onRefresh }) => {
  const [useUrl, setUseUrl] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount_price: "",
    stock: "",
    description: "",
    category: "General",
    image_url: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.discount_price &&
      Number(formData.discount_price) >= Number(formData.price)
    ) {
      alert("Error: Sale price must be lower than the regular price.");
      return;
    }

    setLoading(true);
    try {
      if (useUrl) {
        await API.post("/products", formData);
      } else {
        const data = new FormData();
        data.append("image", file);
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("discount_price", formData.discount_price || "");
        data.append("stock", formData.stock);
        data.append("description", formData.description);
        data.append("category", formData.category);

        await API.post("/products/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onRefresh();
      onClose();
    } catch (err) {
      alert("Failed to add product. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-['Poppins']">
      <div className="bg-white rounded-[10px] p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto border border-[#EDEDED] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#787878] hover:text-[#BA7786] transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <header className="mb-8 border-b border-[#EDEDED] pb-6">
          <h2 className="text-[24px] font-bold text-[#212121] uppercase tracking-tight">
            Add <span className="text-[#BA7786]">New Item</span>
          </h2>
          <p className="text-[#787878] text-[13px] italic mt-1 font-medium">
            Create a new entry in the Anon catalog
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview Area */}
          <div className="w-full h-48 bg-[#F7F7F7] rounded-[5px] border border-[#EDEDED] overflow-hidden flex items-center justify-center group">
            {(useUrl && formData.image_url) || preview ? (
              <img
                src={useUrl ? formData.image_url : preview}
                alt="Preview"
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="text-center">
                <FaUpload className="text-[#EDEDED] text-4xl mb-2 mx-auto" />
                <p className="text-[#787878] font-bold text-[10px] uppercase tracking-widest">
                  Awaiting Media
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest mb-2 block">
                Product Title
              </label>
              <input
                required
                className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[14px] font-medium"
                placeholder="e.g., Slim-Fit Cotton Shirt"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest block mb-2">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[14px]"
                  placeholder="0.00"
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#BA7786] uppercase tracking-widest block mb-2 flex items-center gap-1">
                  <FaTag size={10} /> Sale Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#fff1f2] border border-[#BA7786]/20 rounded-[5px] focus:border-[#BA7786] outline-none text-[14px] text-[#BA7786]"
                  placeholder="Optional"
                  onChange={(e) =>
                    setFormData({ ...formData, discount_price: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Stock & Collection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest mb-2 block">
                  Initial Stock
                </label>
                <input
                  required
                  type="number"
                  className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[14px]"
                  placeholder="0"
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest mb-2 block">
                  Collection
                </label>
                <select
                  className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[14px] cursor-pointer appearance-none"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Accessories">Accessories</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            {/* Media Selector */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest block">
                Media Source
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F7F7] rounded-[5px] border border-[#EDEDED]">
                <button
                  type="button"
                  onClick={() => setUseUrl(false)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-[3px] text-[10px] font-bold uppercase tracking-widest transition-all ${
                    !useUrl
                      ? "bg-[#212121] text-white shadow-sm"
                      : "text-[#787878] hover:text-[#212121]"
                  }`}
                >
                  <FaUpload size={10} /> Local
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrl(true)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-[3px] text-[10px] font-bold uppercase tracking-widest transition-all ${
                    useUrl
                      ? "bg-[#212121] text-white shadow-sm"
                      : "text-[#787878] hover:text-[#212121]"
                  }`}
                >
                  <FaLink size={10} /> URL
                </button>
              </div>

              {useUrl ? (
                <input
                  required
                  className="w-full px-4 py-3 bg-white border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[13px]"
                  placeholder="Insert image link here..."
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              ) : (
                <div className="relative group">
                  <input
                    required
                    type="file"
                    accept="image/*"
                    className="w-full text-[11px] font-bold text-[#787878] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#212121] file:text-white file:text-[10px] file:uppercase file:tracking-widest cursor-pointer"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest mb-2 block">
                Item Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] h-24 focus:border-[#BA7786] outline-none text-[14px] resize-none"
                placeholder="Describe the item details..."
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#212121] text-white rounded-[5px] font-bold uppercase tracking-widest text-[12px] hover:bg-[#BA7786] transition-all disabled:bg-[#EDEDED]"
            >
              {loading ? "Processing..." : "Confirm & Save Product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#787878] font-bold text-[11px] uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Cancel and Exit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
