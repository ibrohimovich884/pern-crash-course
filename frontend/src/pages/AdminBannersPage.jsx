import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBannerStore } from "../store/useBannerStore";
import { ImageIcon, PlusCircleIcon, RefreshCwIcon, ArrowLeftIcon } from "lucide-react";
import BannerCard from "../components/BannerCard";
import AddBannerModal from "../components/bannerComponents/AddBannerModal";

function AdminBannersPage() {
  const { banners, loading, error, fetchAllBanners } = useBannerStore();

  useEffect(() => {
    fetchAllBanners();
  }, [fetchAllBanners]);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
             <ImageIcon className="size-4" />
             <span>Marketing boshqaruvi</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Bannerlar</h1>
          <p className="text-base-content/60 text-sm">Bosh sahifadagi reklama bannerlarini sozlash</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link to="/admin" className="btn btn-outline btn-sm sm:btn-md flex-1 sm:flex-none">
            <ArrowLeftIcon className="size-4 mr-2" />
            <span className="sm:inline">Mahsulotlar</span>
            <span className="sm:hidden">Orqaga</span>
          </Link>
          
          <button
            className="btn btn-primary btn-sm sm:btn-md flex-1 sm:flex-none"
            onClick={() => document.getElementById("add_banner_modal").showModal()}
          >
            <PlusCircleIcon className="size-4 mr-2" />
            Banner qo'shish
          </button>

          <button 
            className="btn btn-ghost btn-circle btn-sm sm:btn-md" 
            onClick={fetchAllBanners}
            title="Yangilash"
          >
            <RefreshCwIcon className={`size-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <AddBannerModal />

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-error mb-8 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && (!banners || banners.length === 0) && (
        <div className="flex flex-col justify-center items-center min-h-[45vh] space-y-5 bg-base-200/40 rounded-[2rem] border-2 border-dashed border-base-content/10">
          <div className="bg-base-100 rounded-full p-8 shadow-xl">
            <ImageIcon className="size-16 opacity-10" />
          </div>
          <div className="text-center space-y-2 px-6">
            <h3 className="text-2xl font-bold">Bannerlar yo'q</h3>
            <p className="text-base-content/60 max-w-sm mx-auto">
              Hozircha hech qanday reklama banneri yaratilmagan. Birinchi bannerni hoziroq qo'shing.
            </p>
          </div>
        </div>
      )}

      {/* LOADING & GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="skeleton h-48 w-full rounded-2xl"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners?.map((banner) => (
            <div key={banner.id || banner._id} className="group relative">
               <BannerCard banner={banner} />
               {/* Bu yerda BannerCard ichida Edit/Delete bor deb faraz qilamiz */}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminBannersPage;