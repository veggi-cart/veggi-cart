import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
} from "../../../constants/order.constants";

/**
 * Small pill badge showing order or payment status.
 * size: "sm" | "md"
 */
const OrderStatusBadge = ({ status, size = "md" }) => {
  const style = ORDER_STATUS_STYLE[status] || {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };
  const label = ORDER_STATUS_LABEL[status] || status;

  const padding =
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide
        ${style.bg} ${style.text} ${style.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
};

export default OrderStatusBadge;
