import { EditIcon, Trash2Icon, Package, AlignLeft } from "lucide-react"; // Yangi ikonlar
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import ImageWithLoader from "./ImageWithLoader";

function ProductCard({ product }) {
  const { deleteProduct } = useProductStore();

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200 overflow-hidden">
      {/* MAHSULOT RASMI */}
      <figure className="aspect-video w-full overflow-hidden relative">
        <ImageWithLoader
          src={product.image}
          alt={product.name}
          className="w-full h-full"
        />
        {/* Ombor holati rasm ustida */}
        <div className={`absolute bottom-2 left-2 badge ${product.stock > 0 ? 'badge-success' : 'badge-error'} gap-1 shadow-md`}>
          <Package className="size-3" />
          {product.stock} ta
        </div>
      </figure>

      <div className="card-body p-5 gap-3">
        {/* NOMI VA NARXI */}
        <div>
          <h2 className="card-title text-lg font-semibold truncate" title={product.name}>
            {product.name}
          </h2>
          <p className="text-xl font-bold text-primary">
            {Number(product.price).toLocaleString("ru-RU")} so'm
          </p>
        </div>

        {/* TAVSIF (Description) - Qisqartirilgan holatda */}
        <div className="flex items-start gap-2 text-sm text-base-content/70 bg-base-200/50 p-2 rounded-lg">
          <AlignLeft className="size-4 mt-1 shrink-0" />
          <p className="line-clamp-2 italic">
            {product.description || "Tavsif berilmagan..."}
          </p>
        </div>

        {/* AMALLAR (Tahrirlash va O'chirish) */}
        <div className="card-actions justify-end mt-2 border-t border-base-200 pt-4">
          <Link 
            to={`/admin/product/${product.id}`} 
            className="btn btn-sm btn-info btn-outline gap-2"
          >
            <EditIcon className="size-4" />
            Tahrirlash
          </Link>

          <button
            className="btn btn-sm btn-error btn-outline"
            onClick={() => {
              if(window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
                deleteProduct(product.id);
              }
            }}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;