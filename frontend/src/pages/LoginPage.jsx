import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LockIcon, UserIcon } from "lucide-react";

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body space-y-6">
          <h2 className="card-title text-2xl justify-center mb-2">Admin Login</h2>
          <p className="text-sm text-base-content/70 text-center">
            Admin panelga kirish uchun foydalanuvchi nomi va parolni kiriting
          </p>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Foydalanuvchi nomi</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <UserIcon className="size-5" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Parol</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <LockIcon className="size-5" />
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Kirish"
              )}
            </button>
          </form>

          <div className="text-xs text-base-content/50 text-center">
            Default: username=admin, password=admin123
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


