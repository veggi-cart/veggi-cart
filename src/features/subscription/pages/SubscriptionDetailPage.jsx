import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Pause,
  Play,
  X,
  Plus,
  Minus,
  SkipForward,
  Undo2,
  Loader2,
  CalendarDays,
  Truck,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MoreVertical,
  RefreshCw,
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Info,
} from "lucide-react";
import { useSubscription } from "../hooks/useSubscription";
import subscriptionAPI from "../../../api/endpoints/subscription.api";

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  active: {
    bg: "bg-emerald-50",
    text: "text-brand",
    dot: "bg-brand",
    label: "ACTIVE",
  },
  paused: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
    label: "PAUSED",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-500",
    label: "CANCELLED",
  },
  completed: {
    bg: "bg-slate-50",
    text: "text-slate-500",
    dot: "bg-slate-400",
    label: "COMPLETED",
  },
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]}, ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
};

const formatDateTime = (dateStr) => {
  const d = new Date(dateStr);
  const h =
    d.getHours() > 12
      ? d.getHours() - 12
      : d.getHours() === 0
        ? 12
        : d.getHours();
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${h}:${String(d.getMinutes()).padStart(2, "0")} ${ampm}`;
};

const isFutureDate = (dateStr) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(dateStr);
  return d > today;
};

const getMonthLabel = (month, year) => `${MONTHS[month]} ${year}`;

const dayStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return { dot: "bg-brand", text: "text-brand", bg: "bg-emerald-50" };
    case "skipped":
      return { dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" };
    case "active":
      return { dot: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50" };
    case "packed":
      return {
        dot: "bg-indigo-500",
        text: "text-indigo-600",
        bg: "bg-indigo-50",
      };
    case "out_for_delivery":
      return {
        dot: "bg-violet-500",
        text: "text-violet-600",
        bg: "bg-violet-50",
      };
    default:
      return { dot: "bg-slate-400", text: "text-slate-500", bg: "bg-slate-50" };
  }
};

// ── Main Component ───────────────────────────────────────────────────────────

const SubscriptionDetailPage = () => {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();
  const {
    subscriptions,
    loading,
    fetchSubscriptions,
    fetchSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    skipDate,
    undoSkip,
    addExtra,
  } = useSubscription();

  const [menuOpen, setMenuOpen] = useState(false);
  const [pastExpanded, setPastExpanded] = useState(false);
  const [detailedView, setDetailedView] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [dayModal, setDayModal] = useState(null); // timeline day for action sheet
  const [skipModal, setSkipModal] = useState(false);
  const [skipSelectedDate, setSkipSelectedDate] = useState(null);
  const [skipSelectedItems, setSkipSelectedItems] = useState(new Set());
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Add Extra state
  const [addExtraDate, setAddExtraDate] = useState(null); // date string for add-extra modal
  const [subProducts, setSubProducts] = useState([]);
  const [subProductsLoaded, setSubProductsLoaded] = useState(false);

  useEffect(() => {
    if (subscriptions.length === 0) fetchSubscriptions();
  }, [subscriptions.length, fetchSubscriptions]);

  const sub = subscriptions.find((s) => s._id === subscriptionId);

  // If not in list, try fetching the single subscription
  useEffect(() => {
    if (!sub && !loading && subscriptions.length > 0) {
      fetchSubscription(subscriptionId);
    }
  }, [sub, loading, subscriptions.length, subscriptionId, fetchSubscription]);

  // Fetch subscription products when add-extra modal opens
  useEffect(() => {
    if (addExtraDate && !subProductsLoaded) {
      subscriptionAPI.getSubscriptionProducts().then((res) => {
        if (res.success) setSubProducts(res.data || []);
        setSubProductsLoaded(true);
      });
    }
  }, [addExtraDate, subProductsLoaded]);

  const handleAddExtra = async (date, productId, priceConfigId, qty) => {
    setActionLoading(true);
    await addExtra(sub._id, date, productId, priceConfigId, qty);
    setActionLoading(false);
    setAddExtraDate(null);
  };

  // ── Derived data ───────────────────────────────────────────────────────────

  const timeline = sub?.timeline || [];
  const deliveredCount = timeline.filter(
    (d) => d.status === "delivered",
  ).length;
  const skippedCount = timeline.filter((d) => d.status === "skipped").length;
  const activeCount = timeline.filter((d) => d.status === "active").length;
  const totalDays = sub?.totalDays || 0;
  const progress =
    totalDays > 0 ? ((deliveredCount + skippedCount) / totalDays) * 100 : 0;

  // Split timeline into upcoming/past
  const upcoming = timeline.filter(
    (d) => d.status !== "delivered" && d.status !== "skipped",
  );
  const past = [
    ...timeline.filter(
      (d) => d.status === "delivered" || d.status === "skipped",
    ),
  ].sort((a, b) => b.date.localeCompare(a.date));

  // Next active day (today or future)
  const nextActiveDay = (() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (const day of timeline) {
      if (day.status !== "active") continue;
      const d = new Date(day.date);
      if (d >= today) return day;
    }
    return null;
  })();

  // Upcoming dates for skip modal (future active days only)
  const skippableDates = timeline.filter((d) => {
    if (d.status !== "active") return false;
    return isFutureDate(d.date);
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handlePause = async () => {
    setMenuOpen(false);
    setActionLoading(true);
    await pauseSubscription(sub._id);
    setActionLoading(false);
  };

  const handleResume = async () => {
    setMenuOpen(false);
    setActionLoading(true);
    await resumeSubscription(sub._id);
    setActionLoading(false);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setActionLoading(true);
    await cancelSubscription(sub._id, cancelReason.trim());
    setActionLoading(false);
    setCancelModal(false);
    setCancelReason("");
  };

  const openSkipModal = () => {
    setSkipSelectedDate(null);
    setSkipSelectedItems(new Set());
    setSkipModal(true);
  };

  const selectSkipDate = (dd) => {
    const activeItems = dd.items?.filter((i) => !i.isSkipped) || [];
    setSkipSelectedDate(dd);
    setSkipSelectedItems(new Set(activeItems.map((i) => i._id)));
  };

  const toggleSkipItem = (itemId) => {
    setSkipSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });
  };

  const handleSkipConfirm = async () => {
    if (!skipSelectedDate || skipSelectedItems.size === 0) return;
    const allActiveItems =
      skipSelectedDate.items?.filter((i) => !i.isSkipped) || [];
    const allSelected = skipSelectedItems.size === allActiveItems.length;
    setActionLoading(true);
    await skipDate(
      sub._id,
      skipSelectedDate.date.split("T")[0],
      allSelected ? [] : [...skipSelectedItems],
    );
    setActionLoading(false);
    setSkipModal(false);
  };

  const handleUndoSkip = async (day, itemIds = []) => {
    setActionLoading(true);
    await undoSkip(sub._id, day.date.split("T")[0], itemIds);
    setActionLoading(false);
    setDayModal(null);
  };

  const handleSkipFromDay = async (day, itemIds = []) => {
    setActionLoading(true);
    await skipDate(sub._id, day.date.split("T")[0], itemIds);
    setActionLoading(false);
    setDayModal(null);
  };

  // ── Loading / Not found ────────────────────────────────────────────────────

  if (loading && !sub) {
    return (
      <Page>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      </Page>
    );
  }

  if (!sub) {
    return (
      <Page>
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <p className="text-slate-500 font-medium">Subscription not found</p>
          <button
            onClick={() => navigate("/subscriptions")}
            className="mt-4 px-6 py-2.5 bg-brand text-white rounded-xl font-semibold text-sm"
          >
            Back to Subscriptions
          </button>
        </div>
      </Page>
    );
  }

  const status = STATUS_STYLES[sub.status] || STATUS_STYLES.active;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Page>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/subscriptions")}
          className="p-2 rounded-xl hover:bg-white/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900 flex-1">
          {getMonthLabel(sub.month, sub.year)}
        </h1>
        {/* Menu */}
        {["active", "paused"].includes(sub.status) && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-xl hover:bg-white/80 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-slate-200 py-1 min-w-45">
                  {sub.status === "active" && (
                    <button
                      onClick={handlePause}
                      disabled={actionLoading}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" /> Pause Subscription
                    </button>
                  )}
                  {sub.status === "paused" && (
                    <button
                      onClick={handleResume}
                      disabled={actionLoading}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" /> Resume Subscription
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setCancelModal(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel Subscription
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Header Card ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        {/* Status + ID */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <span className="text-xs text-slate-400 font-medium uppercase">
            {sub._id}
          </span>
        </div>

        {/* Big price + circular progress */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-extrabold text-slate-900 leading-none">
              ₹{sub.total?.toFixed(0)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {totalDays} days &bull; {activeCount} remaining
            </p>
          </div>
          {/* Circular progress */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="5"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 150.8} 150.8`}
                className={status.text}
              />
            </svg>
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${status.text}`}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-evenly">
          <StatItem
            value={deliveredCount}
            label="Delivered"
            color="text-brand"
          />
          <div className="w-px h-8 bg-slate-200" />
          <StatItem
            value={skippedCount}
            label="Skipped"
            color="text-amber-500"
          />
          <div className="w-px h-8 bg-slate-200" />
          <StatItem
            value={activeCount}
            label="Upcoming"
            color="text-blue-500"
          />
        </div>

        {/* Wallet hold breakdown */}
        {sub.walletHold && (
          <div className="mt-4 border border-slate-100 rounded-xl p-3 space-y-1.5">
            <WalletRow
              label="Total Paid"
              value={`₹${sub.total?.toFixed(0)}`}
              color="text-slate-800"
            />
            <WalletRow
              label="Consumed (delivered)"
              value={`₹${sub.walletHold.amountConsumed?.toFixed(0)}`}
              color="text-brand"
            />
            <WalletRow
              label="Held (upcoming)"
              value={`₹${sub.walletHold.amountHeld?.toFixed(0)}`}
              color="text-blue-500"
            />
            {(() => {
              const refunded =
                sub.total -
                (sub.walletHold.amountHeld || 0) -
                (sub.walletHold.amountConsumed || 0);
              return refunded > 0.5 ? (
                <WalletRow
                  label="Refunded (skips)"
                  value={`₹${refunded.toFixed(0)}`}
                  color="text-amber-500"
                />
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* ── Next Delivery Card ──────────────────────────────────────────────── */}
      {nextActiveDay && sub.status === "active" && (
        <NextDeliveryCard
          day={nextActiveDay}
          onTap={() => setDayModal(nextActiveDay)}
          onSkip={() => {
            selectSkipDate(nextActiveDay);
            setSkipModal(true);
          }}
          onAddExtra={() => setAddExtraDate(nextActiveDay.date.split("T")[0])}
        />
      )}

      {/* ── Status Banners ──────────────────────────────────────────────────── */}
      {sub.status === "cancelled" && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 mb-4">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-600 font-medium">
            Cancelled
            {sub.cancellationReason ? `: ${sub.cancellationReason}` : ""}
          </p>
        </div>
      )}
      {sub.status === "completed" && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-4">
          <CheckCircle2 className="w-5 h-5 text-brand shrink-0" />
          <p className="text-sm text-brand font-medium">
            All deliveries completed!
          </p>
        </div>
      )}

      {/* Renew button */}
      {["completed", "cancelled"].includes(sub.status) && (
        <button
          onClick={() => navigate("/subscriptions/new")}
          className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-emerald-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Renew Subscription
        </button>
      )}

      {/* ── Timeline ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-black text-slate-900 text-sm flex-1">Timeline</h3>
        <button
          onClick={() => setDetailedView((v) => !v)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
            detailedView
              ? "bg-blue-50 text-blue-600"
              : "bg-slate-50 text-slate-400"
          }`}
        >
          {detailedView ? "Detailed" : "Compact"}
        </button>
      </div>

      {/* Upcoming days */}
      <div className="space-y-1.5 mb-2">
        {upcoming.map((day) => (
          <DayTile
            key={day._id}
            day={day}
            detailed={detailedView}
            canInteract={
              sub.status === "active" &&
              day.status === "active" &&
              isFutureDate(day.date)
            }
            onTap={() => setDayModal(day)}
          />
        ))}
      </div>

      {/* Past days (collapsible) */}
      {past.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {/* Always show latest past day */}
          <DayTile
            key={past[0]._id}
            day={past[0]}
            detailed={detailedView}
            onTap={() => {}}
          />

          {past.length > 1 && (
            <>
              <button
                onClick={() => setPastExpanded((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-semibold hover:bg-slate-100 transition-all"
              >
                {pastExpanded
                  ? "Hide past days"
                  : `${past.length - 1} more delivered/skipped`}
                {pastExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {pastExpanded &&
                past
                  .slice(1)
                  .map((day) => (
                    <DayTile
                      key={day._id}
                      day={day}
                      detailed={detailedView}
                      onTap={() => {}}
                    />
                  ))}
            </>
          )}
        </div>
      )}

      {/* ── Collapsible Details ─────────────────────────────────────────────── */}
      <button
        onClick={() => setDetailsExpanded((v) => !v)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-slate-500"
      >
        <span>Details</span>
        {detailsExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {detailsExpanded && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 space-y-2.5">
          <DetailRow
            icon={Clock}
            label="Created"
            value={formatDateTime(sub.createdAt)}
          />
          {sub.payment?.paidAt && (
            <DetailRow
              icon={CreditCard}
              label="Paid"
              value={formatDateTime(sub.payment.paidAt)}
            />
          )}
          <DetailRow
            icon={CreditCard}
            label="Payment"
            value={sub.payment?.method === "wallet" ? "Wallet" : "Online"}
          />
          {sub.pausedAt && (
            <DetailRow
              icon={PauseCircle}
              label="Paused"
              value={formatDateTime(sub.pausedAt)}
            />
          )}
          {sub.completedAt && (
            <DetailRow
              icon={CheckCircle2}
              label="Completed"
              value={formatDateTime(sub.completedAt)}
            />
          )}
          {sub.cancelledAt && (
            <DetailRow
              icon={XCircle}
              label="Cancelled"
              value={formatDateTime(sub.cancelledAt)}
            />
          )}
        </div>
      )}

      {/* ── Actions (active sub) ────────────────────────────────────────────── */}
      {sub.status === "active" && (
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              icon={SkipForward}
              label="Skip Date"
              color="amber"
              onClick={openSkipModal}
              disabled={actionLoading || skippableDates.length === 0}
            />
            <ActionButton
              icon={Pause}
              label="Pause"
              color="amber"
              onClick={handlePause}
              disabled={actionLoading}
            />
          </div>
          <ActionButton
            icon={X}
            label="Cancel Subscription"
            color="red"
            onClick={() => setCancelModal(true)}
            disabled={actionLoading}
            full
          />
        </div>
      )}

      {sub.status === "paused" && (
        <div className="grid grid-cols-2 gap-3 mt-2">
          <ActionButton
            icon={Play}
            label="Resume"
            color="green"
            onClick={handleResume}
            disabled={actionLoading}
          />
          <ActionButton
            icon={X}
            label="Cancel"
            color="red"
            onClick={() => setCancelModal(true)}
            disabled={actionLoading}
          />
        </div>
      )}

      {/* ── Day Action Sheet ────────────────────────────────────────────────── */}
      {dayModal && (
        <DayActionSheet
          day={dayModal}
          sub={sub}
          loading={actionLoading}
          onClose={() => setDayModal(null)}
          onSkipItems={(itemIds) => handleSkipFromDay(dayModal, itemIds)}
          onUndoSkipItems={(itemIds) => handleUndoSkip(dayModal, itemIds)}
          onSkipDay={() => handleSkipFromDay(dayModal, [])}
          onUndoAll={() => handleUndoSkip(dayModal, [])}
          onAddExtra={() => {
            const date = dayModal.date.split("T")[0];
            setDayModal(null);
            setAddExtraDate(date);
          }}
        />
      )}

      {/* ── Skip Date Modal ─────────────────────────────────────────────────── */}
      {skipModal && (
        <Modal onClose={() => setSkipModal(false)}>
          {!skipSelectedDate ? (
            <>
              <h3 className="font-bold text-slate-800 text-lg">
                Skip a Delivery
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-4">
                Select a date to skip items on.
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {skippableDates.map((d) => (
                  <button
                    key={d._id}
                    onClick={() => selectSkipDate(d)}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-brand hover:bg-emerald-50 transition-all text-left disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="text-sm font-medium text-slate-700">
                          {formatDate(d.date)}
                        </span>
                        {d.items?.some((i) => i.isSkipped) && (
                          <p className="text-xs text-amber-500">
                            {d.items.filter((i) => i.isSkipped).length} item(s)
                            already skipped
                          </p>
                        )}
                      </div>
                    </div>
                    <SkipForward className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSkipModal(false)}
                className="mt-4 w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => setSkipSelectedDate(null)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                </button>
                <h3 className="font-bold text-slate-800 text-lg">
                  Choose items to skip
                </h3>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                {formatDate(skipSelectedDate.date)}
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(skipSelectedDate.items || []).map((item) => {
                  const checked =
                    item.isSkipped || skipSelectedItems.has(item._id);
                  return (
                    <label
                      key={item._id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                        item.isSkipped
                          ? "border-amber-100 bg-amber-50 opacity-60 cursor-not-allowed"
                          : checked
                            ? "border-amber-300 bg-amber-50"
                            : "border-slate-200 hover:border-amber-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={item.isSkipped}
                        onChange={() =>
                          !item.isSkipped && toggleSkipItem(item._id)
                        }
                        className="accent-amber-500 w-4 h-4"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.isSkipped
                            ? "Already skipped"
                            : `₹${item.price} × ${item.qty}`}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={handleSkipConfirm}
                disabled={actionLoading || skipSelectedItems.size === 0}
                className="mt-4 w-full py-3 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {skipSelectedItems.size ===
                (skipSelectedDate.items?.filter((i) => !i.isSkipped) || [])
                  .length
                  ? "Skip entire day"
                  : `Skip ${skipSelectedItems.size} item(s)`}
              </button>
            </>
          )}
        </Modal>
      )}

      {/* ── Cancel Modal ────────────────────────────────────────────────────── */}
      {cancelModal && (
        <Modal
          onClose={() => {
            setCancelModal(false);
            setCancelReason("");
          }}
        >
          <h3 className="font-bold text-slate-800 text-lg">
            Cancel Subscription?
          </h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Remaining days will be refunded to your wallet.
          </p>
          <textarea
            className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            rows={3}
            placeholder="Reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                setCancelModal(false);
                setCancelReason("");
              }}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all"
            >
              Keep It
            </button>
            <button
              disabled={!cancelReason.trim() || actionLoading}
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add Extra Modal ─────────────────────────────────────────────────── */}
      {addExtraDate && (
        <AddExtraModal
          date={addExtraDate}
          products={subProducts}
          productsLoaded={subProductsLoaded}
          loading={actionLoading}
          onClose={() => setAddExtraDate(null)}
          onConfirm={(productId, priceConfigId, qty) =>
            handleAddExtra(addExtraDate, productId, priceConfigId, qty)
          }
        />
      )}
    </Page>
  );
};

// ── Sub-components ───────────────────────────────────────────────────────────

const Page = ({ children }) => (
  <div className="min-h-screen bg-white py-8 px-4">
    <div className="max-w-2xl mx-auto">{children}</div>
  </div>
);

const StatItem = ({ value, label, color }) => (
  <div className="text-center">
    <p className={`text-lg font-extrabold ${color}`}>{value}</p>
    <p className="text-[10px] text-slate-400">{label}</p>
  </div>
);

const WalletRow = ({ label, value, color }) => (
  <div className="flex justify-between">
    <span className="text-xs text-slate-400">{label}</span>
    <span className={`text-xs font-bold ${color}`}>{value}</span>
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
    <span className="text-xs text-slate-400 w-20 shrink-0">{label}</span>
    <span className="text-xs font-medium text-slate-700">{value}</span>
  </div>
);

const NextDeliveryCard = ({ day, onTap, onSkip, onAddExtra }) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(day.date);
  const diff = Math.round((d - today) / 86400000);
  const when =
    diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : formatDate(day.date);
  const activeItems = day.items?.filter((i) => !i.isSkipped) || [];

  return (
    <div
      onClick={onTap}
      className="bg-linear-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 mb-4 cursor-pointer hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-0">
        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
          <Truck className="w-5 h-5 text-brand" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-brand/70 font-medium">Next Delivery</p>
          <p className="text-lg font-extrabold text-slate-900">{when}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-brand">
            ₹{day.dailyTotal?.toFixed(0)}
          </p>
          <p className="text-[10px] text-brand/60">
            {activeItems.length} item{activeItems.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-brand ml-1" />
      </div>

      {/* Items */}
      {activeItems.length > 0 && (
        <div className="px-4 pt-2 pb-0 ml-13 space-y-1">
          {activeItems.map((item) => (
            <div key={item._id} className="flex items-center gap-2">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-5 h-5 rounded object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded bg-white flex items-center justify-center">
                  <Package className="w-3 h-3 text-slate-400" />
                </div>
              )}
              <span className="text-xs text-slate-600 flex-1 truncate">
                {item.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                x{item.qty}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pt-3 pb-3 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          className="flex-1 py-2.5 rounded-xl border border-amber-200 bg-white text-amber-600 text-sm font-semibold hover:bg-amber-50 transition-all"
        >
          Skip Day
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddExtra();
          }}
          className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all"
        >
          Add Extra
        </button>
      </div>
    </div>
  );
};

const DayTile = ({ day, detailed = false, canInteract, onTap }) => {
  const colors = dayStatusColor(day.status);
  const allItems = day.items || [];
  const activeItems = allItems.filter((i) => !i.isSkipped);
  const skippedCount = allItems.filter((i) => i.isSkipped).length;
  const displayStatus =
    day.status === "out_for_delivery"
      ? "OUT FOR DELIVERY"
      : day.status.toUpperCase();

  const now = new Date();
  const d = new Date(day.date);
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  return (
    <div
      onClick={
        canInteract || allItems.some((i) => i.isSkipped) ? onTap : undefined
      }
      className={`rounded-xl border transition-all overflow-hidden ${
        canInteract
          ? "border-slate-200 hover:border-brand hover:bg-emerald-50/50 cursor-pointer"
          : isToday
            ? `border-1.5 ${colors.dot === "bg-brand" ? "border-brand" : colors.dot === "bg-blue-500" ? "border-blue-500" : "border-slate-200"}`
            : "border-slate-100 bg-white"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Status icon */}
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}
        >
          {day.status === "delivered" && (
            <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text}`} />
          )}
          {day.status === "skipped" && (
            <SkipForward className={`w-3.5 h-3.5 ${colors.text}`} />
          )}
          {day.status === "active" && (
            <Clock className={`w-3.5 h-3.5 ${colors.text}`} />
          )}
          {day.status === "packed" && (
            <Package className={`w-3.5 h-3.5 ${colors.text}`} />
          )}
          {day.status === "out_for_delivery" && (
            <Truck className={`w-3.5 h-3.5 ${colors.text}`} />
          )}
          {day.status === "cancelled" && (
            <XCircle className={`w-3.5 h-3.5 ${colors.text}`} />
          )}
        </div>

        {/* Date + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[13px] font-bold text-slate-800">
              {formatDate(day.date)}
            </p>
            {isToday && (
              <span className="px-1.5 py-0.5 rounded bg-brand text-white text-[7px] font-extrabold tracking-wide">
                TODAY
              </span>
            )}
          </div>
          <p
            className={`text-[11px] mt-0.5 ${colors.text}`}
            style={{ opacity: 0.7 }}
          >
            {activeItems.length} item{activeItems.length !== 1 ? "s" : ""}
            {skippedCount > 0 ? ` · ${skippedCount} skipped` : ""}
            {day.status === "delivered" && day.deliveredAt
              ? ` · ${new Date(day.deliveredAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
              : ""}
          </p>
        </div>

        {/* Price + status badge */}
        <div className="text-right shrink-0">
          <p className={`text-sm font-extrabold ${colors.text}`}>
            ₹{day.dailyTotal?.toFixed(0)}
          </p>
          <span
            className={`text-[8px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block tracking-wide ${colors.bg} ${colors.text}`}
          >
            {displayStatus}
          </span>
        </div>

        {canInteract && (
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </div>

      {/* Items section */}
      {allItems.length > 0 &&
        (!detailed ? (
          /* Compact: thumbnail strip */
          <div className="flex items-center gap-1 px-3 pb-2.5 ml-10">
            {allItems.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="w-6 h-6 rounded-md bg-slate-100 overflow-hidden shrink-0"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-3 h-3 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            {allItems.length > 4 && (
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-slate-400">
                  +{allItems.length - 4}
                </span>
              </div>
            )}
            <span className="text-[10px] text-slate-400 ml-1 truncate">
              {activeItems
                .slice(0, 2)
                .map((i) => i.name.split(" ")[0])
                .join(", ")}
            </span>
          </div>
        ) : (
          /* Detailed: full item list */
          <div className="border-t border-slate-100 mx-3 pt-2 pb-2.5 space-y-2">
            {allItems.map((item) => (
              <div key={item._id} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold ${item.isSkipped ? "text-slate-400 line-through" : "text-slate-700"}`}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">
                      x{item.qty}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      ₹{(item.price * item.qty).toFixed(0)}
                    </span>
                    {item.isExtra && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                        EXTRA
                      </span>
                    )}
                    {item.isSkipped && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">
                        SKIPPED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

const DayActionSheet = ({
  day,
  sub,
  loading,
  onClose,
  onSkipItems,
  onUndoSkipItems,
  onSkipDay,
  onUndoAll,
  onAddExtra,
}) => {
  const activeItems = day.items?.filter((i) => !i.isSkipped) || [];
  const skippedItems = day.items?.filter((i) => i.isSkipped) || [];
  const canModify = sub.status === "active" && isFutureDate(day.date);

  return (
    <Modal onClose={onClose}>
      <h3 className="font-bold text-slate-800 text-lg">
        {formatDate(day.date)}
      </h3>
      <p className="text-slate-400 text-xs mb-4">
        ₹{day.dailyTotal?.toFixed(0)} &bull; {day.status.toUpperCase()}
      </p>

      {/* Active items */}
      {activeItems.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-2">
            Active Items
          </p>
          <div className="space-y-2">
            {activeItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <Package className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    ₹{item.price} × {item.qty}
                    {item.isExtra ? " (extra)" : ""}
                  </p>
                </div>
                {canModify && day.status === "active" && (
                  <button
                    onClick={() => onSkipItems([item._id])}
                    disabled={loading}
                    className="text-xs text-amber-600 font-semibold px-2 py-1 rounded-lg hover:bg-amber-50 disabled:opacity-50"
                  >
                    Skip
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skipped items */}
      {skippedItems.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-amber-500 mb-2">
            Skipped Items
          </p>
          <div className="space-y-2">
            {skippedItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-amber-50/50"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover opacity-60"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <Package className="w-4 h-4 text-slate-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-400 line-through">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-300">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>
                {canModify && (
                  <button
                    onClick={() => onUndoSkipItems([item._id])}
                    disabled={loading}
                    className="text-xs text-blue-600 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                  >
                    Undo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {canModify && day.status === "active" && (
        <div className="space-y-2 mt-2">
          <div className="flex gap-2">
            {activeItems.length > 1 && (
              <button
                onClick={onSkipDay}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Skip Entire Day
              </button>
            )}
            {skippedItems.length > 1 && (
              <button
                onClick={onUndoAll}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Undo All Skips
              </button>
            )}
          </div>
          <button
            onClick={onAddExtra}
            className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Extra Item
          </button>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-3 w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all"
      >
        Close
      </button>
    </Modal>
  );
};

const colorMap = {
  amber: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
  red: "text-red-500 bg-red-50 border-red-200 hover:bg-red-100",
  green: "text-brand bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
};

const ActionButton = ({
  icon: Icon,
  label,
  color,
  onClick,
  disabled,
  full,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all disabled:opacity-50 ${colorMap[color]} ${full ? "w-full" : ""}`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const AddExtraModal = ({
  date,
  products,
  productsLoaded,
  loading,
  onClose,
  onConfirm,
}) => {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [qty, setQty] = useState(1);

  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const selectedConfig = selectedProduct?.priceConfigs?.find(
    (c) => c._id === selectedConfigId,
  );
  const cost = (selectedConfig?.sellingPrice || 0) * qty;

  const selectProduct = (product) => {
    if (selectedProductId === product._id) {
      setSelectedProductId(null);
      setSelectedConfigId(null);
    } else {
      setSelectedProductId(product._id);
      setSelectedConfigId(product.priceConfigs?.[0]?._id || null);
      setQty(1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col"
        style={{ maxHeight: "70vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0">
          <h3 className="font-bold text-slate-800 text-lg">Add Extra Item</h3>
          <p className="text-slate-500 text-xs mt-1 mb-4">
            {formatDate(date)} &bull; Charged from wallet
          </p>
        </div>

        {!productsLoaded ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            No products available
          </p>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1 px-6">
            {products.map((product) => {
              const isSelected = selectedProductId === product._id;
              return (
                <div
                  key={product._id}
                  className={`rounded-xl border transition-all ${isSelected ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200"}`}
                >
                  {/* Product header */}
                  <button
                    onClick={() => selectProduct(product)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        {product.name}
                      </p>
                      {!isSelected && product.priceConfigs?.[0] && (
                        <p className="text-xs text-brand font-medium">
                          ₹{product.priceConfigs[0].sellingPrice}
                        </p>
                      )}
                    </div>
                    {isSelected ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Expanded: config chips + qty */}
                  {isSelected && (
                    <div className="px-3 pb-3 space-y-3">
                      {/* Price config chips */}
                      <div className="flex flex-wrap gap-2">
                        {product.priceConfigs?.map((config) => (
                          <button
                            key={config._id}
                            onClick={() => setSelectedConfigId(config._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              selectedConfigId === config._id
                                ? "border-brand bg-emerald-50 text-brand"
                                : "border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {config.label} ₹{config.sellingPrice}
                          </button>
                        ))}
                      </div>

                      {/* Qty stepper */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-600">
                          Qty:
                        </span>
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          disabled={qty <= 1}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-slate-800 w-6 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty((q) => Math.min(9, q + 1))}
                          disabled={qty >= 9}
                          className="w-7 h-7 rounded-lg border border-brand bg-emerald-50 flex items-center justify-center text-brand hover:bg-emerald-100 disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom: cost + confirm */}
        <div className="p-6 pt-0">
          {selectedConfigId && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <p className="text-lg font-extrabold text-brand">
                ₹{cost.toFixed(0)}
              </p>
              <button
                onClick={() =>
                  onConfirm(selectedProductId, selectedConfigId, qty)
                }
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Add & Pay
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all ${selectedConfigId ? "mt-2" : "mt-4"}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
      {children}
    </div>
  </div>
);

export default SubscriptionDetailPage;
