import QuantityControl from "../common/QuantityControl";

const ProductCard = ({
  product,
  cartItems = [],
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  formatUnit,
}) => {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative bg-gray-100 aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold ${
              product.isVeg
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {product.isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Price Display */}
        {totalQuantity > 0 ? (
          // Show price for selected config(s)
          <div className="mb-3 sm:mb-4 space-y-1">
            {product.priceConfigs.map((config, index) => {
              const cartItem = cartItems.find(
                (item) => item.priceConfigIndex === index,
              );
              if (!cartItem) return null;

              return (
                <div key={index} className="flex items-baseline gap-2">
                  <span className="text-lg sm:text-2xl font-bold text-gray-900">
                    ₹{config.price}
                  </span>
                  {config.mrp && config.mrp > config.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{config.mrp}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    / {formatUnit(config.unit, config.value)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : product.priceConfigs.length === 1 ? (
          // Single config, not selected
          <div className="flex items-baseline gap-1 sm:gap-2 mb-3 sm:mb-4">
            <span className="text-lg sm:text-2xl font-bold text-gray-900">
              ₹{product.priceConfigs[0].price}
            </span>
            {product.priceConfigs[0].mrp &&
              product.priceConfigs[0].mrp > product.priceConfigs[0].price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.priceConfigs[0].mrp}
                </span>
              )}
            <span className="text-sm text-gray-500">
              /{" "}
              {formatUnit(
                product.priceConfigs[0].unit,
                product.priceConfigs[0].value,
              )}
            </span>
          </div>
        ) : (
          // Multiple configs, not selected - show "onwards"
          <div className="flex items-baseline gap-1 sm:gap-2 mb-3 sm:mb-4">
            <span className="text-lg sm:text-2xl font-bold text-gray-900">
              ₹{product.priceConfigs[0].price}
            </span>
            <span className="text-xs text-gray-500 ml-1">onwards</span>
          </div>
        )}

        {/* Cart Controls */}
        {totalQuantity === 0 ? (
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <div className="space-y-2">
            {/* Show controls for each added config */}
            {product.priceConfigs.map((config, index) => {
              const cartItem = cartItems.find(
                (item) => item.priceConfigIndex === index,
              );
              if (!cartItem) return null;

              return (
                <QuantityControl
                  key={index}
                  quantity={cartItem.quantity}
                  unitLabel={formatUnit(config.unit, config.value)}
                  onIncrease={() => onIncreaseQuantity(product.id, index)}
                  onDecrease={() => onDecreaseQuantity(product.id, index)}
                  size="small"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
