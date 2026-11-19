/* eslint-disable react/no-unescaped-entities */
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { EmptyData, ErrorComponent, ProductCard } from "./shared";
import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "@/lib/redux/slices/productsSlice";
import { baseUrl } from "@/constants";
import LoadingProduct from "./LoadingProduct";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import ListProductCard from "./shared/ListProductCard";

const ProductsGrid = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );

  const search = useAppSelector((state) => state.filter.search);
  const categories = useAppSelector((state) => state.filter.categoryIds);
  const cooperatives = useAppSelector((state) => state.filter.cooperativeIds);
  const priceRange = useAppSelector((state) => state.filter.priceRange);
  const currency = useAppSelector((state) => state.currency.currency);

  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLElement | null | any>(null);
  const [displayMode, setDisplayMode] = useState("grid");

  const handleDisplayMode = (mode: string) => {
    setDisplayMode(mode);
  };

  const filteredItems = (
    products as { data: { rows: any[] } }
  ).data?.rows?.filter((product) => {
    const matchesName =
      product.__tbl_ecom_produit.produit
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.__tbl_ecom_category.category
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.__tbl_ecom_cooperative.cooperative
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categories.length === 0 || categories.includes(product.TblEcomCategoryId);

    const matchesCooperative =
      cooperatives.length === 0 ||
      cooperatives.includes(product.TblEcomCooperativeId);

    const [minPrice, maxPrice] = priceRange;
    const matchesPrice =
      (minPrice === null || product.prix_plus_commission >= minPrice) &&
      (maxPrice === null || product.prix_plus_commission <= maxPrice);

    return matchesName && matchesCategory && matchesCooperative && matchesPrice;
  });

  const numberOfPages = Math.ceil(filteredItems?.length / itemsPerPage);

  const paginateProducts = Array.isArray(filteredItems)
    ? filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const scrollToProducts = () => {
    const element = productsRef.current;
    const topOffset = 100;

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - topOffset;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollToProducts();
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPages) {
      setCurrentPage(currentPage + 1);
      scrollToProducts();
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());

    const handleResize = () => {
      if (window.matchMedia("(max-width: 760px)").matches) {
        setItemsPerPage(6);
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(9);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup function
    };
  }, [dispatch]);

  if (loading)
    return (
      <div className="w-full mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-start gap-5">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <LoadingProduct key={index} />
        ))}
      </div>
    );
  if (error) return <ErrorComponent error={error} />;

  if (!(products as { data: { rows: any[] } })?.data?.rows)
    return (
      <EmptyData title="Aucun Produit Disponible" message="Reviens plutard !" />
    );

  return (
    <section ref={productsRef} className="w-full mx-auto space-y-5">
      {/* Switch display */}
      <div className="w-full flex ">
        <div className="rounded-lg overflow-hidden">
          <button
            type="button"
            className={`bg-light py-2 px-3 hover:bg-secondary-green/70 group ${
              displayMode === "grid" && "bg-secondary-green"
            }`}
            onClick={() => handleDisplayMode("grid")}
          >
            <span className="sr-only">grid view</span>
            <Squares2X2Icon
              className={`w-5 h-5 ${
                displayMode === "grid" ? "text-light" : "text-dark"
              }`}
            />
          </button>
          <button
            type="button"
            className={`bg-light py-2 px-3 hover:bg-secondary-green/70 group ${
              displayMode === "list" && "bg-secondary-green"
            }`}
            onClick={() => handleDisplayMode("list")}
          >
            <span className="sr-only">list view</span>
            <ListBulletIcon
              className={`w-5 h-5 ${
                displayMode === "list" ? "text-light" : "text-dark"
              }`}
            />
          </button>
        </div>
      </div>
      {/* List  layout*/}
      {displayMode === "list" && (
        <div className="w-full">
          {paginateProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch justify-start gap-5">
              {paginateProducts.reverse().map((product, index) => (
                <ListProductCard
                  // id={product.__tbl_ecom_produit.id}
                  id={product.id}
                  key={index}
                  name={product.__tbl_ecom_produit.produit}
                  price={parseFloat(product.prix_plus_commission)}
                  image={`${baseUrl}/${product.__tbl_ecom_produit.image}`}
                  currency={product.currency}
                  unity={product.__tbl_ecom_unitesmesure.unity}
                  cooperative={product.__tbl_ecom_cooperative.cooperative}
                />
              ))}
            </div>
          ) : (
            <EmptyData title="Aucun Produit disponible" />
          )}

          <div className="mt-5 w-full mx-auto flex flex-col items-center justify-center notranslate">
            {(products as { data: { count: number } }).data?.count >
              itemsPerPage && (
              <div className="mx-auto inline-flex items-center justify-center rounded-lg overflow-hidden space-x-10 bg-gray-200">
                <button
                  type="button"
                  onClick={() => handlePrevPage()}
                  disabled={currentPage === 1}
                  className={`inline-flex texr-center items-center justify-center px-3 py-2 space-x-2 ${
                    currentPage === 1
                      ? "bg-gray-400"
                      : "bg-secondary-green hover:bg-primary-green"
                  }`}
                >
                  <span className="sr-only">previous products list</span>

                  <span className="text-white text-[14px] notranslate">
                    Prev
                  </span>
                </button>
                <div className="w-full text-[14px]">
                  {currentPage}/{numberOfPages}
                </div>
                <button
                  type="button"
                  onClick={() => handleNextPage()}
                  disabled={currentPage === numberOfPages}
                  className={`inline-flex texr-center items-center justify-center px-3 py-2 ${
                    currentPage === numberOfPages
                      ? "bg-gray-400"
                      : "bg-secondary-green hover:bg-primary-green"
                  }`}
                >
                  <span className="sr-only">previous products list</span>
                  <span className="text-white text-[14px] notranslate">
                    Next
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Grid Layout */}
      {displayMode === "grid" && (
        <div className="w-full">
          {paginateProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-start gap-5">
              {paginateProducts.reverse().map((product, index) => (
                <ProductCard
                  // id={product.__tbl_ecom_produit.id}
                  id={product.id}
                  key={index}
                  name={product.__tbl_ecom_produit.produit}
                  price={parseFloat(product.prix_plus_commission)}
                  image={`${baseUrl}/${product.__tbl_ecom_produit.image}`}
                  currency={currency}
                  unity={product.__tbl_ecom_unitesmesure.unity}
                  cooperative={product.__tbl_ecom_cooperative.cooperative}
                />
              ))}
            </div>
          ) : (
            <EmptyData title="Aucun produit !" />
          )}

          <div className="mt-5 w-full mx-auto flex flex-col items-center justify-center notranslate">
            {(products as { data: { count: number } }).data?.count >
              itemsPerPage && (
              <div className="mx-auto inline-flex items-center justify-center rounded-lg overflow-hidden space-x-10 bg-gray-200">
                <button
                  type="button"
                  onClick={() => handlePrevPage()}
                  disabled={currentPage === 1}
                  className={`inline-flex texr-center items-center justify-center px-3 py-2 space-x-2 ${
                    currentPage === 1
                      ? "bg-gray-400"
                      : "bg-secondary-green hover:bg-primary-green"
                  }`}
                >
                  <span className="sr-only">previous products list</span>

                  <span className="text-white text-[14px] notranslate">
                    Prev
                  </span>
                </button>
                <div className="w-full text-[14px]">
                  {currentPage}/{numberOfPages}
                </div>
                <button
                  type="button"
                  onClick={() => handleNextPage()}
                  disabled={currentPage === numberOfPages}
                  className={`inline-flex texr-center items-center justify-center px-3 py-2 ${
                    currentPage === numberOfPages
                      ? "bg-gray-400"
                      : "bg-secondary-green hover:bg-primary-green"
                  }`}
                >
                  <span className="sr-only">previous products list</span>
                  <span className="text-white text-[14px] notranslate">
                    Next
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsGrid;
