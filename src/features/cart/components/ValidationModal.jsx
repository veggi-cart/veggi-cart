import {
  X,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from "lucide-react";

const ValidationModal = ({ validation, onClose, onProceed }) => {
  const { isValid, unavailableItems = [], priceChanges = [] } = validation;

  if (!validation) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div
          className={`p-6 border-b-2 ${isValid ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {isValid ? (
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {isValid ? "Cart Validated" : "Cart Validation Failed"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {isValid
                    ? "Your cart is ready for checkout"
                    : "Please review the issues below"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Unavailable Items */}
          {unavailableItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Unavailable Items ({unavailableItems.length})
              </h3>
              <div className="space-y-3">
                {unavailableItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border-2 border-red-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          {item.reason}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
                        Unavailable
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-3">
                These items will be removed from your cart automatically.
              </p>
            </div>
          )}

          {/* Price Changes */}
          {priceChanges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Price Changes ({priceChanges.length})
              </h3>
              <div className="space-y-3">
                {priceChanges.map((item, index) => {
                  const isIncrease = item.newPrice > item.oldPrice;
                  const difference = Math.abs(item.newPrice - item.oldPrice);
                  const percentChange = (
                    (difference / item.oldPrice) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-4 ${
                        isIncrease
                          ? "bg-orange-50 border-orange-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 mb-2">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-600">
                              Old: ₹{item.oldPrice.toFixed(2)}
                            </span>
                            {isIncrease ? (
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-green-600" />
                            )}
                            <span
                              className={
                                isIncrease
                                  ? "text-orange-700"
                                  : "text-green-700"
                              }
                            >
                              New: ₹{item.newPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            isIncrease
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isIncrease ? "+" : "-"}
                          {percentChange}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-slate-600 mt-3">
                Prices have been updated. Your total amount may change.
              </p>
            </div>
          )}

          {/* All Clear */}
          {isValid &&
            unavailableItems.length === 0 &&
            priceChanges.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Everything looks good!
                </h3>
                <p className="text-slate-600">
                  All items are available at current prices. You can proceed to
                  checkout.
                </p>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-slate-200 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-white transition-colors"
          >
            Cancel
          </button>
          {isValid && (
            <button
              onClick={onProceed}
              className="flex-1 py-3 px-6 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
