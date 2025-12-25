import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { TruckIcon, StoreIcon, MapPinIcon, PhoneIcon, CheckCircleIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function CheckoutPage() {
    const { cart, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [method, setMethod] = useState("delivery"); // 'delivery' yoki 'pickup'
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // CheckoutPage.jsx ichidagi handleSubmit funksiyasini yangilang:
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("posgrestore-auth-token");

            const orderData = {
                items: cart,
                totalPrice: getTotalPrice(),
                deliveryMethod: method,
                phoneNumber: phone,
                address: method === "delivery" ? address : "Pickup",
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Buyurtmangiz qabul qilindi! Tez orada bog'lanamiz.");
                clearCart();
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Buyurtmani rasmiylashtirish</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CHAP TOMON: FORMA */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CheckCircleIcon className="text-primary" /> Yetkazib berish usuli
                            </h2>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setMethod("delivery")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === "delivery" ? "border-primary bg-primary/5" : "border-base-200 opacity-60"
                                        }`}
                                >
                                    <TruckIcon className="size-8 mb-2" />
                                    <span className="font-semibold">Kuryer</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMethod("pickup")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === "pickup" ? "border-primary bg-primary/5" : "border-base-200 opacity-60"
                                        }`}
                                >
                                    <StoreIcon className="size-8 mb-2" />
                                    <span className="font-semibold">Olib ketish</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Telefon raqamingiz</span>
                                    </label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-3 size-5 opacity-40" />
                                        <input
                                            type="tel"
                                            placeholder="+998 90 123 45 67"
                                            className="input input-bordered w-full pl-10"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {method === "delivery" && (
                                    <div className="form-control animate-in fade-in slide-in-from-top-2">
                                        <label className="label">
                                            <span className="label-text font-semibold">To'liq manzil</span>
                                        </label>
                                        <div className="relative">
                                            <MapPinIcon className="absolute left-3 top-3 size-5 opacity-40" />
                                            <textarea
                                                placeholder="Viloyat, tuman, ko'cha, uy raqami..."
                                                className="textarea textarea-bordered w-full pl-10 h-24"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {method === "pickup" && (
                                    <div className="p-4 bg-base-200 rounded-lg text-sm animate-in fade-in">
                                        <p className="font-bold flex items-center gap-2 mb-1">
                                            <MapPinIcon className="size-4 text-primary" /> Bizning manzil:
                                        </p>
                                        <p className="opacity-70">Toshkent v., Yangiyo'l tumani, Uzumzor ko'chasi 160-uy.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full btn-lg shadow-lg"
                    >
                        {isSubmitting ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
                    </button>
                </form>

                {/* O'NG TOMON: BUYURTMA XULOSASI */}
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-200 sticky top-24">
                        <div className="card-body p-6">
                            <h2 className="text-xl font-bold mb-4">Sizning xaridingiz</h2>
                            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 mb-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-12 h-12 rounded bg-base-200 overflow-hidden shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                                            <p className="text-xs opacity-60">{item.quantity} x ${item.price}</p>
                                        </div>
                                        <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="divider"></div>
                            <div className="flex justify-between items-center text-lg font-black">
                                <span>Jami:</span>
                                <span className="text-primary text-2xl">${getTotalPrice().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;