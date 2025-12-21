import { useState, useEffect, useRef } from "react";

function LazyImage({ src, alt, className = "", containerClassName = "", ...props }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Reset states when src changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setIsInView(false);
  }, [src]);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    let mounted = true;

    // Function to check visibility
    const checkVisibility = () => {
      try {
        const rect = element.getBoundingClientRect();
        // Check if element is in or near viewport
        return (
          rect.top < window.innerHeight + 400 &&
          rect.bottom > -400 &&
          rect.left < window.innerWidth + 400 &&
          rect.right > -400
        );
      } catch (e) {
        return false;
      }
    };

    // Try to load immediately
    const tryLoad = () => {
      if (!mounted) return;
      if (checkVisibility()) {
        setIsInView(true);
        return true;
      }
      return false;
    };

    // Immediate check
    if (tryLoad()) {
      return () => {
        mounted = false;
      };
    }

    // Set up Intersection Observer with large rootMargin to load images that are close to viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (!mounted) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        rootMargin: "400px", // Load images 400px before they enter viewport
        threshold: 0,
      }
    );

    // Also check after layout with multiple attempts
    const checkAfterLayout = () => {
      if (!mounted) return;
      
      // Check immediately
      if (tryLoad()) return;
      
      // Check after requestAnimationFrame
      requestAnimationFrame(() => {
        if (!mounted) return;
        if (tryLoad()) return;
        
        // Start observing
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    // Start checking
    checkAfterLayout();

    return () => {
      mounted = false;
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div ref={containerRef} className={`relative ${containerClassName}`}>
      {/* Loading Skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-base-300 animate-pulse flex items-center justify-center z-10">
          <div className="loading loading-spinner loading-md text-primary"></div>
        </div>
      )}

      {/* Error State */}
      {imageError && (
        <div className="absolute inset-0 bg-base-200 flex items-center justify-center z-20">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto text-base-content/30 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-base-content/50">Image not found</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} ${imageLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
          {...props}
        />
      )}
    </div>
  );
}

export default LazyImage;
