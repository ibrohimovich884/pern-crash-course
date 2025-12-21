import { useState } from "react";
import { LockIcon, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function ChangePasswordModal() {
  const { changePassword, loading } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Yangi parollar mos kelmadi");
      return;
    }

    if (newPassword.length < 6) {
      alert("Yangi parol kamida 6 belgi bo'lishi kerak");
      return;
    }

    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      document.getElementById("change_password_modal").close();
    }
  };

  return (
    <dialog id="change_password_modal" className="modal">
      <div className="modal-box">
        {/* CLOSE BUTTON */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <X className="size-4" />
          </button>
        </form>

        {/* MODAL HEADER */}
        <h3 className="font-bold text-xl mb-6">Parolni o'zgartirish</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CURRENT PASSWORD */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Joriy parol</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <LockIcon className="size-5" />
              </div>
              <input
                type="password"
                placeholder="Joriy parolni kiriting"
                className="input input-bordered w-full pl-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Yangi parol</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <LockIcon className="size-5" />
              </div>
              <input
                type="password"
                placeholder="Yangi parol (kamida 6 belgi)"
                className="input input-bordered w-full pl-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base font-medium">Yangi parolni tasdiqlash</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                <LockIcon className="size-5" />
              </div>
              <input
                type="password"
                placeholder="Yangi parolni takrorlang"
                className="input input-bordered w-full pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          {/* MODAL ACTIONS */}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost" disabled={loading}>
                Bekor qilish
              </button>
            </form>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                loading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Parolni o'zgartirish"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default ChangePasswordModal;

