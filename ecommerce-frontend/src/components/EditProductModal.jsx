import React, { useState, useEffect } from "react";
import API from "../api";
import { FaTag, FaCloudUploadAlt, FaLink, FaTimes } from "react-icons/fa";

const EditProductModal = ({ product, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    ...product,
    discount_price: product.discount_price || "",
  });
  const [useUrl, setUseUrl] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(product.image_url);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useUrl) {
      setPreview(formData.image_url);
    } else if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(product.image_url);
    }
  }, [file, formData.image_url, useUrl, product.image_url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!useUrl && file) {
        const data = new FormData();
        data.append("image", file);
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("discount_price", formData.discount_price || "");
        data.append("stock", formData.stock);
        data.append("description", formData.description || "");
        data.append("category", formData.category || "general");

        await API.put(`/products/${product.id}/upload`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.put(`/products/${product.id}`, formData);
      }

      onRefresh();
      onClose();
    } catch (err) {
      alert("Update failed. Please check your connection.");
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
            Edit <span className="text-[#BA7786]">Product</span>
          </h2>
          <p className="text-[#787878] text-[12px] font-medium italic mt-1 uppercase tracking-wider">
            Identifier: #{product.id.toString().padStart(4, "0")}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview Area */}
          <div className="group relative w-full h-52 bg-[#F7F7F7] rounded-[5px] border border-[#EDEDED] overflow-hidden flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#212121]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <span className="bg-white px-3 py-1 rounded-[3px] text-[9px] font-bold uppercase tracking-widest shadow-sm">
                Live Preview
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest mb-2 block">
                Catalog Title
              </label>
              <input
                required
                className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[14px] font-medium"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Pricing Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest block mb-2">
                  Base Price ($)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[14px]"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#BA7786] uppercase tracking-widest block mb-2 flex items-center gap-1">
                  <FaTag size={10} /> Discount Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#fff1f2] border border-[#BA7786]/20 rounded-[5px] focus:border-[#BA7786] outline-none text-[14px] text-[#BA7786]"
                  value={formData.discount_price}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_price: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Stock & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest mb-2 block">
                  Inventory Level
                </label>
                <input
                  required
                  type="number"
                  className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[14px]"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest mb-2 block">
                  Catalog Category
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

            {/* Media Toggle */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#212121] uppercase tracking-widest block">
                Update Media Source
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
                  <FaCloudUploadAlt size={12} /> Local File
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
                  <FaLink size={10} /> Remote URL
                </button>
              </div>

              {useUrl ? (
                <input
                  className="w-full px-4 py-3 bg-white border border-[#EDEDED] rounded-[5px] focus:border-[#BA7786] outline-none text-[13px]"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              ) : (
                <div className="p-2 border border-[#EDEDED] rounded-[5px] bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    className="text-[11px] font-bold text-[#787878] file:mr-4 file:py-1 file:px-3 file:rounded-[3px] file:border-0 file:bg-[#212121] file:text-white file:text-[10px] cursor-pointer"
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
                className="w-full px-4 py-3 bg-[#F7F7F7] border border-[#EDEDED] rounded-[5px] h-28 focus:border-[#BA7786] outline-none text-[14px] resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#212121] text-white rounded-[5px] font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-[#BA7786] transition-all disabled:bg-[#EDEDED]"
            >
              {loading ? "Updating Archive..." : "Save Product Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#787878] font-bold text-[11px] uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
