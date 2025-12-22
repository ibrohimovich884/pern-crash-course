import { EditIcon, Trash2Icon, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useBannerStore } from "../store/useBannerStore";
import ImageWithLoader from "./ImageWithLoader";

function BannerCard({ banner }) {
  const { deleteBanner } = useBannerStore();

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 overflow-hidden">
      {/* BANNER IMAGE - Ingichka nisbat berildi */}
      <figure className="relative aspect-[21/9] w-full overflow-hidden bg-base-200">
        <ImageWithLoader
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 badge ${banner.is_active ? "badge-success" : "badge-error"} gap-1 shadow-md z-10`}>
          {banner.is_active ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          {banner.is_active ? "Active" : "Inactive"}
        </div>
      </figure>

      <div className="card-body p-4 flex-row items-center justify-between gap-4">
        <div className="overflow-hidden flex-1">
          <h2 className="card-title text-base font-bold truncate" title={banner.title}>
            {banner.title || "Untitled Banner"}
          </h2>
          {banner.link && (
            <p className="text-xs text-base-content/50 truncate">
              {banner.link}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 shrink-0">
          <Link to={`/admin/banner/${banner.id}`} className="btn btn-square btn-sm btn-info btn-outline">
            <EditIcon className="size-4" />
          </Link>
          <button
            className="btn btn-square btn-sm btn-error btn-outline"
            onClick={() => {
              if(window.confirm("Banerni o'chirmoqchimisiz?")) deleteBanner(banner.id);
            }}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default BannerCard;