import { DollarSignIcon, ImageIcon, Package2Icon, PlusCircleIcon, AlignLeft, LayersIcon } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";

function AddProductModal() {
  const { addProduct, formData, setFormData, loading } = useProductStore();

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box max-w-2xl">
        {/* CLOSE BUTTON (X) */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 className="font-bold text-xl mb-8">Add New Product</h3>

        {/* ASOSIY FORM */}
        <form onSubmit={addProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* PRODUCT NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Product Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Package2Icon className="size-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="iPhone 15 Pro"
                  className="input input-bordered w-full pl-10 focus:input-primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* PRODUCT PRICE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Price</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <DollarSignIcon className="size-5" />
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="12000000"
                  className="input input-bordered w-full pl-10 focus:input-primary"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            {/* STOCK QUANTITY */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Stock Quantity</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <LayersIcon className="size-5" />
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="10"
                  className="input input-bordered w-full pl-10 focus:input-primary"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            {/* IMAGE URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Image URL</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <ImageIcon className="size-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://images.com/iphone.jpg"
                  className="input input-bordered w-full pl-10 focus:input-primary"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Description</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-base-content/50">
                <AlignLeft className="size-5" />
              </div>
              <textarea
                required
                placeholder="Write product details here..."
                className="textarea textarea-bordered w-full pl-10 h-24 focus:textarea-primary"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* MODAL ACTIONS */}
          <div className="modal-action">
            {/* Cancel tugmasi type="button" bo'lishi shart, aks holda formani submit qilib yuboradi */}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => document.getElementById("add_product_modal").close()}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary min-w-[140px]"
              disabled={loading || !formData.name || !formData.price || !formData.stock || !formData.image || !formData.description}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="size-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL BACKDROP (Fon bosilganda yopilishi uchun) */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AddProductModal;