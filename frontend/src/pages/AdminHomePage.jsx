import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon, KeyIcon, LayoutDashboardIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

function AdminHomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Panel</h1>
          <p className="text-base-content/60 text-sm">Mahsulotlar va inventarizatsiyani boshqarish</p>
        </div>

        {/* ACTION BUTTONS - Mobilda 2 ta ustunli grid bo'ladi */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3">
          <button
            className="btn btn-outline btn-sm sm:btn-md flex-1"
            onClick={() => document.getElementById("change_password_modal").showModal()}
          >
            <KeyIcon className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">Parol</span>
            <span className="sm:hidden text-[10px]">Parol</span>
          </button>

          <Link to="/admin/banners" className="btn btn-outline btn-sm sm:btn-md flex-1">
            <LayoutDashboardIcon className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">Banners</span>
            <span className="sm:hidden text-[10px]">Banner</span>
          </Link>

          <button
            className="btn btn-primary btn-sm sm:btn-md col-span-2 sm:col-auto"
            onClick={() => document.getElementById("add_product_modal").showModal()}
          >
            <PlusCircleIcon className="size-4 sm:mr-2" />
            Add Product
          </button>

          <button 
            className="btn btn-ghost btn-circle btn-sm sm:btn-md hidden sm:flex" 
            onClick={fetchProducts}
          >
            <RefreshCwIcon className={`size-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <AddProductModal />
      <ChangePasswordModal />

      {error && (
        <div className="alert alert-error mb-8 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {/* EMPTY STATE */}
      {products.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center h-[50vh] space-y-4 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-content/10">
          <div className="bg-base-100 rounded-full p-8 shadow-inner">
            <PackageIcon className="size-16 opacity-20" />
          </div>
          <div className="text-center space-y-2 px-4">
            <h3 className="text-2xl font-bold">Mahsulotlar mavjud emas</h3>
            <p className="text-base-content/60 max-w-sm">
              Siz hali birorta ham mahsulot qo'shmagansiz. "Add Product" tugmasini bosib birinchi mahsulotingizni qo'shing.
            </p>
          </div>
        </div>
      )}

      {/* LOADING & GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-80 w-full rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminHomePage;