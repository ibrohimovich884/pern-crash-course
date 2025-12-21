import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import ImageWithLoader from "./ImageWithLoader";

function ProductCard({ product }) {
  const { deleteProduct } = useProductStore();

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
      {/* PRODUCT IMAGE - aspect-video rasmni 16:9 formatda ushlab turadi */}
      <figure className="aspect-video w-full overflow-hidden relative">
        <ImageWithLoader
          src={product.image}
          alt={product.name}
          className="w-full h-full"
        />
      </figure>

      <div className="card-body p-5">
        <h2 className="card-title text-lg font-semibold truncate" title={product.name}>
          {product.name}
        </h2>
        <p className="text-xl font-bold text-primary">
          {Number(product.price).toLocaleString("ru-RU")} so'm
        </p>

        <div className="card-actions justify-end mt-4 border-t border-base-200 pt-4">
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