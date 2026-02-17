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

  // Constants to ensure both views are identical in size
  const containerStyles = compact ? "w-30 h-8 text-sm" : "w-38 h-10 text-base";

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
          className={`flex items-center justify-center bg-[#009661] text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-70 shadow-sm ${containerStyles}`}
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div
        className={`flex items-center justify-between bg-[#009661] relative rounded-xl p-1 shadow-sm transition-all ${containerStyles}`}
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

        {/* Quantity & Unit */}
        {/* <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-white font-bold tabular-nums">{quantity}</span>
          {config?.unit && (
            <span className="text-[9px] text-white uppercase font-bold tracking-tighter">
              {config.unit}
            </span>
          )}
        </div> */}

        <div>
          <span className="text-white text-xs font-medium">
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
