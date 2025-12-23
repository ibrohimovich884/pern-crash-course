import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LockIcon, MailIcon, LogInIcon } from "lucide-react";

function LoginPage() {
  const { isAuthenticated, login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(""); // username emas, email
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password); // email yuboriladi
    if (result.success) {
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start sm:items-center justify-center px-4 py-8 bg-base-200/30">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-content/5">
        <div className="card-body p-6 sm:p-8 space-y-6">

          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-2">
              <LogInIcon className="size-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Kirish yoki Ro'yxatdan o'tish</h2>
            <p className="text-sm text-base-content/60">
              Gmail manzilingizni kiriting. Agar akkountingiz bo'lmasa, yangisi yaratiladi.
            </p>
          </div>

          {error && (
            <div className="alert alert-error shadow-sm py-3 text-sm animate-shake">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">Gmail manzilingiz</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary">
                  <MailIcon className="size-5" />
                </div>
                <input
                  type="email" // Type email qilindi
                  className="input input-bordered w-full pl-12 bg-base-200/50 focus:bg-base-100 transition-all"
                  placeholder="misol@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/70">Parol</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-primary">
                  <LockIcon className="size-5" />
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full pl-12 bg-base-200/50 focus:bg-base-100 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-md shadow-lg"
              disabled={loading || !email || !password}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Tizimga kirish"}
            </button>
          </form>

          {/* GOOGLE LOGIN OPTION (Ixtiyoriy) */}
          <div className="divider text-xs text-base-content/40 uppercase">Yoki</div>

          <button className="btn btn-outline w-full flex items-center gap-2">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="google" />
            Google orqali kirish
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;