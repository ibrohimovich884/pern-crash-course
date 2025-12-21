import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useLikesStore } from "../store/useLikesStore";
import { useEffect } from "react";
import { ArrowLeftIcon, ShoppingCart, Heart } from "lucide-react";
import ImageWithLoader from "../components/ImageWithLoader";

function ProductPage() {
  const { currentProduct, loading, error, fetchProduct } = useProductStore();
  const { addToCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate("/")} className="btn btn-ghost mb-4">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Products
        </button>
        <div className="alert alert-info">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PRODUCT IMAGE */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100 relative h-96">
          <ImageWithLoader
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* PRODUCT DETAILS */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="card-title text-3xl font-bold">{currentProduct.name}</h2>
              <button
                onClick={() => toggleLike(currentProduct)}
                className={`btn btn-circle btn-sm ${
                  isLiked(currentProduct.id)
                    ? "btn-error"
                    : "btn-ghost"
                }`}
                aria-label={isLiked(currentProduct.id) ? "Yoqtirganlar ro'yxatidan olib tashlash" : "Yoqtirganlar ro'yxatiga qo'shish"}
              >
                <Heart className={`size-5 ${isLiked(currentProduct.id) ? "fill-current" : ""}`} />
              </button>
            </div>
            <p className="text-3xl font-extrabold text-primary">
              ${Number(currentProduct.price).toFixed(2)}
            </p>
            <p className="text-base-content/70">
              Bu mahsulot haqida batafsil ma'lumot. Keyinchalik bu yerga tavsif, sharhlar va boshqa ma'lumotlar qo'shiladi.
            </p>
            
            {/* ACTION BUTTONS */}
            <div className="card-actions pt-4">
              <button
                onClick={() => addToCart(currentProduct)}
                className={`btn btn-primary btn-lg flex-1 ${
                  isInCart(currentProduct.id) ? "btn-outline" : ""
                }`}
              >
                <ShoppingCart className="size-5 mr-2" />
                {isInCart(currentProduct.id) ? "Savatda" : "Savatga qo'shish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductPage;
