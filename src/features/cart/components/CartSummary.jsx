import { useNavigate } from "react-router-dom";
import { ShoppingCart, Tag, TrendingDown, Wallet, Loader2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import {
  ORDER_ROUTES,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_CHARGE,
} from "../../../constants/order.constants";

const CartSummary = () => {
  const navigate = useNavigate();
  const { itemCount, totalMrp, totalAmount, totalSavings, loading } = useCart();

  const deliveryCharge =
    (totalAmount ?? 0) >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const grandTotal = (totalAmount ?? 0) + deliveryCharge;
  const amountToFree = FREE_DELIVERY_THRESHOLD - (totalAmount ?? 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-[#009661]" />
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        {/* Item Count */}
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Package className="w-4 h-4 text-slate-400" />
            Items in Cart
          </span>
          <span className="font-bold text-slate-900">{itemCount}</span>
        </div>

        {/* MRP Total */}
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Tag className="w-4 h-4 text-slate-400" />
            Price (MRP)
          </span>
          <span className="font-semibold line-through text-slate-400">
            ₹{(totalMrp ?? 0).toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {(totalSavings ?? 0) > 0 && (
          <div className="flex items-center justify-between text-[#009661] py-1">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <TrendingDown className="w-4 h-4" />
              Discount
            </span>
            <span className="font-bold">
              −₹{(totalSavings ?? 0).toFixed(2)}
            </span>
          </div>
        )}

        {/* Delivery charge */}
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-sm font-medium">Delivery</span>
          {deliveryCharge === 0 ? (
            <span className="font-bold text-[#009661] text-sm">FREE</span>
          ) : (
            <span className="font-semibold text-slate-700 text-sm">
              ₹{deliveryCharge.toFixed(2)}
            </span>
          )}
        </div>

        {/* Free delivery nudge */}
        {deliveryCharge > 0 && amountToFree > 0 && (
          <p className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 font-medium">
            Add ₹{amountToFree.toFixed(0)} more for free delivery
          </p>
        )}

        {/* Total */}
        <div className="border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-slate-400" />
              To Pay
            </span>
            <span className="text-2xl font-black text-slate-900">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Savings badge */}
        {(totalSavings ?? 0) > 0 && (
          <div className="bg-emerald-50 text-[#009661] rounded-lg p-3 border border-emerald-100 mt-4">
            <p className="text-xs font-bold flex items-center justify-center gap-1">
              <span className="text-base">🎉</span> You are saving ₹
              {(totalSavings ?? 0).toFixed(2)} on this order
            </p>
          </div>
        )}
      </div>

      {/* Checkout CTA */}
      <button
        onClick={() => navigate(ORDER_ROUTES.CHECKOUT)}
        disabled={loading || itemCount === 0}
        className="w-full py-4 px-6 bg-[#009661] text-white rounded-xl font-bold text-lg
          hover:bg-[#007d51] transition-all shadow-lg shadow-emerald-100
          active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Proceed to Checkout"
        )}
      </button>

      <p className="mt-4 text-[11px] text-slate-400 text-center font-medium">
        Secure SSL Encrypted Checkout
      </p>
    </div>
  );
};

// Inline SVG Package icon (same as original)
const Package = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

export default CartSummary;
