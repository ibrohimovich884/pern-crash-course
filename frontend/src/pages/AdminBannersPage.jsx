import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBannerStore } from "../store/useBannerStore";
import { ImageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import BannerCard from "../components/BannerCard";
import AddBannerModal from "../components/AddBannerModal";

function AdminBannersPage() {
  const { banners, loading, error, fetchAllBanners } = useBannerStore();

  useEffect(() => {
    fetchAllBanners();
  }, [fetchAllBanners]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Admin – Banners</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin" className="btn btn-outline">
            Manage Products
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("add_banner_modal").showModal()}
          >
            <PlusCircleIcon className="size-5 mr-2" />
            Add Banner
          </button>
          <button className="btn btn-ghost btn-circle" onClick={fetchAllBanners}>
            <RefreshCwIcon className="size-5" />
          </button>
        </div>
      </div>

      <AddBannerModal />

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {banners.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <ImageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold ">No banners found</h3>
            <p className="text-gray-500 max-w-sm">
              Get started by adding your first banner to display on the home page
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminBannersPage;
