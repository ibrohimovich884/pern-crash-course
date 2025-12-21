import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useCartStore } from "../store/useCartStore";
import { useLikesStore } from "../store/useLikesStore";
import { useEffect } from "react";
import { ArrowLeftIcon, ShoppingCart, Heart, Share2 } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-base-100 pb-20 sm:pb-8">
      {/* MOBILE HEADER - Tepada qotib turuvchi tugmalar (ixtiyoriy) */}
      <div className="sticky top-0 z-30 flex justify-between p-4 sm:hidden bg-gradient-to-b from-base-100/80 to-transparent">
        <button onClick={() => navigate("/")} className="btn btn-circle btn-sm bg-base-100 shadow-md border-none">
          <ArrowLeftIcon className="size-5" />
        </button>
        <button className="btn btn-circle btn-sm bg-base-100 shadow-md border-none">
          <Share2 className="size-5" />
        </button>
      </div>

      <div className="container mx-auto px-0 sm:px-4 sm:py-8 max-w-5xl">
        {/* DESKTOP BACK BUTTON */}
        <button onClick={() => navigate("/")} className="hidden sm:flex btn btn-ghost mb-6">
          <ArrowLeftIcon className="size-4 mr-2" />
          Mahsulotlarga qaytish
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 sm:gap-12">
          {/* PRODUCT IMAGE - Mobilda burchaklari yumaloqlanmagan, to'liq ekran */}
          <div className="relative group bg-base-200">
            <div className="aspect-square sm:rounded-2xl overflow-hidden shadow-sm sm:shadow-xl h-full max-h-[500px] md:max-h-full">
              <ImageWithLoader
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* LIKE BUTTON ON IMAGE (Mobile) */}
            <button
              onClick={() => toggleLike(currentProduct)}
              className={`absolute top-4 right-4 btn btn-circle shadow-lg sm:hidden ${
                isLiked(currentProduct.id) ? "btn-error" : "bg-base-100"
              }`}
            >
              <Heart className={`size-6 ${isLiked(currentProduct.id) ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="px-5 py-6 sm:px-0 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl sm:text-4xl font-black leading-tight">
                {currentProduct.name}
              </h1>
              
              {/* DESKTOP LIKE BUTTON */}
              <button
                onClick={() => toggleLike(currentProduct)}
                className={`hidden sm:flex btn btn-circle ${
                  isLiked(currentProduct.id) ? "btn-error" : "btn-ghost border-base-300"
                }`}
              >
                <Heart className={`size-6 ${isLiked(currentProduct.id) ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                ${Number(currentProduct.price).toLocaleString()}
              </span>
              <div className="badge badge-success badge-outline">Sotuvda bor</div>
            </div>

            <div className="divider opacity-50"></div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Mahsulot haqida</h3>
              <p className="text-base-content/70 leading-relaxed">
                Ushbu {currentProduct.name} eng yuqori sifatli materiallardan tayyorlangan. 
                Foydalanish uchun juda qulay va zamonaviy dizaynga ega. 
                Batafsil ma'lumot uchun biz bilan bog'lanishingiz mumkin.
              </p>
            </div>

            {/* ACTION BUTTONS - Desktopda oddiy, Mobilda pastda qotgan (Fixed) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100 border-t border-base-200 z-40 sm:static sm:p-0 sm:bg-transparent sm:border-none mt-8">
              <div className="flex gap-3 max-w-5xl mx-auto">
                <button
                  onClick={() => addToCart(currentProduct)}
                  className={`btn btn-primary flex-1 btn-lg shadow-lg ${
                    isInCart(currentProduct.id) ? "btn-outline" : ""
                  }`}
                >
                  <ShoppingCart className="size-6 mr-2" />
                  {isInCart(currentProduct.id) ? "Savatda bor" : "Savatga qo'shish"}
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