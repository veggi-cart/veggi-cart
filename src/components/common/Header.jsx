import { Link } from "react-router-dom";

const Header = ({
  showBackButton = false,
  showCartButton = false,
  showUserButton = false,
  cartCount = 0,
  userName = "User",
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center ">
            {showBackButton && (
              <Link to="/">
                {/* <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"> */}
                <svg
                  className="w-6 h-6"
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
                {/* <span className="hidden sm:inline">
                  {showCartButton ? "Continue Shopping" : "Back to Shop"}
                </span> */}
                {/* <span className="sm:hidden">Back</span> */}
                {/* </button> */}
              </Link>
            )}
            <Link to="/" className="flex items-center gap-3">
              <span className="text-3xl">🥬</span>
              <h1 className="text-2xl font-bold text-gray-900">Veggie-Cart</h1>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Back Button */}
            {/* {showBackButton && (
              <Link to="/">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
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
                  <span className="hidden sm:inline">
                    {showCartButton ? "Continue Shopping" : "Back to Shop"}
                  </span>
                  <span className="sm:hidden">Back</span>
                </button>
              </Link>
            )} */}

            {/* User Profile Button */}
            {showUserButton && (
              <Link to="/user-details">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {userName}
                  </span>
                </button>
              </Link>
            )}

            {/* Cart Button */}
            {showCartButton && (
              <Link to="/cart">
                <button className="relative bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
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
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
