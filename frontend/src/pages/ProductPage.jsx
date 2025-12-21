import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";

function ProductPage() {
  const { currentProduct, loading, error, fetchProduct } = useProductStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

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

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate("/")} className="btn btn-ghost mb-4">
          <ArrowLeftIcon className="size-4 mr-2" />
          Back to Products
        </button>
        <div className="alert alert-info">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PRODUCT IMAGE */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="size-full object-cover"
          />
        </div>

        {/* PRODUCT DETAILS */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body space-y-4">
            <h2 className="card-title text-3xl font-bold">{currentProduct.name}</h2>
            <p className="text-3xl font-extrabold text-primary">
              ${Number(currentProduct.price).toFixed(2)}
            </p>
            <p className="text-base-content/70">
              This is a sample product detail page. Later you can add description, reviews or
              purchase actions here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductPage;
