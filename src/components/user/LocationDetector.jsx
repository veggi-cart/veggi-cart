const LocationDetector = ({
  isLoading,
  error,
  permissionStatus,
  locationAddress,
  latitude,
  longitude,
  onDetectLocation,
}) => {
  const getPermissionStatusUI = () => {
    if (isLoading) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-900">
              Fetching your location...
            </span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900 mb-1">
                Location Error
              </p>
              <p className="text-sm text-red-800">{error}</p>
              {permissionStatus === "denied" && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-red-700 font-semibold">
                    How to enable location:
                  </p>
                  <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                    <li>
                      Click the location icon in your browser's address bar
                    </li>
                    <li>Select "Allow" for location access</li>
                    <li>Refresh the page or click "Detect Location" again</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (locationAddress) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-900 mb-1">
                ✓ Location Detected
              </p>
              <p className="text-sm text-emerald-800">{locationAddress}</p>
              {latitude && longitude && (
                <p className="text-xs text-emerald-700 mt-1">
                  Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (permissionStatus === "prompt") {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                Location Permission Required
              </p>
              <p className="text-sm text-yellow-800">
                Click "Detect Location" to allow access to your location for
                accurate delivery.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-900">
          Auto-Detect Location <span className="text-gray-400">(Optional)</span>
        </label>
        <button
          type="button"
          onClick={onDetectLocation}
          disabled={isLoading}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
              Detecting...
            </span>
          ) : (
            "📍 Detect Location"
          )}
        </button>
      </div>

      {getPermissionStatusUI()}
    </div>
  );
};

export default LocationDetector;
