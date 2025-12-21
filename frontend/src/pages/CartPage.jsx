import { Link } from "react-router-dom";
import { ArrowLeftIcon, Trash2Icon, PlusIcon, MinusIcon, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import ImageWithLoader from "../components/ImageWithLoader";

function CartPage() {
  const { cart, itemCount, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useCartStore();

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/" className="btn btn-ghost mb-8">
          <ArrowLeftIcon className="size-4 mr-2" />
          Bosh sahifaga qaytish
        </Link>

        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <ShoppingCartIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">Savat bo'sh</h3>
            <p className="text-gray-500 max-w-sm">
              Savatingizda mahsulot yo'q. Bosh sahifadan mahsulot qo'shing.
            </p>
            <Link to="/" className="btn btn-primary mt-4">
              Mahsulotlar sahifasiga o'tish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="btn btn-ghost">
          <ArrowLeftIcon className="size-4 mr-2" />
          Bosh sahifaga qaytish
        </Link>
        <button onClick={clearCart} className="btn btn-error btn-outline btn-sm">
          <Trash2Icon className="size-4 mr-2" />
          Savatni tozalash
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Savat ({itemCount} ta mahsulot)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="card-body">
                <div className="flex gap-4">
                  {/* PRODUCT IMAGE */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                      <ImageWithLoader
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* PRODUCT INFO */}
                  <div className="flex-1">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="card-title text-lg hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-primary mt-2">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="btn btn-sm btn-circle btn-outline"
                        >
                          <MinusIcon className="size-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="btn btn-sm btn-circle btn-outline"
                        >
                          <PlusIcon className="size-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        <Trash2Icon className="size-4 mr-2" />
                        O'chirish
                      </button>
                    </div>
                  </div>

                  {/* TOTAL PRICE */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg sticky top-24">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Buyurtma xulosa</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Mahsulotlar ({itemCount} ta)</span>
                  <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yetkazib berish</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Jami</span>
                  <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button className="btn btn-primary w-full btn-lg">
                Buyurtma berish
              </button>

              <p className="text-xs text-center text-base-content/60 mt-4">
                Bu demo versiya. Haqiqiy to'lov tizimi keyingi versiyada qo'shiladi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

