import { useEffect, useState, useCallback } from "react";
import { useBannerStore } from "../store/useBannerStore";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import LazyImage from "./LazyImage";

function BannerCarousel() {
  const { banners, fetchBanners } = useBannerStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Keyingi banerga o'tish (memoized)
  const goToNext = useCallback(() => {
    if (banners?.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  }, [banners?.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Autoplay
  useEffect(() => {
    if (banners?.length > 1) {
      const interval = setInterval(goToNext, 5000);
      return () => clearInterval(interval);
    }
  }, [banners?.length, goToNext]);

  // SWIPE FUNKSIYASI (Qo'l bilan surish uchun)
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 70) goToNext(); // Chapga sursa keyingisi
    if (touchStart - touchEnd < -70) goToPrevious(); // O'ngga sursa oldingisi
    setTouchStart(null);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="container mx-auto px-4 mb-10">
      <div 
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl group border border-base-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* BANNER CONTENT - Aspect ratio [3/1] yoki [4/1] ingichka qiladi */}
        <div className="relative aspect-[21/9] sm:aspect-[3/1] md:aspect-[4/1] w-full bg-base-200">
          <a 
            href={currentBanner.link || "#"} 
            target={currentBanner.link ? "_blank" : "_self"}
            rel="noopener noreferrer" 
            className={`block w-full h-full ${!currentBanner.link && "pointer-events-none"}`}
          >
            <LazyImage
              key={currentBanner.id}
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              containerClassName="w-full h-full"
            />
          </a>

          {/* Overlay with Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12">
            <div className="max-w-2xl transform transition-all duration-500 translate-y-0 opacity-100">
              {currentBanner.title && (
                <h2 className="text-white text-xl md:text-4xl font-black mb-2 tracking-tight">
                  {currentBanner.title}
                </h2>
              )}
              {currentBanner.link && (
                <div className="flex items-center gap-2 text-primary-content/80 text-sm font-bold uppercase tracking-widest">
                  <span>Batafsil</span>
                  <ExternalLink className="size-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation arrows - Faqat kompyuterda ko'rinadi, mobilda surish bor */}
        {banners.length > 1 && (
          <div className="hidden sm:block">
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-md bg-base-100/20 hover:bg-base-100 border-none backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="size-6 text-white group-hover:text-base-content" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-md bg-base-100/20 hover:bg-base-100 border-none backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="size-6 text-white group-hover:text-base-content" />
            </button>
          </div>
        )}

        {/* Progress Bar (Dots o'rniga zamonaviyroq ko'rinish) */}
        {banners.length > 1 && (
          <div className="absolute bottom-0 left-0 h-1 bg-primary z-20 transition-all duration-500"
               style={{ width: `${((currentIndex + 1) / banners.length) * 100}%` }}>
          </div>
        )}

        {/* Dots indicator */}
        <div className="absolute bottom-4 right-6 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-8" : "bg-white/40 w-2 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BannerCarousel;