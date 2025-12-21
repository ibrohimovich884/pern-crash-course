import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBagIcon, ShoppingCartIcon, MenuIcon, LogOutIcon, UserIcon, ShieldCheckIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const { products } = useProductStore();
  const { isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="navbar min-h-[4rem] justify-between gap-2">
          
          {/* LEFT: LOGO */}
          <div className="flex-none lg:flex-1">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-7 sm:size-9 text-primary" />
                <span className="font-semibold font-mono tracking-tighter sm:tracking-widest text-lg sm:text-2xl 
                  bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  OybekMarket
                </span>
              </div>
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-1 sm:gap-4">
            <ThemeSelector />

            {/* PRODUCT COUNT (Faqat Home sahifada va tabletdan kattada ko'rinadi) */}
            {isHomePage && (
              <div className="indicator hidden md:inline-flex">
                <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingBagIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    {products.length}
                  </span>
                </div>
              </div>
            )}

            {/* CART ICON */}
            <Link to="/cart" className="indicator mr-2">
              <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
                <ShoppingCartIcon className="size-5" />
                {itemCount > 0 && (
                  <span className="badge badge-sm badge-primary indicator-item">
                    {itemCount}
                  </span>
                )}
              </button>
            </Link>

            {/* AUTH SECTION - Desktopda tugmalar, Mobilda Dropdown */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="btn btn-ghost btn-sm gap-2">
                    <ShieldCheckIcon className="size-4" />
                    Admin
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm gap-2">
                    <LogOutIcon className="size-4" />
                    Chiqish
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">
                  Kirish
                </Link>
              )}
            </div>

            {/* MOBIL MENU (Faqat kichik ekranlar uchun) */}
            <div className="dropdown dropdown-end sm:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <MenuIcon className="size-6" />
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-content/10">
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/admin"><ShieldCheckIcon className="size-4" /> Admin Panel</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-error">
                        <LogOutIcon className="size-4" /> Chiqish
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login"><UserIcon className="size-4" /> Kirish</Link>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;