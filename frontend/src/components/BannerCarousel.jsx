import { useEffect, useState } from "react";
import { useBannerStore } from "../store/useBannerStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

function BannerCarousel() {
  const { banners, fetchBanners } = useBannerStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full mb-8 rounded-lg overflow-hidden shadow-xl">
      <div className="relative h-64 md:h-96 bg-base-100">
        {currentBanner.link ? (
          <a href={currentBanner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover"
            />
          </a>
        ) : (
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay with title */}
        {currentBanner.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold">{currentBanner.title}</h2>
          </div>
        )}

        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 hover:bg-black/70 border-none text-white"
              aria-label="Previous banner"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 hover:bg-black/70 border-none text-white"
              aria-label="Next banner"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BannerCarousel;
