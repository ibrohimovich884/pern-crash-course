import { useNavigate, useParams } from "react-router-dom";
import { useBannerStore } from "../store/useBannerStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon, ImageIcon, LinkIcon, TypeIcon } from "lucide-react";
import ImageWithLoader from "../components/ImageWithLoader";

function AdminBannerPage() {
  const {
    currentBanner,
    formData,
    setFormData,
    loading,
    error,
    fetchBanner,
    updateBanner,
    deleteBanner,
  } = useBannerStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchBanner(id);
  }, [fetchBanner, id]);

  const handleDelete = async () => {
    if (window.confirm("Ushbu bannerni o'chirishni tasdiqlaysizmi?")) {
      await deleteBanner(id);
      navigate("/admin/banners");
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
        <button onClick={() => navigate("/admin/banners")} className="btn btn-ghost btn-sm sm:btn-md">
          <ArrowLeftIcon className="size-4 mr-2" />
          Bannerlar ro'yxatiga qaytish
        </button>
        
        {/* MOBILDA O'CHIRISH TUGMASI ICON HOLATIDA */}
        <button onClick={handleDelete} className="btn btn-error btn-outline btn-sm sm:hidden">
          <Trash2Icon className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: BANNER PREVIEW (40% width on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-content/5">
            <div className="p-4 border-b border-base-200 bg-base-200/30">
              <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                <ImageIcon className="size-4" /> Banner ko'rinishi
              </h3>
            </div>
            {/* Bannerlar ko'pincha 16:9 yoki 21:9 formatda bo'ladi */}
            <div className="aspect-video relative bg-base-300">
              <ImageWithLoader
                src={formData.image || currentBanner?.image}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
              {/* STATUS BADGE OVERLAY */}
              <div className={`absolute top-3 right-3 badge ${formData.is_active ? 'badge-success' : 'badge-ghost'} gap-1 shadow-md`}>
                {formData.is_active ? "Aktiv" : "Nofaol"}
              </div>
            </div>
          </div>
          <p className="text-xs text-base-content/50 px-2 italic">
            * Tavsiya etilgan o'lcham: 1920x1080px yoki 1200x600px
          </p>
        </div>

        {/* RIGHT COLUMN: EDIT FORM (60% width on desktop) */}
        <div className="lg:col-span-7">
          <div className="card bg-base-100 shadow-xl border border-base-content/5">
            <div className="card-body p-6 sm:p-8">
              <h2 className="card-title text-2xl font-black mb-6">Bannerni tahrirlash</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateBanner(id);
                }}
                className="space-y-5"
              >
                {/* BANNER TITLE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <TypeIcon className="size-4" /> Banner nomi
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Yozgi chegirmalar"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {/* BANNER IMAGE URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <ImageIcon className="size-4" /> Rasm URL (Landscape)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-20 focus:textarea-primary"
                    placeholder="https://example.com/banner-image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>

                {/* BANNER LINK URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold flex items-center gap-2">
                      <LinkIcon className="size-4" /> Link (Ixtiyoriy)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/category/sales"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.link || ""}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>

                {/* ACTIVE STATUS TOGGLE */}
                <div className="form-control bg-base-200/50 p-4 rounded-xl border border-base-content/5">
                  <label className="label cursor-pointer justify-between">
                    <span className="label-text font-bold text-base">Banner aktivmi?</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-lg"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                  </label>
                  <p className="text-[10px] text-base-content/50 mt-1">
                    Agar o'chirib qo'ysangiz, ushbu banner bosh sahifada ko'rinmaydi.
                  </p>
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
                    className="btn btn-primary flex-[2] shadow-lg"
                    disabled={loading || !formData.title || !formData.image}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-4 mr-2" />
                        Saqlash
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

export default AdminBannerPage;