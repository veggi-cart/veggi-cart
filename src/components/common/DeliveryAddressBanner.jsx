import { Link } from "react-router-dom";

const DeliveryAddressBanner = ({ address = "Add delivery address" }) => {
  return (
    <div className="bg-emerald-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link
          to="/user-details"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <svg
            className="w-5 h-5 text-emerald-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-700 font-medium">
              Delivering to
            </p>
            <p className="text-sm font-semibold text-emerald-900 truncate">
              {address}
            </p>
          </div>
          <svg
            className="w-4 h-4 text-emerald-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default DeliveryAddressBanner;
