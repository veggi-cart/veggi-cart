import { ShoppingCart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";

const CartBadge = ({ className = "", showLabel = true }) => {
  const { itemCount } = useCart();

  return (
    <Link
      to="/cart"
      className={`relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors ${className}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {showLabel && <span className="font-medium hidden sm:inline">Cart</span>}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;
