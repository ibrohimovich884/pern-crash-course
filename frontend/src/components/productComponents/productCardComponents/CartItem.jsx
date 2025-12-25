import { Link } from "react-router-dom";
import { Trash2Icon, PlusIcon, MinusIcon } from "lucide-react";
import ImageWithLoader from "../../ImageWithLoader";

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
    <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/product/${item.id}`} className="mx-auto sm:mx-0">
                    <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-base-200">
                        <ImageWithLoader src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                </Link>

                <div className="flex-1 text-center sm:text-left">
                    <Link to={`/product/${item.id}`}>
                        <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                    </Link>
                    <p className="text-xl font-bold text-primary mt-1">${Number(item.price).toFixed(2)}</p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                        <div className="flex items-center gap-2 bg-base-200 p-1 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn btn-xs btn-circle btn-ghost"><MinusIcon className="size-4" /></button>
                            <span className="text-md font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn btn-xs btn-circle btn-ghost"><PlusIcon className="size-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="btn btn-sm btn-ghost text-error px-2">
                            <Trash2Icon className="size-4 mr-1" /> <span className="hidden sm:inline">O'chirish</span>
                        </button>
                    </div>
                </div>

                <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <p className="text-sm text-base-content/50 sm:hidden">Jami:</p>
                    <p className="text-xl font-black text-primary">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        </div>
    </div>
);

export default CartItem;