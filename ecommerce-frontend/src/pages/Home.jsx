import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    items: products,
    loading,
    pagination,
  } = useSelector((state) => state.products);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselData = [
    {
      id: 1,
      title: "Mens",
      subtitle: "Get up to 50% off on all new arrivals",
      img: "../assets/1.jpeg",
      link: "/category",
    },
    {
      id: 2,
      title: "Women",
      subtitle: "Latest gadgets for your workspace",
      img: "../assets/2.jpeg",
      link: "/category",
    },
    {
      id: 3,
      title: "Tech Essentials 2024",
      subtitle: "Latest gadgets for your workspace",
      img: "../assets/3.jpeg",
      link: "/category",
    },
    {
      id: 4,
      title: "Jhumkas",
      subtitle: "Latest gadgets for your workspace",
      img: "../assets/4.jpeg",
      link: "/category",
    },
  ];

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  // 1. Auto-slide Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselData.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselData.length]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: 8,
        search: searchQuery,
      })
    );
  }, [dispatch, currentPage, searchQuery]);

  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage,
      ...(searchQuery && { search: searchQuery }),
    });
  };

  const calculateDiscount = (original, sale) => {
    const org = Number(original);
    const sl = Number(sale);
    if (!org || !sl) return 0;
    return Math.round(((org - sl) / org) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="animate-pulse bg-[#EDEDED] aspect-square rounded-[10px]"></div>
            <div className="h-4 w-1/2 bg-[#EDEDED] animate-pulse rounded"></div>
            <div className="h-6 w-full bg-[#EDEDED] animate-pulse rounded"></div>
            <div className="h-10 w-full bg-[#EDEDED] animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 md:py-10 min-h-screen font-['Poppins']">
      {/* --- CAROUSEL SECTION --- */}
      {!searchQuery && (
        <section className="relative w-full h-[250px] md:h-[400px] rounded-[15px] overflow-hidden mb-10 group shadow-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselData.map((slide) => (
              <div key={slide.id} className="min-w-full h-full relative">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-8 md:px-16 text-white">
                  <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 animate-in fade-in slide-in-from-left duration-700">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-lg mb-6 text-gray-100">
                    {slide.subtitle}
                  </p>
                  <Link
                    to='/'
                    className="bg-[#BA7786] text-white px-6 py-2 md:py-3 rounded-[5px] text-[12px] md:text-[14px] font-bold uppercase w-fit hover:bg-white hover:text-[#212121] transition-all"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === 0 ? carouselData.length - 1 : prev - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 p-2 rounded-full text-white backdrop-blur-sm transition-all"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === carouselData.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 p-2 rounded-full text-white backdrop-blur-sm transition-all"
          >
            <FaChevronRight size={20} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselData.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? "w-8 bg-[#BA7786]" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="border-b border-[#EDEDED] pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          {searchQuery ? (
            <h2 className="text-[#212121] text-[1.1rem] md:text-[1.25rem] font-semibold uppercase tracking-wide">
              Results for:{" "}
              <span className="text-[#BA7786] italic">"{searchQuery}"</span>
            </h2>
          ) : (
            <h2 className="text-[#212121] text-[1.1rem] md:text-[1.25rem] font-semibold uppercase tracking-wide border-b-2 border-[#BA7786] inline-block pb-2">
              New Products
            </h2>
          )}
        </div>

        {products.length > 0 && (
          <p className="text-[#787878] text-[12px] md:text-[14px]">
            Showing{" "}
            <span className="font-bold text-[#212121]">{products.length}</span>{" "}
            of{" "}
            <span className="font-bold text-[#212121]">
              {pagination.totalItems}
            </span>{" "}
            items
          </p>
        )}
      </div>

      {/* --- PRODUCT GRID --- */}
      {products.length === 0 ? (
        <div className="text-center py-12 md:py-20 bg-[#F7F7F7] rounded-[10px] border border-[#EDEDED] px-4">
          <div className="text-[#787878] mb-4 flex justify-center">
            <FaSearch size={40} className="md:size-12" />
          </div>
          <h3 className="text-[18px] md:text-[20px] font-bold text-[#212121]">
            No Products Found
          </h3>
          <p className="text-[#787878] mt-2 mb-6 text-sm md:text-base">
            Try adjusting your search or category filters.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="bg-[#BA7786] text-white px-6 py-2.5 rounded-[5px] text-[12px] md:text-[14px] font-bold uppercase hover:bg-[#212121] transition-all w-full sm:w-auto"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
            {products.map((product) => {
              const isOnSale =
                product.discount_price && product.discount_price > 0;
              return (
                <div
                  key={product.id}
                  className="showcase group border border-[#EDEDED] rounded-[10px] overflow-hidden hover:shadow-[0_5px_20px_hsla(0,0%,0%,0.1)] transition-all duration-300 bg-white flex flex-col h-full"
                >
                  <div className="relative overflow-hidden aspect-square bg-[#F7F7F7] shrink-0">
                    <img
                      src={
                        product.image_url || "https://via.placeholder.com/400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isOnSale && (
                      <p className="absolute top-2 left-2 bg-[#BA7786] text-white text-[10px] font-semibold px-2 py-0.5 rounded-[5px]">
                        -
                        {calculateDiscount(
                          product.price,
                          product.discount_price
                        )}
                        %
                      </p>
                    )}
                  </div>

                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <Link
                      to={`/category/${product.category}`}
                      className="text-[#BA7786] text-[11px] font-medium uppercase mb-1 truncate"
                    >
                      {product.category}
                    </Link>
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <h3 className="text-[#454545] text-[14px] font-medium mb-2 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      {isOnSale ? (
                        <>
                          <span className="text-[#212121] font-bold text-[15px]">
                            {Number(product.discount_price).toFixed(2)} PKR
                          </span>
                          <del className="text-[#787878] text-[12px]">
                            {Number(product.price).toFixed(2)} PKR
                          </del>
                        </>
                      ) : (
                        <span className="text-[#212121] font-bold text-[15px]">
                          {Number(product.price).toFixed(2)} PKR
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="mt-4 w-full block py-2 bg-[#212121] text-white text-center rounded-[5px] text-[11px] font-bold uppercase tracking-wider hover:bg-[#BA7786] transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Component... (Keep your existing pagination code here) */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 md:mt-16 flex justify-center">
              <nav className="flex items-center gap-1 border border-[#EDEDED] p-1 rounded-[8px] bg-white shadow-sm">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded-[5px] text-[#454545] hover:bg-[#F7F7F7] disabled:opacity-30 transition-all"
                  aria-label="Previous Page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="px-3 md:px-4 text-[12px] md:text-[13px] font-semibold text-[#454545] whitespace-nowrap">
                  Page {pagination.currentPage} / {pagination.totalPages}
                </div>

                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 rounded-[5px] text-[#454545] hover:bg-[#F7F7F7] disabled:opacity-30 transition-all"
                  aria-label="Next Page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Home;
