import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Package, Info } from "lucide-react";
import ImageWithLoader from "./ImageWithLoader";
import { useCartStore } from "../store/useCartStore";
import { useLikesStore } from "../store/useLikesStore";

function ProductCardClient({ product }) {
  const { addToCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();

  const productId = product.id || product._id;
  const liked = isLiked(productId);
  const inCart = isInCart(productId);
  
  // Mahsulot omborda bormi?
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-base-200 overflow-hidden">
      
      {/* PRODUCT IMAGE SECTION */}
      <figure className="relative aspect-video w-full overflow-hidden bg-base-200">
        <Link to={`/product/${productId}`} className="w-full h-full block">
          <ImageWithLoader
            src={product.image}
            alt={product.name}
            className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? "grayscale" : ""}`}
          />
        </Link>

        {/* STOCK STATUS BADGE */}
        <div className={`absolute bottom-2 left-2 badge ${isOutOfStock ? "badge-error" : "badge-success"} gap-1 shadow-md z-10`}>
          <Package className="size-3" />
          {isOutOfStock ? "Tugagan" : `${product.stock} ta bor`}
        </div>

        {/* LIKE BUTTON */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleLike(product);
          }}
          className={`absolute top-3 right-3 btn btn-circle btn-sm z-20 transition-all ${
            liked
              ? "btn-error bg-red-500 border-none text-white shadow-lg scale-110"
              : "btn-ghost bg-base-100/60 backdrop-blur-md hover:bg-base-100"
          }`}
        >
          <Heart className={`size-5 ${liked ? "fill-current" : ""}`} />
        </button>
      </figure>

      {/* PRODUCT DETAILS */}
      <div className="card-body p-5 gap-1">
        <Link to={`/product/${productId}`}>
          <h2 className="card-title text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h2>
        </Link>
        
        {/* DESCRIPTION - Qisqa tavsif */}
        <p className="text-sm text-base-content/60 line-clamp-2 min-h-[40px] mb-2 leading-tight">
          {product.description || "Mahsulot haqida batafsil ma'lumot olish uchun bosing."}
        </p>

        <div className="flex flex-col gap-1">
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {Number(product.price).toLocaleString("ru-RU")} 
            <span className="text-sm ml-1 font-medium">so'm</span>
          </p>
        </div>

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-3 pt-3 border-t border-base-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={isOutOfStock} // Agar tugagan bo'lsa, bosib bo'lmaydi
            className={`btn btn-sm sm:btn-md flex-1 gap-2 ${
              inCart 
                ? "btn-success btn-outline" 
                : isOutOfStock 
                ? "btn-disabled bg-base-300" 
                : "btn-primary shadow-md hover:shadow-lg"
            }`}
          >
            <ShoppingCart className="size-4" />
            {isOutOfStock ? "Tugagan" : inCart ? "Savatda" : "Savatga"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCardClient;