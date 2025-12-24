import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeftIcon, Trash2Icon, PlusIcon, MinusIcon, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import ImageWithLoader from "../components/ImageWithLoader";

function CartPage() {

    const { cart, itemCount, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore(); // Login holatini tekshirish uchun
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate("/checkout");
        } else {
            // Login qilmagan bo'lsa, login sahifasiga yuboramiz va 
            // u yerdan yana orqaga (checkoutga) qaytishi uchun state yuboramiz
            navigate("/login", { state: { from: { pathname: "/checkout" } } });
        }
    };
    if (itemCount === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Link to="/" className="btn btn-ghost mb-8">
                    <ArrowLeftIcon className="size-4 mr-2" />
                    Bosh sahifaga qaytish
                </Link>

                <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                    <div className="bg-base-200 rounded-full p-8">
                        <ShoppingCartIcon className="size-16 opacity-50" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-semibold">Savat bo'sh</h3>
                        <p className="text-base-content/60 max-w-sm">
                            Savatingizda mahsulot yo'q. Bosh sahifadan mahsulot qo'shing.
                        </p>
                        <Link to="/" className="btn btn-primary mt-4">
                            Xarid qilishni boshlash
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <Link to="/" className="btn btn-ghost btn-sm sm:btn-md">
                    <ArrowLeftIcon className="size-4 mr-2" />
                    Bosh sahifa
                </Link>
                <button onClick={clearCart} className="btn btn-error btn-outline btn-xs sm:btn-sm">
                    <Trash2Icon className="size-4 mr-2" />
                    Savatni tozalash
                </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">
                Savat ({itemCount} ta mahsulot)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CART ITEMS LIST */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="card bg-base-100 shadow-md border border-base-200"
                        >
                            <div className="card-body p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* PRODUCT IMAGE - Mobilda markazda */}
                                    <Link to={`/product/${item.id}`} className="mx-auto sm:mx-0">
                                        <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-base-200">
                                            <ImageWithLoader
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </Link>

                                    {/* PRODUCT INFO */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xl font-bold text-primary mt-1">
                                            ${Number(item.price).toFixed(2)}
                                        </p>

                                        {/* QUANTITY & DELETE - Mobilda bir qatorda */}
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                                            <div className="flex items-center gap-2 bg-base-200 p-1 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="btn btn-xs btn-circle btn-ghost"
                                                >
                                                    <MinusIcon className="size-4" />
                                                </button>
                                                <span className="text-md font-bold w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="btn btn-xs btn-circle btn-ghost"
                                                >
                                                    <PlusIcon className="size-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="btn btn-sm btn-ghost text-error px-2"
                                            >
                                                <Trash2Icon className="size-4 mr-1" />
                                                <span className="hidden sm:inline">O'chirish</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* ITEM TOTAL - Mobilda ajratilgan */}
                                    <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                                        <p className="text-sm text-base-content/50 sm:hidden">Jami narxi:</p>
                                        <p className="text-xl font-black text-primary">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ORDER SUMMARY - Mobilda pastda, lekin ko'rinarli */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-xl border-2 border-primary/10 sticky top-24">
                        <div className="card-body p-6">
                            <h2 className="card-title text-xl mb-4">Buyurtma xulosasi</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-base-content/70">
                                    <span>Mahsulotlar soni</span>
                                    <span>{itemCount} ta</span>
                                </div>
                                <div className="flex justify-between text-base-content/70">
                                    <span>Yetkazib berish</span>
                                    <span className="text-success font-medium">Bepul</span>
                                </div>
                                <div className="divider my-1"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">Jami summa</span>
                                    <span className="text-2xl font-black text-primary">
                                        ${getTotalPrice().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout} // Link o'rniga onClick ishlatamiz
                                className="btn btn-primary w-full btn-lg shadow-lg shadow-primary/20"
                            >
                                To'lov sahifasiga o'tish
                            </button>

                            <div className="mt-4 flex flex-col gap-2">
                                <p className="text-[10px] text-center uppercase tracking-widest opacity-50">
                                    Xavfsiz to'lov tizimi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;