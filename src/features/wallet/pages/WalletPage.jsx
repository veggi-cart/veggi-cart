import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import { errorBus } from "../../../api/errorBus";

const PRESETS = [500, 1000, 2000, 3000, 5000];

const WalletPage = () => {
  const navigate = useNavigate();
  const { balance, transactions, pagination, loading, fetchWallet, addFunds, verifyFunds } = useWallet();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const loadCashfreeSdk = () =>
    new Promise((resolve, reject) => {
      if (window.Cashfree) return resolve(window.Cashfree);
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(window.Cashfree);
      script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
      document.head.appendChild(script);
    });

  const handleAddFunds = async () => {
    const num = parseFloat(amount);
    if (!num || num < 500 || num > 5000) {
      errorBus.emit("Enter amount between ₹500 and ₹5,000", "error");
      return;
    }

    const result = await addFunds(num);
    if (!result) return;

    const { paymentSessionId, cashfreeOrderId, txnId } = result;
    if (!paymentSessionId || !cashfreeOrderId) {
      errorBus.emit("Payment session not available", "error");
      return;
    }

    try {
      const cashfree = await loadCashfreeSdk();
      const instance = cashfree({
        mode: import.meta.env.VITE_CASHFREE_ENV === "production" ? "production" : "sandbox",
      });

      instance.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
        returnUrl: window.location.href,
      });

      // Listen for payment completion
      // Cashfree web SDK redirects or shows modal — poll after a delay
      const checkPayment = async () => {
        const res = await verifyFunds(txnId);
        if (res?.status === "success") {
          setAmount("");
          errorBus.emit("Funds added successfully!", "success");
          fetchWallet();
        }
      };

      // Wait for redirect back or modal close
      window.addEventListener("focus", async function onFocus() {
        window.removeEventListener("focus", onFocus);
        setTimeout(checkPayment, 2000);
      });
    } catch {
      errorBus.emit("Could not launch payment", "error");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const h = d.getHours() % 12 || 12;
    const m = String(d.getMinutes()).padStart(2, "0");
    const p = d.getHours() < 12 ? "AM" : "PM";
    return `${d.getDate()} ${months[d.getMonth()]} · ${h}:${m} ${p}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl font-black text-slate-900 mb-6">Wallet</h1>

        {/* Balance Card */}
        <div className="bg-brand rounded-2xl p-6 mb-6 text-white shadow-lg shadow-brand/20">
          <div className="flex items-center gap-2 mb-3 opacity-80">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium">Wallet Balance</span>
          </div>
          <p className="text-4xl font-black tracking-tight">₹{balance.toFixed(2)}</p>
        </div>

        {/* Add Funds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h2 className="font-bold text-slate-800 mb-1">Add Funds</h2>
          <p className="text-xs text-slate-500 mb-4">Min ₹500 · Max ₹5,000</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className="px-4 py-2 bg-emerald-50 text-brand border border-emerald-200 rounded-full text-sm font-semibold hover:bg-emerald-100 transition-colors"
              >
                ₹{p}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="500"
              max="5000"
              className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand focus:outline-none text-sm font-medium"
            />
            <button
              onClick={handleAddFunds}
              disabled={loading}
              className="px-6 py-3 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Money"}
            </button>
          </div>
        </div>

        {/* Transactions */}
        {transactions.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-800 mb-4">Transaction History</h2>
            <div className="space-y-2">
              {transactions.map((txn) => {
                const isCredit = txn.type === "credit";
                return (
                  <div
                    key={txn._id}
                    className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isCredit ? "bg-emerald-50 text-brand" : "bg-red-50 text-red-500"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {txn.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{formatDate(txn.createdAt)}</span>
                        {txn.status !== "success" && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              txn.status === "pending"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {txn.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        txn.status === "failed"
                          ? "text-red-400"
                          : isCredit
                          ? "text-brand"
                          : "text-red-500"
                      }`}
                    >
                      {isCredit ? "+" : "-"}₹{txn.amount}
                    </span>
                  </div>
                );
              })}
            </div>

            {pagination?.hasMore && (
              <button
                onClick={() => fetchWallet((pagination?.currentPage ?? 1) + 1)}
                disabled={loading}
                className="mt-4 w-full py-2 text-brand font-semibold text-sm hover:underline disabled:opacity-50"
              >
                Load more
              </button>
            )}
          </div>
        )}

        {transactions.length === 0 && !loading && (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
