import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import ImageWithLoader from "./ImageWithLoader";
import { useCartStore } from "../store/useCartStore";
import { useLikesStore } from "../store/useLikesStore";

function ProductCardClient({ product }) {
  const { addToCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();

  const liked = isLiked(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
      {/* PRODUCT IMAGE */}
      <figure className="relative pt-[56.25%]">
        <Link to={`/product/${product.id}`}>
          <ImageWithLoader
            src={product.image}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </Link>

        {/* LIKE BUTTON */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleLike(product);
          }}
          className={`absolute top-3 right-3 btn btn-circle btn-sm z-20 ${liked
              ? "btn-error bg-red-500 hover:bg-red-600"
              : "btn-ghost bg-base-100/80 hover:bg-base-100"
            }`}
          aria-label={liked ? "Yoqtirganlar ro'yxatidan olib tashlash" : "Yoqtirganlar ro'yxatiga qo'shish"}
        >
          <Heart className={`size-5 ${liked ? "fill-current" : ""}`} />
        </button>
      </figure>

      <div className="card-body">
        {/* PRODUCT INFO */}
        <Link to={`/product/${product.id}`}>
          <h2 className="card-title text-lg font-semibold hover:text-primary transition-colors">
            {product.name}
          </h2>
        </Link>
        <p className="text-2xl font-bold text-primary">
          {Number(product.price).toLocaleString("ru-RU")} so'm
        </p>

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-4">
          <button
            onClick={() => addToCart(product)}
            className={`btn btn-primary btn-sm ${inCart ? "btn-outline" : ""
              }`}
          >
            <ShoppingCart className="size-4 mr-2" />
            {inCart ? "Savatda" : "Savatga"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCardClient;


