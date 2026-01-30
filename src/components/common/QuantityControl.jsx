const QuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
  unitLabel = "",
  size = "default", // default, small, large
}) => {
  const sizeClasses = {
    small: "w-7 h-7 sm:w-9 sm:h-9",
    default: "w-8 h-8",
    large: "w-10 h-10",
  };

  const textSizeClasses = {
    small: "text-xs sm:text-sm",
    default: "text-sm",
    large: "text-base",
  };

  const buttonSize = sizeClasses[size] || sizeClasses.default;
  const textSize = textSizeClasses[size] || textSizeClasses.default;

  return (
    <div className="flex items-center bg-emerald-600 rounded-lg p-0.5 sm:p-1">
      <button
        onClick={onDecrease}
        className={`bg-white text-emerald-600 ${buttonSize} rounded-md font-bold hover:bg-gray-100 transition-colors text-base sm:text-lg`}
      >
        −
      </button>
      <div className="flex flex-col flex-1 items-center px-2 min-w-12">
        <span className={`text-white flex-1 font-semibold ${textSize}`}>
          {quantity}
        </span>
        {unitLabel && (
          <span className="text-white text-xs opacity-90">{unitLabel}</span>
        )}
      </div>
      <button
        onClick={onIncrease}
        className={`bg-white text-emerald-600 ${buttonSize} rounded-md font-bold hover:bg-gray-100 transition-colors text-base sm:text-lg`}
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
