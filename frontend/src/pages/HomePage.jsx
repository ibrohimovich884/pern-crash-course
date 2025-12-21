import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { PackageIcon } from "lucide-react";
import BannerCarousel from "../components/BannerCarousel";
import ImageWithLoader from "../components/ImageWithLoader";

function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 ">
      <BannerCarousel />
      
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to PosgreStore</h1>
        <p className="text-base-content/70">
          Browse our latest products. Click on any item to see more details.
        </p>
      </div>

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {products.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold ">No products yet</h3>
            <p className="text-gray-500 max-w-sm">
              There are no products to display right now. Please check back later.
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
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <figure className="relative pt-[56.25%]">
                <ImageWithLoader
                  src={product.image}
                  alt={product.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{product.name}</h2>
                <p className="text-2xl font-bold text-primary">
                  ${Number(product.price).toFixed(2)}
                </p>
                <span className="link link-primary mt-2">View details</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
export default HomePage;
