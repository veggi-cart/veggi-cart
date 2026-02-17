import { ShoppingCart } from "lucide-react";
import { useCart } from "../../cart/hooks/useCart";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product, config }) => {
  const { cart } = useCart();

  const getQuantity = () => {
    if (!cart?.items) return 0;
    const cartItem = cart.items.find(
      (item) =>
        item.ingredient === product._id && item.priceConfigId === config._id,
    );
    return cartItem?.quantity || 0;
  };

  const quantity = getQuantity();

  const discount =
    config.mrp > config.price
      ? ((config.mrp - config.price) / config.mrp) * 100
      : 0;

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.name} ${config.displayLabel}`}
          className="w-full h-full object-cover"
        />

        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {discount.toFixed(0)}% OFF
          </div>
        )}

        {quantity > 0 && (
          <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            <span className="text-xs font-bold">{quantity}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {config.displayLabel}
          </span>
          {product.isVeg && (
            <span className="w-3 h-3 border border-green-600 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-emerald-700 font-bold">₹{config.price}</span>
          {config.mrp > config.price && (
            <span className="text-slate-400 line-through text-xs">
              ₹{config.mrp}
            </span>
          )}
        </div>

        {/* Pass the current quantity to the button */}
        <AddToCartButton
          config={config}
          product={product}
          quantity={quantity}
        />
      </div>
    </div>
  );
};

export default ProductCard;
