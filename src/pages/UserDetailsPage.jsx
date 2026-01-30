// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function UserDetailsPage() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNumber: "",
//     homeAddress: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.phoneNumber) {
//       alert("Please fill in Name and Phone Number");
//       return;
//     }

//     localStorage.setItem("userDetails", JSON.stringify(formData));
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-3">
//               <span className="text-3xl">🥬</span>
//               <h1 className="text-2xl font-bold text-gray-900">Veggie-Cart</h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Form Container */}
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
//             Welcome! 👋
//           </h2>
//           <p className="text-gray-600 text-lg">
//             Please provide your details to start shopping
//           </p>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-semibold text-gray-900 mb-2"
//               >
//                 Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your full name"
//                 className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
//               />
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label
//                 htmlFor="phoneNumber"
//                 className="block text-sm font-semibold text-gray-900 mb-2"
//               >
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your phone number"
//                 pattern="[0-9]{10}"
//                 title="Please enter a valid 10-digit phone number"
//                 className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
//               />
//               <p className="mt-2 text-sm text-gray-500">
//                 Enter 10-digit mobile number
//               </p>
//             </div>

//             {/* Home Address */}
//             <div>
//               <label
//                 htmlFor="homeAddress"
//                 className="block text-sm font-semibold text-gray-900 mb-2"
//               >
//                 Home Address
//               </label>
//               <textarea
//                 id="homeAddress"
//                 name="homeAddress"
//                 value={formData.homeAddress}
//                 onChange={handleChange}
//                 rows="4"
//                 placeholder="Enter your complete delivery address"
//                 className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 resize-none"
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
//             >
//               Continue Shopping
//             </button>
//           </form>
//         </div>

//         {/* Info Card */}
//         <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <div className="flex gap-3">
//             <svg
//               className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <div className="text-sm text-blue-900">
//               <p className="font-semibold mb-1">Your information is safe</p>
//               <p className="text-blue-800">
//                 We'll use this information only for order delivery and
//                 communication purposes.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserDetailsPage;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserDetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    homeAddress: "",
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    // Fetch location on component mount
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    setLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prev) => ({ ...prev, latitude, longitude }));

        // Fetch address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          const data = await response.json();
          const address = data.display_name || "Address not found";
          setLocation({ latitude, longitude, address });
          setFormData((prev) => ({
            ...prev,
            homeAddress: address,
          }));
        } catch (error) {
          console.error("Error fetching address:", error);
          setLocation((prev) => ({
            ...prev,
            address: "Unable to fetch address",
          }));
        }

        setLoadingLocation(false);
      },
      (error) => {
        setLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enable it.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
        }
      },
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phoneNumber) {
      alert("Please fill in Name and Phone Number");
      return;
    }

    // Save user details and location to localStorage
    localStorage.setItem("userDetails", JSON.stringify(formData));
    localStorage.setItem("userLocation", JSON.stringify(location));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥬</span>
              <h1 className="text-2xl font-bold text-gray-900">Veggie-Cart</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Please provide your details to start shopping
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter 10-digit mobile number
              </p>
            </div>

            {/* Location Detection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Delivery Location
                </label>
                <button
                  type="button"
                  onClick={fetchLocation}
                  disabled={loadingLocation}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
                >
                  {loadingLocation ? "Detecting..." : "📍 Detect Location"}
                </button>
              </div>

              {loadingLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-900">
                      Fetching your location...
                    </span>
                  </div>
                </div>
              )}

              {locationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-red-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-red-900">
                      {locationError}
                    </span>
                  </div>
                </div>
              )}

              {location.address && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-3">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
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
                        Location Detected
                      </p>
                      <p className="text-sm text-emerald-800">
                        {location.address}
                      </p>
                      {location.latitude && location.longitude && (
                        <p className="text-xs text-emerald-700 mt-1">
                          Coordinates: {location.latitude.toFixed(6)},{" "}
                          {location.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Home Address */}
            <div>
              <label
                htmlFor="homeAddress"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Home Address
              </label>
              <textarea
                id="homeAddress"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                rows="4"
                placeholder="Enter or edit your complete delivery address"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                You can edit the auto-detected address or enter it manually
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Your information is safe</p>
              <p className="text-blue-800">
                We'll use this information only for order delivery and
                communication purposes. Location access helps us provide
                accurate delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
