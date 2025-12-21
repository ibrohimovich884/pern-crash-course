import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import ImageWithLoader from "./ImageWithLoader";
import { useCartStore } from "../store/useCartStore";
import { useLikesStore } from "../store/useLikesStore";

function ProductCardClient({ product }) {
  const { addToCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();

  // ID bo'yicha tekshirish (ba'zida API dan _id keladi, shunga diqqat qiling)
  const productId = product.id || product._id;
  const liked = isLiked(productId);
  const inCart = isInCart(productId);

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-base-200">
      
      {/* PRODUCT IMAGE SECTION */}
      <figure className="relative aspect-video w-full overflow-hidden bg-base-200">
        <Link to={`/product/${productId}`} className="w-full h-full block">
          <ImageWithLoader
            src={product.image}
            alt={product.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* LIKE BUTTON - Rasm ustida turishi uchun z-index berilgan */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLike(product);
          }}
          className={`absolute top-3 right-3 btn btn-circle btn-sm z-20 transition-all ${
            liked
              ? "btn-error bg-red-500 border-none text-white shadow-lg scale-110"
              : "btn-ghost bg-base-100/60 backdrop-blur-md hover:bg-base-100"
          }`}
          aria-label={liked ? "Saralanganlardan o'chirish" : "Saralanganlarga qo'shish"}
        >
          <Heart className={`size-5 ${liked ? "fill-current" : ""}`} />
        </button>
      </figure>

      {/* PRODUCT DETAILS */}
      <div className="card-body p-5">
        <Link to={`/product/${productId}`}>
          <h2 className="card-title text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h2>
        </Link>
        
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {Number(product.price).toLocaleString("ru-RU")} 
            <span className="text-sm ml-1 font-medium">so'm</span>
          </p>
        </div>

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-4 pt-3 border-t border-base-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className={`btn btn-sm sm:btn-md flex-1 sm:flex-none gap-2 ${
              inCart 
                ? "btn-success btn-outline" 
                : "btn-primary shadow-md hover:shadow-lg"
            }`}
          >
            <ShoppingCart className="size-4" />
            {inCart ? "Savatda" : "Savatga"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCardClient;