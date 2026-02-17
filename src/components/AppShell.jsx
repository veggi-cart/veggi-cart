import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Package,
  Menu,
  X,
  LogOut,
  ClipboardList,
} from "lucide-react";
import useAuth from "../features/auth/hooks/useAuth";
import { useCart } from "../features/cart/hooks/useCart";

const AppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/products", icon: Package, label: "Products" },
    { path: "/cart", icon: ShoppingCart, label: "Cart", badge: itemCount },
    { path: "/orders", icon: ClipboardList, label: "Orders" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/products" && location.pathname === "/") ||
    // Mark Orders active for /orders and /orders/:id
    (path === "/orders" && location.pathname.startsWith("/orders"));

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* ── Desktop Header ───────────────────────────────────────────────── */}
      <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#009661] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-2xl">🥬</span>
              </div>
              <span className="text-2xl font-black text-[#009661] tracking-tight">
                FreshMart
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                      active
                        ? "bg-emerald-50 text-[#009661]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${active ? "fill-[#009661]/20" : ""}`}
                    />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="ml-4 pl-4 border-l border-slate-200 flex items-center gap-4">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-slate-800">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Mobile Header ────────────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="px-4 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-[#009661]">FreshMart</span>
          </Link>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg text-slate-600"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {showMobileMenu && (
          <div className="absolute top-14 left-0 w-full bg-white border-b border-slate-200 p-4 animate-slide-down shadow-xl z-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#009661] text-white flex items-center justify-center font-bold text-lg">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-800">{user?.fullName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 font-bold w-full p-2"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        )}
      </header>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all ${
                  active ? "text-[#009661]" : "text-slate-400"
                }`}
              >
                <div className="relative mb-1">
                  <Icon
                    className={`w-6 h-6 transition-all duration-300 ${
                      active ? "scale-110 fill-[#009661]" : ""
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest font-bold ${
                    active ? "opacity-100" : "opacity-60"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default AppShell;
