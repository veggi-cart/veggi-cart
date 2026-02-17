// ─────────────────────────────────────────────────────────────────────────────
// Order & Payment constants
// Keep every magic string here so the backend enums and frontend UI stay in sync
// ─────────────────────────────────────────────────────────────────────────────

// ── Order status ─────────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.CONFIRMED]: "Confirmed",
  [ORDER_STATUS.PROCESSING]: "Processing",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "Out for Delivery",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
  [ORDER_STATUS.REFUNDED]: "Refunded",
};

// Tailwind colour tokens per status (bg + text)
export const ORDER_STATUS_STYLE = {
  [ORDER_STATUS.PENDING]: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  [ORDER_STATUS.CONFIRMED]: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  [ORDER_STATUS.PROCESSING]: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-400",
  },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-400",
  },
  [ORDER_STATUS.DELIVERED]: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  [ORDER_STATUS.CANCELLED]: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  [ORDER_STATUS.REFUNDED]: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

// Steps shown in the order tracker (only active statuses)
export const ORDER_PROGRESS_STEPS = [
  { status: ORDER_STATUS.CONFIRMED, label: "Confirmed", icon: "✓" },
  { status: ORDER_STATUS.PROCESSING, label: "Processing", icon: "⚙" },
  { status: ORDER_STATUS.OUT_FOR_DELIVERY, label: "On the way", icon: "🛵" },
  { status: ORDER_STATUS.DELIVERED, label: "Delivered", icon: "🏠" },
];

// Statuses that allow cancellation (mirrors backend canCancel())
export const CANCELLABLE_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
];

// ── Payment status ────────────────────────────────────────────────────────────
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const PAYMENT_STATUS_LABEL = {
  [PAYMENT_STATUS.PENDING]: "Awaiting Payment",
  [PAYMENT_STATUS.PROCESSING]: "Processing",
  [PAYMENT_STATUS.SUCCESS]: "Paid",
  [PAYMENT_STATUS.FAILED]: "Failed",
  [PAYMENT_STATUS.REFUNDED]: "Refunded",
};

export const PAYMENT_STATUS_STYLE = {
  [PAYMENT_STATUS.PENDING]: { bg: "bg-amber-50", text: "text-amber-700" },
  [PAYMENT_STATUS.PROCESSING]: { bg: "bg-blue-50", text: "text-blue-700" },
  [PAYMENT_STATUS.SUCCESS]: { bg: "bg-emerald-50", text: "text-emerald-700" },
  [PAYMENT_STATUS.FAILED]: { bg: "bg-red-50", text: "text-red-600" },
  [PAYMENT_STATUS.REFUNDED]: { bg: "bg-slate-50", text: "text-slate-600" },
};

// ── Payment methods ───────────────────────────────────────────────────────────
export const PAYMENT_METHOD = {
  UPI: "upi",
  CARD: "card",
  NETBANKING: "netbanking",
  WALLET: "wallet",
  COD: "cod",
  EMI: "emi",
};

export const PAYMENT_METHOD_CONFIG = {
  [PAYMENT_METHOD.UPI]: {
    label: "UPI",
    description: "GPay, PhonePe, Paytm & more",
    icon: "📱",
    popular: true,
  },
  [PAYMENT_METHOD.CARD]: {
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Rupay",
    icon: "💳",
    popular: false,
  },
  [PAYMENT_METHOD.NETBANKING]: {
    label: "Net Banking",
    description: "All major banks supported",
    icon: "🏦",
    popular: false,
  },
  [PAYMENT_METHOD.WALLET]: {
    label: "Wallet",
    description: "Amazon Pay, Mobikwik & more",
    icon: "👛",
    popular: false,
  },
  [PAYMENT_METHOD.COD]: {
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: "💵",
    popular: false,
  },
  [PAYMENT_METHOD.EMI]: {
    label: "EMI",
    description: "No-cost EMI available",
    icon: "📅",
    popular: false,
  },
};

// ── Delivery ──────────────────────────────────────────────────────────────────
export const FREE_DELIVERY_THRESHOLD = 500; // ₹500 — mirrors backend logic
export const DELIVERY_CHARGE = 40;

// ── Polling ───────────────────────────────────────────────────────────────────
// How long to poll for payment confirmation before showing a manual retry
export const PAYMENT_POLL_INTERVAL_MS = 3000;
export const PAYMENT_POLL_MAX_ATTEMPTS = 20; // 60 s total

// ── Routes ────────────────────────────────────────────────────────────────────
export const ORDER_ROUTES = {
  CHECKOUT: "/checkout",
  PAYMENT_PROCESSING: "/payment/processing",
  ORDER_SUCCESS: "/order/success",
  ORDERS: "/orders",
  ORDER_DETAIL: (id = ":orderId") => `/orders/${id}`,
};
