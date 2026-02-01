import { useNavigate, useLocation } from "react-router-dom";
import useCartStore from "../../store/cartStore";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCartStore();

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const navItems = [
    {
      id: "products",
      label: "Shop",
      icon: "🛍️",
      path: "/",
      active: location.pathname === "/",
    },
    {
      id: "cart",
      label: "Cart",
      icon: "🛒",
      path: "/cart",
      active: location.pathname === "/cart",
      badge: getCartCount(),
    },
    {
      id: "orders",
      label: "Orders",
      icon: "📦",
      path: "/orders",
      active: location.pathname === "/orders",
    },
  ];

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-48 safe-area-pb">
        <div className="grid grid-cols-3 h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
                item.active
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-600 rounded-full" />
              )}

              <div className="relative">
                <span className="text-2xl">{item.icon}</span>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold min-w-4.5 h-4.5 rounded-full flex items-center justify-center px-1">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium ${
                  item.active ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Spacer for content - Mobile Only */}
      <div className="lg:hidden h-16" aria-hidden="true" />

      {/* Safe area for iOS devices */}
      <style jsx>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
};

export default BottomNavBar;
