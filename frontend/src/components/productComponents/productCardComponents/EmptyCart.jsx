import { Link } from "react-router-dom";
import { ArrowLeftIcon, ShoppingCartIcon } from "lucide-react";

const EmptyCart = () => (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/" className="btn btn-ghost mb-8">
            <ArrowLeftIcon className="size-4 mr-2" /> Bosh sahifaga qaytish
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
                <Link to="/" className="btn btn-primary mt-4">Xarid qilishni boshlash</Link>
            </div>
        </div>
    </div>
);

export default EmptyCart;