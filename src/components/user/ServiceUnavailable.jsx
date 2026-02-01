import { formatDistance } from "../../utils/locationService";

const ServiceUnavailable = ({ distance, maxDistance, onRetry }) => {
  return (
    <div className="bg-red-50  rounded-lg ">
      <div className="text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-red-900 mb-2">
          Service Not Available
        </h3>

        {/* Message */}
        <p className="text-sm text-red-800 mb-4">
          Unfortunately, we don't deliver to your location yet. Our services are
          currently available within{" "}
          <span className="font-semibold">{maxDistance}km</span> from our
          center.
        </p>

        {/* Distance Info */}
        {distance && (
          <div className="bg-red-100 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-700 mb-1">Your location is</p>
            <p className="text-2xl font-bold text-red-900">
              {formatDistance(distance)}
            </p>
            <p className="text-xs text-red-700 mt-1">from our service center</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-white border border-red-200 rounded-lg p-4 text-left mb-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            📍 Current Service Area:
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Pattanagere Main Road</li>
            <li>• Within {maxDistance}km radius</li>
            <li>• Expanding to new areas soon!</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            📍 Try Another Location
          </button>
          <p className="text-xs text-red-700">
            Moving to a new location? Update your address to check availability
          </p>
        </div>

        {/* Notify Me Section */}
        <div className="mt-6 pt-6 border-t border-red-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Coming to your area soon!
          </p>
          <p className="text-xs text-gray-600 mb-3">
            We're rapidly expanding. Leave your details and we'll notify you
            when we start delivering in your area.
          </p>
          <button className="text-sm text-red-700 hover:text-red-800 font-medium underline">
            Notify Me When Available →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceUnavailable;
