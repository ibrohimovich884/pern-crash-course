import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon, ImageIcon, TagIcon, DollarSignIcon, LayersIcon, AlignLeft } from "lucide-react";
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

  if (loading && !currentProduct) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10 max-w-5xl">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <button onClick={() => navigate("/admin")} className="btn btn-ghost btn-sm sm:btn-md text-base-content/70">
          <ArrowLeftIcon className="size-4 mr-2" />
          Admin panelga qaytish
        </button>

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

            {/* Stock status badge on image preview */}
            <div className={`absolute top-4 left-4 badge ${formData.stock > 0 ? 'badge-success' : 'badge-error'} shadow-lg`}>
              {formData.stock > 0 ? `${formData.stock} ta mavjud` : "Tugagan"}
            </div>
          </div>

          <div className="p-4 bg-info/10 rounded-xl border border-info/20">
            <p className="text-xs text-info-content/80 leading-relaxed flex gap-2">
              <ImageIcon className="size-4 shrink-0" />
              Mahsulot rasmi URL manzilini o'ng tarafdagi formaga kiriting. Tahrirlash tugallangach "Saqlash" tugmasini bosing.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT FORM */}
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-xl border border-base-content/5">
            <div className="card-body p-6 sm:p-8">
              <h2 className="card-title text-2xl sm:text-3xl font-black mb-6">Tahrirlash</h2>

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
                      <TagIcon className="size-4 text-primary" /> Mahsulot nomi
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PRODUCT PRICE */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold flex items-center gap-2">
                        <DollarSignIcon className="size-4 text-primary" /> Narxi
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input input-bordered w-full focus:input-primary"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>

                  {/* PRODUCT STOCK */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold flex items-center gap-2">
                        <LayersIcon className="size-4 text-primary" /> Ombor qoldig'i
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input input-bordered w-full focus:input-primary"
                      value={formData.stock}
                      // SHU YERNI O'ZGARTIRING:
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                {/* PRODUCT IMAGE URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <ImageIcon className="size-4 text-primary" /> Rasm URL manzili
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>

                {/* PRODUCT DESCRIPTION */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <AlignLeft className="size-4 text-primary" /> Batafsil tavsif
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-32 focus:textarea-primary"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {/* FORM ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
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
                    disabled={loading || !formData.name || !formData.price || !formData.image || !formData.description}
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