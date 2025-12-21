import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useBannerStore } from "../store/useBannerStore";
import ImageWithLoader from "./ImageWithLoader";

function BannerCard({ banner }) {
  const { deleteBanner } = useBannerStore();
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* BANNER IMAGE */}
      <figure className="relative pt-[56.25%]">
        <ImageWithLoader
          src={banner.image}
          alt={banner.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {!banner.is_active && (
          <div className="absolute top-2 right-2 badge badge-error z-30">Inactive</div>
        )}
      </figure>

      <div className="card-body">
        {/* BANNER INFO */}
        <h2 className="card-title text-lg font-semibold">{banner.title || "Untitled Banner"}</h2>
        {banner.link && (
          <p className="text-sm text-base-content/70 truncate">
            Link: {banner.link}
          </p>
        )}

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-4">
          <Link to={`/admin/banner/${banner.id}`} className="btn btn-sm btn-info btn-outline">
            <EditIcon className="size-4" />
          </Link>

          <button
            className="btn btn-sm btn-error btn-outline"
            onClick={() => deleteBanner(banner.id)}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default BannerCard;
