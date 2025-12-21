import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon, ImageIcon, TagIcon, DollarSignIcon } from "lucide-react";
import ImageWithLoader from "../components/ImageWithLoader";

function AdminProductPage() {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  const handleDelete = async () => {
    if (window.confirm("Haqiqatan ham ushbu mahsulotni o'chirib tashlamoqchimisiz?")) {
      await deleteProduct(id);
      navigate("/admin");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error shadow-lg">
          <Trash2Icon className="size-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <button onClick={() => navigate("/admin")} className="btn btn-ghost btn-sm sm:btn-md">
          <ArrowLeftIcon className="size-4 mr-2" />
          Admin panelga qaytish
        </button>
        
        {/* MOBILDA FAQAT ICON KO'RINISHIDAGI O'CHIRISH TUGMASI */}
        <button onClick={handleDelete} className="btn btn-error btn-outline btn-sm sm:hidden">
          <Trash2Icon className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12">
        
        {/* LEFT COLUMN: IMAGE PREVIEW */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-base-200 border-4 border-base-100">
              <ImageWithLoader
                src={formData.image || currentProduct?.image}
                alt={formData.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {!formData.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-300/50 backdrop-blur-sm">
                <ImageIcon className="size-12 opacity-20" />
              </div>
            )}
          </div>
          <div className="hidden lg:block p-4 bg-base-200/50 rounded-xl border border-base-content/5">
            <p className="text-xs text-base-content/60 leading-relaxed">
              Mahsulot rasmi URL manzilini o'ng tarafdagi formaga kiriting. Rasm avtomatik ravishda yangilanadi.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT FORM */}
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-xl border border-base-content/5">
            <div className="card-body p-6 sm:p-8">
              <h2 className="card-title text-2xl sm:text-3xl font-black mb-6">Mahsulotni tahrirlash</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProduct(id);
                }}
                className="space-y-5"
              >
                {/* PRODUCT NAME */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <TagIcon className="size-4" /> Mahsulot nomi
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: iPhone 15 Pro Max"
                    className="input input-bordered w-full focus:input-primary transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* PRODUCT PRICE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <DollarSignIcon className="size-4" /> Narxi (USD)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full focus:input-primary transition-all"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                {/* PRODUCT IMAGE URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <ImageIcon className="size-4" /> Rasm URL manzili
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24 focus:textarea-primary transition-all"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>

                {/* FORM ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  {/* DESKTOP DELETE BUTTON */}
                  <button 
                    type="button" 
                    onClick={handleDelete} 
                    className="btn btn-error btn-outline hidden sm:flex flex-1"
                  >
                    <Trash2Icon className="size-4 mr-2" />
                    O'chirish
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary flex-[2] shadow-lg shadow-primary/20"
                    disabled={loading || !formData.name || !formData.price || !formData.image}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-4 mr-2" />
                        O'zgarishlarni saqlash
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductPage;