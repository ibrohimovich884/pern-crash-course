import { useState, useEffect, useRef } from "react";

function LazyImage({ src, alt, className = "", containerClassName = "", ...props }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Har safar src o'zgarganda holatni yangilaymiz
    setImageLoaded(false);
    setImageError(false);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target); // Bir marta ko'rinsa yetarli
          }
        });
      },
      {
        rootMargin: "200px", // Rasm ko'rinishidan 200px oldin yuklashni boshlaydi
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.disconnect();
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      {/* 1. Loading Skeleton - Rasm yuklanguncha yoki xato chiqquncha ko'rinadi */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-base-300 animate-pulse flex items-center justify-center z-10">
          <div className="loading loading-spinner loading-md text-primary"></div>
        </div>
      )}

      {/* 2. Error State */}
      {imageError && (
        <div className="absolute inset-0 bg-base-200 flex items-center justify-center z-20">
          <div className="text-center p-2">
            <p className="text-xs text-base-content/50 font-mono">Image Error</p>
          </div>
        </div>
      )}

      {/* 3. Actual Image - Faqat isInView bo'lganda DOMga qo'shiladi */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`${className} ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500 ease-in-out`}
          {...props}
        />
      )}
    </div>
  );
}

export default LazyImage;