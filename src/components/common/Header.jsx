import { useNavigate } from "react-router-dom";

const Header = ({
  showBackButton = false,
  showCartButton = false,
  showUserButton = false,
  cartCount = 0,
  userName = "User",
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Logo */}
            <h1
              onClick={() => navigate("/")}
              className="text-2xl font-black text-emerald-700 cursor-pointer hover:text-emerald-800 transition-colors"
            >
              VEGGIE-CART
            </h1>
          </div>

          {/* Desktop Navigation - Hidden on Mobile */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
            >
              🛍️ Shop
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="px-4 py-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
            >
              📦 Orders
            </button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* User Button - Desktop Only */}
            {showUserButton && (
              <button
                onClick={() => navigate("/user-details")}
                className="hidden lg:flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">{userName}</span>
              </button>
            )}

            {/* Cart Button - Desktop Only */}
            {showCartButton && (
              <button
                onClick={() => navigate("/cart")}
                className="hidden lg:flex relative p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Shopping cart"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1.5">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Icon - Mobile Only */}
            {showUserButton && (
              <button
                onClick={() => navigate("/user-details")}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="User profile"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
