import { useEffect, useState } from "react";
import axios from "axios";
import { PackageIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("posgrestore-auth-token");
            const res = await axios.get(`${BASE_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.data);
        } catch (error) {
            toast.error("Buyurtmalarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("posgrestore-auth-token");
            await axios.patch(`${BASE_URL}/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Status o'zgardi");
            fetchOrders(); // Ro'yxatni yangilash
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    if (loading) return <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <PackageIcon className="size-8 text-primary" /> Buyurtmalar boshqaruvi
            </h1>

            <div className="grid gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                        <div className="card-body p-0">
                            {/* CARD HEADER */}
                            <div className="bg-base-200/50 p-4 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <span className="text-xs font-bold opacity-50 block uppercase">Buyurtma ID</span>
                                    <span className="font-mono text-lg">#ORD-{order.id}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`badge badge-md py-3 px-4 font-bold ${order.status === 'pending' ? 'badge-warning' :
                                            order.status === 'delivered' ? 'badge-success text-white' :
                                                order.status === 'cancelled' ? 'badge-error text-white' : 'badge-info text-white'
                                        }`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                    <span className="text-sm opacity-60 flex items-center gap-1">
                                        <ClockIcon className="size-4" /> {new Date(order.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* 1. Mijoz ma'lumotlari */}
                                <div className="space-y-3">
                                    <h3 className="font-bold border-b pb-2">Mijoz va Yetkazib berish</h3>
                                    <div className="flex items-center gap-2"><PhoneIcon className="size-4 opacity-50" /> <span className="font-semibold">{order.phone_number}</span></div>
                                    <div className="flex items-start gap-2"><MapPinIcon className="size-4 opacity-50 mt-1" /> <span className="text-sm">{order.address}</span></div>
                                    <div className="badge badge-outline">{order.delivery_method === 'delivery' ? 'Kuryer' : 'Olib ketish'}</div>
                                </div>

                                {/* 2. Mahsulotlar */}
                                <div className="space-y-3">
                                    <h3 className="font-bold border-b pb-2">Mahsulotlar</h3>
                                    <div className="max-h-40 overflow-y-auto space-y-2">
                                        {JSON.parse(JSON.stringify(order.items)).map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm bg-base-200/30 p-2 rounded">
                                                <span>{item.name} <b className="text-primary">x{item.quantity}</b></span>
                                                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center pt-2 font-black text-xl text-primary">
                                        <span>Jami:</span>
                                        <span>${Number(order.total_price).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* 3. Amallar */}
                                <div className="space-y-3">
                                    <h3 className="font-bold border-b pb-2">Holatni o'zgartirish</h3>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handleStatusUpdate(order.id, 'processing')} className="btn btn-sm btn-outline btn-info">Jarayonda</button>
                                        <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="btn btn-sm btn-success text-white"><CheckCircle2Icon className="size-4 mr-1" /> Yakunlash</button>
                                        <button onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="btn btn-sm btn-error text-white"><XCircleIcon className="size-4 mr-1" /> Bekor qilish</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminOrdersPage;