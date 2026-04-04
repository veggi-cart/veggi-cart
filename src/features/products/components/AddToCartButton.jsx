import { useState } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "../../cart/hooks/useCart";

const AddToCartButton = ({
  config,
  product,
  setShowConfigModal,
  compact = false,
  disabled = false,
}) => {
  const { addItem, updateQuantity, removeItem, getCartItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const cartItem = getCartItem(product._id, config?._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (isUpdating || disabled) return;
    if (product.priceConfigs?.length > 1 && !config?._id) {
      setShowConfigModal?.(true);
      return;
    }
    setIsUpdating(true);
    try {
      await addItem(product._id, config?._id, 1);
    } catch (err) {
      if (import.meta.env.DEV) console.error("Add error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (e, action) => {
    e.stopPropagation();
    if (isUpdating || !cartItem) return;
    setIsUpdating(true);
    try {
      if (action === "decrement" && quantity === 1) {
        await removeItem(cartItem._id);
      } else {
        await updateQuantity(cartItem._id, action);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error(`Error during ${action}:`, err);
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Compact: small pill overlaid on product image ──
  if (compact) {
    if (quantity === 0) {
      return (
        <button
          onClick={handleAdd}
          disabled={isUpdating || disabled}
          className="w-6 h-6 bg-white text-brand border border-brand text-[13px] font-extrabold rounded-md shadow-md active:scale-90 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isUpdating ? (
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
          ) : (
            "+"
          )}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-0.5 bg-brand rounded-md shadow-md h-6 px-0.5 relative">
        {isUpdating && (
          <div className="absolute inset-0 bg-brand/60 rounded-md flex items-center justify-center z-10">
            <Loader2 className="w-2.5 h-2.5 animate-spin text-white" />
          </div>
        )}
        <button
          onClick={(e) => handleUpdate(e, "decrement")}
          disabled={isUpdating}
          className="w-5 h-5 rounded bg-white flex items-center justify-center text-brand active:scale-90 transition-all"
        >
          <Minus className="w-2.5 h-2.5" strokeWidth={3} />
        </button>
        <span className="text-white font-bold text-[10px] w-4 text-center">
          {quantity}
        </span>
        <button
          onClick={(e) => handleUpdate(e, "increment")}
          disabled={isUpdating}
          className="w-5 h-5 rounded bg-white flex items-center justify-center text-brand active:scale-90 transition-all"
        >
          <Plus className="w-2.5 h-2.5" strokeWidth={3} />
        </button>
      </div>
    );
  }

  // ── Full-width: used in bottom sheets, detail pages ──
  if (quantity === 0) {
    return (
      <button
        onClick={handleAdd}
        disabled={isUpdating || disabled}
        className="w-full h-9 sm:h-10 flex items-center justify-center bg-brand text-white text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-sm"
      >
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Add"
        )}
      </button>
    );
  }

  return (
    <div className="w-full h-9 sm:h-10 flex items-center justify-between bg-brand rounded-xl p-1 shadow-sm relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-brand/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        </div>
      )}
      <button
        onClick={(e) => handleUpdate(e, "decrement")}
        disabled={isUpdating}
        className="h-full aspect-square rounded-lg bg-white flex items-center justify-center text-brand active:scale-90 transition-all"
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={3} />
      </button>
      <span className="text-white font-bold text-sm">{quantity}</span>
      <button
        onClick={(e) => handleUpdate(e, "increment")}
        disabled={isUpdating}
        className="h-full aspect-square rounded-lg bg-white flex items-center justify-center text-brand active:scale-90 transition-all"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
      </button>
    </div>
  );
};

export default AddToCartButton;
