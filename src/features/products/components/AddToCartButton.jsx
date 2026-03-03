import { useState } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "../../cart/hooks/useCart";

const AddToCartButton = ({
  config,
  product,
  setShowConfigModal,
  compact = false,
}) => {
  const { addItem, updateQuantity, getCartItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const cartItem = getCartItem(product._id, config?._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const heightClass = compact ? "h-8" : "h-10";
  const textClass = compact ? "text-xs" : "text-sm";

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (isUpdating) return;
    if (product.priceConfigs?.length > 1 && !config?._id) {
      setShowConfigModal(true);
      return;
    }
    setIsUpdating(true);
    try {
      await addItem(product._id, config?._id, 1);
    } catch (error) {
      console.error("Add error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (e, action) => {
    e.stopPropagation();
    if (isUpdating || !cartItem) return;
    setIsUpdating(true);
    try {
      await updateQuantity(cartItem._id, action);
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (quantity === 0) {
    return (
      <div className="w-full flex justify-center">
        <button
          onClick={handleAdd}
          disabled={isUpdating}
          className={`w-full flex items-center justify-center bg-[#009661] text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-70 shadow-sm ${heightClass} ${textClass}`}
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div
        className={`w-full flex items-center justify-between bg-[#009661] relative rounded-xl p-1 shadow-sm transition-all ${heightClass}`}
      >
        {isUpdating && (
          <div className="absolute inset-0 bg-[#009661]/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          </div>
        )}

        {/* Minus Button */}
        <button
          onClick={(e) => handleUpdate(e, "decrement")}
          disabled={isUpdating}
          className="h-full aspect-square rounded-lg bg-white flex items-center justify-center text-[#009661] active:scale-90 transition-all"
        >
          <Minus className="w-4 h-4" strokeWidth={3} />
        </button>

        <div>
          <span className={`text-white font-medium ${textClass}`}>
            {quantity + " x " + config?.displayLabel}
          </span>
        </div>

        {/* Plus Button */}
        <button
          onClick={(e) => handleUpdate(e, "increment")}
          disabled={isUpdating}
          className="h-full aspect-square rounded-lg bg-white flex items-center justify-center text-[#009661] active:scale-90 transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default AddToCartButton;
