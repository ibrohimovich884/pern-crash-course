const OrderSummary = ({ itemCount, totalPrice, onCheckout }) => (
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
                    <span className="text-2xl font-black text-primary">${totalPrice.toFixed(2)}</span>
                </div>
            </div>
            <button onClick={onCheckout} className="btn btn-primary w-full btn-lg shadow-lg shadow-primary/20">
                To'lov sahifasiga o'tish
            </button>
            <p className="text-[10px] text-center uppercase tracking-widest opacity-50 mt-4">Xavfsiz to'lov tizimi</p>
        </div>
    </div>
);

export default OrderSummary;