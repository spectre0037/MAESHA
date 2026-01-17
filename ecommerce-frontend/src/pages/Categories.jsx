import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import ProductCard from "../components/ProductCard";

const Categories = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedCategory = searchParams.get("type");

  const getHeroContent = () => {
    const category = selectedCategory?.toLowerCase();
    switch (category) {
      case "Jhumkas":
        return {
          title: "Women's Collection",
          subtitle: "Precision tailoring and modern essentials.",
          img: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop",
        };
      case "women":
        return {
          title: "Women's Fashion",
          subtitle: "Elegance defined through contemporary textures.",
          img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        };
      case "electronics":
        return {
          title: "Digital Tech",
          subtitle: "Cutting-edge innovation for your lifestyle.",
          img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop",
        };
      default:
        return {
          title: "New Collections",
          subtitle: "Discover our curated range of premium jewelry.",
          img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        };
    }
  };

  const hero = getHeroContent();

  const fetchCategories = async () => {
    try {
      const res = await API.get("/products/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/products", {
        params: category ? { category, limit: 100 } : { limit: 100 },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      setError("We couldn't load the products. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory, fetchProducts]);

  const handleCategoryClick = (cat) => {
    if (cat) setSearchParams({ type: cat });
    else setSearchParams({});
  };

  return (
    <div className="bg-white font-['Poppins'] min-h-screen">
      {/* --- DYNAMIC HERO SECTION --- */}
      <section className="container mx-auto px-4 pt-6 md:pt-10">
        <div className="relative w-full min-h-[350px] md:h-[450px] rounded-[15px] overflow-hidden shadow-md border border-[#EDEDED] flex items-center">
          <img
            src={hero.img}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {/* Overlay gradient for better text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>

          <div className="relative z-10 w-full max-w-2xl px-6 md:px-16 py-10">
            <div className="bg-white/40 backdrop-blur-md p-6 md:p-10 rounded-[12px] border border-white/50 inline-block animate-in fade-in slide-in-from-left-4">
              <p className="text-[#BA7786] text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mb-3">
                Trending Categories +
              </p>
              <h1 className="text-[#212121] text-[32px] md:text-[48px] font-extrabold leading-[1.1] mb-4 capitalize">
                {hero.title}
              </h1>
              <p className="text-[#454545] text-[14px] md:text-[16px] mb-8 max-w-sm leading-relaxed">
                {hero.subtitle}
              </p>
              <button className="bg-[#212121] text-white px-8 py-3.5 rounded-[5px] text-[12px] font-bold uppercase tracking-widest hover:bg-[#BA7786] transition-all duration-300 transform active:scale-95 shadow-lg">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* --- CATEGORY NAVIGATION --- */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#EDEDED] pb-5 mb-8">
            <h2 className="text-[#212121] text-[1.5rem] font-bold uppercase tracking-tight mb-4 md:mb-0">
              Browse <span className="text-[#BA7786]">Collections</span>
            </h2>
            <p className="text-[#787878] text-[13px] font-medium">
              Showing {products.length} Items
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-5 py-2.5 rounded-[5px] text-[11px] md:text-[13px] font-bold uppercase tracking-widest transition-all border ${
                !selectedCategory
                  ? "bg-[#212121] text-white border-[#212121] shadow-md"
                  : "bg-white text-[#454545] border-[#EDEDED] hover:border-[#BA7786] hover:text-[#BA7786]"
              }`}
            >
              All Pieces
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-5 py-2.5 rounded-[5px] text-[11px] md:text-[13px] font-bold uppercase tracking-widest transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#BA7786] text-white border-[#BA7786] shadow-md"
                    : "bg-white text-[#454545] border-[#EDEDED] hover:border-[#BA7786] hover:text-[#BA7786]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="bg-[#F5F5F5] aspect-[3/4] rounded-[10px]"></div>
                <div className="h-4 bg-[#F5F5F5] w-2/3 rounded"></div>
                <div className="h-4 bg-[#F5F5F5] w-1/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 px-6 bg-[#fff1f2] rounded-[15px] border border-[#BA7786]/20">
            <p className="text-[#BA7786] font-bold text-lg mb-4">{error}</p>
            <button
              onClick={() => fetchProducts(selectedCategory)}
              className="px-8 py-3 bg-[#212121] text-white rounded-[5px] text-[12px] font-bold uppercase tracking-widest hover:bg-[#BA7786] transition-all"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-[#F9F9F9] rounded-[15px] border border-dashed border-[#EDEDED]">
            <div className="text-4xl mb-4">empty_icon</div>
            <p className="text-[22px] text-[#212121] font-bold mb-2">
              Collection is Empty
            </p>
            <p className="text-[#787878] max-w-xs mx-auto">
              We couldn't find any items in this category. Check back soon for
              new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* --- ADMIN BANNER --- */}
        {user?.role === "admin" && (
          <div className="mt-24 p-8 bg-[#212121] rounded-[15px] flex flex-col md:flex-row items-center justify-between gap-6 border-l-[6px] border-[#BA7786] shadow-2xl">
            <div className="text-center md:text-left">
              <p className="text-white font-bold text-[18px] tracking-tight uppercase">
                Admin Catalog View
              </p>
              <p className="text-[#787878] text-[14px]">
                You are currently viewing the store with administrative
                privileges.
              </p>
            </div>
            <button className="w-full md:w-auto px-10 py-3.5 bg-[#BA7786] text-white rounded-[5px] text-[12px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#212121] transition-all duration-300">
              Manage Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
