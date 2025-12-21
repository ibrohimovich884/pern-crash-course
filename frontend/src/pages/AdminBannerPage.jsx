import { useNavigate, useParams } from "react-router-dom";
import { useBannerStore } from "../store/useBannerStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";
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
    if (window.confirm("Are you sure you want to delete this banner?")) {
      await deleteBanner(id);
      navigate("/admin/banners");
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate("/admin/banners")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Banners
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* BANNER IMAGE */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100 relative h-96">
          <ImageWithLoader
            src={currentBanner?.image}
            alt={currentBanner?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* BANNER FORM */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Edit Banner</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBanner(id);
              }}
              className="space-y-6"
            >
              {/* BANNER TITLE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Banner Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter banner title"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* BANNER IMAGE URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Image URL</span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/banner.jpg"
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              {/* BANNER LINK URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Link URL (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  className="input input-bordered w-full"
                  value={formData.link || ""}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>

              {/* ACTIVE STATUS */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span className="label-text text-base font-medium">Active</span>
                </label>
              </div>

              {/* FORM ACTIONS */}
              <div className="flex justify-between mt-8">
                <button type="button" onClick={handleDelete} className="btn btn-error">
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Banner
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !formData.title || !formData.image}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBannerPage;
