import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { PackageIcon, AlertCircleIcon } from "lucide-react"; // Qo'shimcha ikonka
import BannerCarousel from "../components/bannerComponents/BannerCarousel";
import ProductCardClient from "../components/productComponents/ProductCardClient";

function HomePage() {
  // fetchProducts funksiyasini chaqirishda xatolik bo'lmasligi uchun store'dan olamiz
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Banner Section */}
      <section className="mb-6 sm:mb-10 overflow-hidden rounded-xl">
        <BannerCarousel />
      </section>
      
      {/* Header Section */}
      <header className="flex flex-col gap-1 mb-6 sm:mb-8 px-1 text-center sm:text-left">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Welcome to OybekMarket
        </h1>
        <p className="text-sm sm:text-base text-base-content/70">
          Eng so'nggi mahsulotlar, faqat siz uchun.
        </p>
      </header>

      {/* Error State - Alert komponentini chiroyli qilish */}
      {error && (
        <div className="alert alert-error mb-8 shadow-sm flex items-center gap-2">
          <AlertCircleIcon className="size-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State - Skeleton elementlarini to'g'irlash */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4 w-full">
              <div className="skeleton h-48 w-full rounded-xl"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* No Products State - Xavfsiz tekshiruv (Optional chaining) */}
          {(!products || products.length === 0) ? (
            <div className="flex flex-col justify-center items-center min-h-[40vh] space-y-4 px-4 text-center">
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
          ) : (
            /* PRODUCT GRID - products borligi aniq bo'lgandagina map ishlaydi */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCardClient key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default HomePage;