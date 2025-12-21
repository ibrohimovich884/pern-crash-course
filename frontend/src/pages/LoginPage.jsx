import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LockIcon, UserIcon, LogInIcon } from "lucide-react";

function LoginPage() {
  const { isAuthenticated, login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    // min-h-screen o'rniga dinamik balandlik, mobilda padding-top qo'shildi
    <div className="min-h-[calc(100vh-4rem)] flex items-start sm:items-center justify-center px-4 py-8 sm:py-0 bg-base-200/30">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/5">
        <div className="card-body p-6 sm:p-8 space-y-6">
          
          {/* HEADER SECTION */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-2">
              <LogInIcon className="size-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Login</h2>
            <p className="text-sm text-base-content/60">
              Panelga kirish uchun ma'lumotlarni kiriting
            </p>
          </div>

          {error && (
            <div className="alert alert-error shadow-sm py-3 text-sm animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* USERNAME FIELD */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">Foydalanuvchi nomi</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                  <UserIcon className="size-5" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-12 bg-base-200/50 focus:bg-base-100 transition-all border-base-content/10"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">Parol</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary transition-colors">
                  <LockIcon className="size-5" />
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full pl-12 bg-base-200/50 focus:bg-base-100 transition-all border-base-content/10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary w-full btn-md sm:btn-lg shadow-lg shadow-primary/20 mt-2"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Tizimga kirish"
              )}
            </button>
          </form>

          {/* HINT FOR ADMIN */}
          <div className="pt-4 border-t border-base-content/5">
            <div className="bg-base-200/50 rounded-lg p-3 text-[11px] sm:text-xs text-base-content/50 text-center italic">
              Eslatma: Bu bo'lim faqat do'kon administratorlari uchun mo'ljallangan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;