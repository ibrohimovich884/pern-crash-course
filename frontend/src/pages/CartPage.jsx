import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";

// Yangi komponentlarni import qilamiz
import EmptyCart from "../components/productComponents/productCardComponents/EmptyCart";
import CartItem from "../components/productComponents/productCardComponents/CartItem";
import OrderSummary from "../components/productComponents/productCardComponents/OrderSummary";

function CartPage() {
    const { cart, itemCount, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate("/checkout");
        } else {
            navigate("/login", { state: { from: { pathname: "/checkout" } } });
        }
    };

    if (itemCount === 0) return <EmptyCart />;

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <Link to="/" className="btn btn-ghost btn-sm sm:btn-md">
                    <ArrowLeftIcon className="size-4 mr-2" /> Bosh sahifa
                </Link>
                <button onClick={clearCart} className="btn btn-error btn-outline btn-xs sm:btn-sm">
                    <Trash2Icon className="size-4 mr-2" /> Savatni tozalash
                </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-8">Savat ({itemCount} ta)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <CartItem 
                            key={item.id} 
                            item={item} 
                            updateQuantity={updateQuantity} 
                            removeFromCart={removeFromCart} 
                        />
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <OrderSummary 
                        itemCount={itemCount} 
                        totalPrice={getTotalPrice()} 
                        onCheckout={handleCheckout} 
                    />
                </div>
            </div>
        </div>
    );
}

export default CartPage;