import QuantityControl from "../common/QuantityControl";

const CartItemGroup = ({
  product,
  items,
  onIncrease,
  onDecrease,
  onRemove,
  formatUnit,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Product Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 object-contain bg-white rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
              product.isVeg
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>
      </div>

      {/* Each Configuration */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={`${item.id}-${item.priceConfigIndex}`} className="p-4">
            <div className="flex items-center gap-4">
              {/* Price and Unit Info */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{item.selectedPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    / {item.selectedUnit}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Subtotal:{" "}
                  <span className="font-semibold text-gray-900">
                    ₹{(item.selectedPrice * item.quantity).toFixed(2)}
                  </span>
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <QuantityControl
                  quantity={item.quantity}
                  onIncrease={() => onIncrease(item.id, item.priceConfigIndex)}
                  onDecrease={() => onDecrease(item.id, item.priceConfigIndex)}
                  size="default"
                />

                {/* Remove Button */}
                <button
                  onClick={() => onRemove(item.id, item.priceConfigIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove item"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItemGroup;
