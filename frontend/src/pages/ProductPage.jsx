import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useLikesStore } from "../store/useLikesStore";
import { useEffect } from "react";
import { ArrowLeftIcon, ShoppingCart, Heart, Share2, Package, CheckCircle2, AlertTriangle } from "lucide-react";
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate("/")} className="btn btn-ghost mb-4">
          <ArrowLeftIcon className="size-4 mr-2" /> Orqaga
        </button>
        <div className="alert alert-error">{error || "Mahsulot topilmadi"}</div>
      </div>
    );
  }

  const isOutOfStock = currentProduct.stock <= 0;

  return (
    <div className="min-h-screen bg-base-100 pb-24 sm:pb-12">
      {/* MOBILE HEADER */}
      <div className="sticky top-0 z-30 flex justify-between p-4 sm:hidden bg-base-100/60 backdrop-blur-md">
        <button onClick={() => navigate("/")} className="btn btn-circle btn-sm bg-base-100 shadow-md">
          <ArrowLeftIcon className="size-5" />
        </button>
        <button className="btn btn-circle btn-sm bg-base-100 shadow-md">
          <Share2 className="size-5" />
        </button>
      </div>

      <div className="container mx-auto px-0 sm:px-4 sm:py-8 max-w-6xl">
        {/* DESKTOP BACK BUTTON */}
        <button onClick={() => navigate("/")} className="hidden sm:flex btn btn-ghost mb-6">
          <ArrowLeftIcon className="size-4 mr-2" />
          Asosiy sahifaga qaytish
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 sm:gap-12 bg-base-100 sm:rounded-3xl overflow-hidden shadow-2xl border border-base-200">

          {/* PRODUCT IMAGE SECTION */}
          <div className="relative group bg-base-200 flex items-center justify-center">
            <div className="aspect-square w-full overflow-hidden h-full max-h-[600px]">
              <ImageWithLoader
                src={currentProduct.image}
                alt={currentProduct.name}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-80" : ""}`}
              />
            </div>

            {/* LIKE BUTTON ON IMAGE (Mobile) */}
            <button
              onClick={() => toggleLike(currentProduct)}
              className={`absolute top-4 right-4 btn btn-circle shadow-lg sm:hidden z-20 ${isLiked(currentProduct.id) ? "btn-error" : "bg-base-100"
                }`}
            >
              <Heart className={`size-6 ${isLiked(currentProduct.id) ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* PRODUCT DETAILS SECTION */}
          <div className="px-6 py-8 sm:p-10 flex flex-col justify-start">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-2">
                  {currentProduct.name}
                </h1>
                {/* Category badge (optional) */}
              </div>

              {/* DESKTOP LIKE BUTTON */}
              <button
                onClick={() => toggleLike(currentProduct)}
                className={`hidden sm:flex btn btn-circle btn-lg shadow-md transition-all active:scale-90 ${isLiked(currentProduct.id) ? "btn-error text-white" : "btn-ghost border-base-300"
                  }`}
              >
                <Heart className={`size-7 ${isLiked(currentProduct.id) ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="text-4xl sm:text-5xl font-extrabold text-primary">
                {Number(currentProduct.price).toLocaleString()} <small className="text-lg font-bold">so'm</small>
              </span>

              {/* STOCK STATUS */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isOutOfStock ? "border-error text-error bg-error/5" : "border-success text-success bg-success/5"}`}>
                {isOutOfStock ? <AlertTriangle className="size-4" /> : <CheckCircle2 className="size-4" />}
                <span className="text-sm font-bold uppercase tracking-wider">
                  {isOutOfStock ? "Sotuvda tugagan" : `Omborda: ${currentProduct.stock} ta bor`}
                </span>
              </div>
            </div>

            <div className="divider"></div>

            {/* DESCRIPTION SECTION */}
            <div className="space-y-4 mb-8 bg-base-200/50 p-6 rounded-2xl border border-base-300">
              <div className="flex items-center gap-2 font-bold text-xl">
                <Package className="size-5 text-primary" />
                <h3>Mahsulot tavsifi</h3>
              </div>
              <p className="text-base-content/80 text-lg leading-relaxed whitespace-pre-line">
                {currentProduct.description || "Ushbu mahsulot haqida batafsil ma'lumot tez orada qo'shiladi."}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100/80 backdrop-blur-lg border-t border-base-200 z-40 sm:static sm:p-0 sm:bg-transparent sm:border-none">
              <div className="flex gap-4 max-w-5xl mx-auto">
                <button
                  onClick={() => addToCart(currentProduct)}
                  disabled={isOutOfStock}
                  className={`btn flex-1 btn-lg shadow-xl text-lg font-bold transition-all ${isInCart(currentProduct.id)
                      ? "btn-success text-white"
                      : isOutOfStock
                        ? "btn-disabled"
                        : "btn-primary"
                    }`}
                >
                  <ShoppingCart className="size-6 mr-2" />
                  {isOutOfStock ? "Tugagan" : isInCart(currentProduct.id) ? "Savatda bor" : "Savatga qo'shish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;