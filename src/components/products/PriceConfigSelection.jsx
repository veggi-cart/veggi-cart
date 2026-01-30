const PriceConfigSelector = ({
  product,
  cartItems = [],
  onClose,
  onSelectConfig,
  formatUnit,
}) => {
  if (!product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50  z-60 animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-70 bg-white rounded-t-2xl shadow-2xl animate-slide-up max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-12 h-12 object-contain bg-gray-100 rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">Select a pack size</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {product.priceConfigs.map((config, index) => {
            const cartItem = cartItems.find(
              (item) => item.priceConfigIndex === index,
            );
            const isAdded = !!cartItem;

            return (
              <div
                key={index}
                className={`border-2 rounded-xl p-4 transition-all ${
                  isAdded
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{config.price}
                      </span>
                      {config.mrp && config.mrp > config.price && (
                        <span className="text-base text-gray-400 line-through">
                          ₹{config.mrp}
                        </span>
                      )}
                      <span className="text-gray-500">
                        / {formatUnit(config.unit, config.value)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {config.value} {config.unit}
                      {config.value > 1 &&
                      config.unit !== "kg" &&
                      config.unit !== "litre"
                        ? "s"
                        : ""}
                    </p>
                    {config.mrp && config.mrp > config.price && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Save ₹{config.mrp - config.price}
                      </p>
                    )}
                  </div>

                  {isAdded ? (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-medium text-sm">
                        ✓ Added
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectConfig(config, index)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default PriceConfigSelector;
