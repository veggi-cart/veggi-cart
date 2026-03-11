import { PAYMENT_METHOD, PAYMENT_METHOD_CONFIG } from "../../../constants/order.constants";
import { useWallet } from "../../wallet/hooks/useWallet";

const PaymentMethodSelector = ({ selected, onChange, disabled = false, grandTotal = 0 }) => {
  const { balance } = useWallet();

  return (
    <div className="space-y-3">
      {Object.entries(PAYMENT_METHOD_CONFIG).map(([key, config]) => {
        const isWallet = key === PAYMENT_METHOD.WALLET;
        const canPayWithWallet = balance >= grandTotal;
        const isOptionDisabled = disabled || (isWallet && !canPayWithWallet);
        const isSelected = selected === key && !isOptionDisabled;

        const description = isWallet
          ? canPayWithWallet
            ? `Balance: ₹${balance.toFixed(0)}`
            : `Insufficient balance (₹${balance.toFixed(0)})`
          : config.description;

        return (
          <button
            key={key}
            type="button"
            disabled={isOptionDisabled}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-150
              ${
                isSelected
                  ? "border-brand bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }
              ${isOptionDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span className="text-2xl w-8 text-center flex-shrink-0 select-none">
              {config.icon}
            </span>

            <div className="flex-1 min-w-0">
              <span
                className={`font-semibold text-sm ${
                  isSelected ? "text-brand" : "text-slate-800"
                }`}
              >
                {config.label}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {description}
              </p>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                ${isSelected ? "border-brand" : "border-slate-300"}`}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-brand" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;
