import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Package, Trash2 } from "lucide-react";
import ImageWithLoader from "./ImageWithLoader";
import { useCartStore } from "../store/useCartStore";
import { useLikesStore } from "../store/useLikesStore";

function ProductCardClient({ product }) {
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();

  const productId = product.id || product._id;
  const liked = isLiked(productId);
  const inCart = isInCart(productId);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 group border border-base-200 overflow-hidden flex flex-col h-full">
      
      {/* PRODUCT IMAGE SECTION */}
      <figure className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-base-200">
        <Link to={`/product/${productId}`} className="w-full h-full block">
          <ImageWithLoader
            src={product.image}
            alt={product.name}
            className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? "grayscale" : ""}`}
          />
        </Link>

        {/* Status Badges */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-10">
          <div className={`badge ${isOutOfStock ? "badge-error" : "badge-success"} badge-sm sm:badge-md gap-1 shadow-sm opacity-90`}>
            <Package className="size-3" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-tighter">
              {isOutOfStock ? "Tugagan" : `${product.stock} ta`}
            </span>
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleLike(product);
          }}
          className={`absolute top-2 right-2 btn btn-circle btn-xs sm:btn-sm z-20 transition-all ${
            liked
              ? "btn-error bg-red-500 border-none text-white shadow-md scale-105"
              : "bg-base-100/70 backdrop-blur-sm border-none hover:bg-base-100"
          }`}
        >
          <Heart className={`size-4 sm:size-5 ${liked ? "fill-current" : ""}`} />
        </button>
      </figure>

      {/* PRODUCT DETAILS */}
      <div className="card-body p-3 sm:p-5 flex flex-col flex-grow gap-1">
        <Link to={`/product/${productId}`}>
          <h2 className="card-title text-sm sm:text-lg font-bold hover:text-primary transition-colors line-clamp-1 leading-tight">
            {product.name}
          </h2>
        </Link>
        
        <p className="text-[11px] sm:text-sm text-base-content/60 line-clamp-2 min-h-[32px] sm:min-h-[40px] mb-1 leading-tight">
          {product.description || "Batafsil ma'lumot olish uchun bosing."}
        </p>

        <div className="mt-auto">
          <p className="text-lg sm:text-2xl font-black text-primary">
            {Number(product.price).toLocaleString("ru-RU")} 
            <span className="text-[10px] sm:text-sm ml-1 font-medium opacity-70">so'm</span>
          </p>
        </div>

        {/* RESPONSIVE ACTIONS */}
        <div className="card-actions justify-end mt-3 pt-3 border-t border-base-200 flex-nowrap gap-1 sm:gap-2">
          {inCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                removeFromCart(productId);
              }}
              className="btn btn-square btn-sm sm:btn-md btn-error btn-outline shrink-0 transition-transform active:scale-90"
              title="O'chirish"
            >
              <Trash2 className="size-4 sm:size-5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              if (!inCart) addToCart(product);
            }}
            disabled={isOutOfStock}
            className={`btn btn-sm sm:btn-md flex-1 gap-1 sm:gap-2 font-bold text-[11px] sm:text-sm uppercase tracking-tight ${
              inCart 
                ? "btn-success no-animation cursor-default border-none" 
                : isOutOfStock 
                ? "btn-disabled bg-base-300" 
                : "btn-primary shadow-sm hover:shadow-md"
            }`}
          >
            <ShoppingCart className="size-3 sm:size-4" />
            {isOutOfStock ? "Yo'q" : inCart ? "Savatda" : "Savatga"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCardClient;
