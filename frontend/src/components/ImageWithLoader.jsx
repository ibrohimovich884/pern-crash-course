import { useState } from "react";

function ImageWithLoader({ src, alt, className = "", ...props }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative w-full h-full">
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

      {/* Actual Image - Always loaded, no lazy loading */}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${className} ${imageLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
}

export default ImageWithLoader;


