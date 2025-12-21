import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { PackageIcon } from "lucide-react";
import BannerCarousel from "../components/BannerCarousel";
import ProductCardClient from "../components/ProductCardClient";

function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Banner mobilda balandligi kichrayadi */}
      <div className="mb-6 sm:mb-10 overflow-hidden rounded-xl">
        <BannerCarousel />
      </div>
      
      {/* Header Section - Markazlashgan va ixcham */}
      <div className="flex flex-col gap-1 mb-6 sm:mb-8 px-1 text-center sm:text-left">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Welcome to OybekMarket
        </h1>
        <p className="text-sm sm:text-base text-base-content/70">
          Eng so'nggi mahsulotlar, faqat siz uchun.
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-8 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {/* No Products State */}
      {products.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4 px-4 text-center">
          <div className="bg-base-200 rounded-full p-8">
            <PackageIcon className="size-16 opacity-20" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Mahsulotlar topilmadi</h3>
            <p className="text-base-content/60 mt-2 max-w-xs mx-auto">
              Hozircha bu bo'limda hech narsa yo'q. Keyinroq qaytib ko'ring.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="skeleton h-48 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        /* PRODUCT GRID - Mobilda 2 ta ustun! */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCardClient key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;