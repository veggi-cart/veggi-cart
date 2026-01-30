import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import FormInput from "../components/common/FormInput";
import LocationDetector from "../components/user/LocationDetector";

function UserDetailsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    flatNo: "",
    apartmentName: "",
    fullAddress: "",
  });
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [locationState, setLocationState] = useState({
    isLoading: false,
    error: null,
    permissionStatus: null,
  });

  useEffect(() => {
    // Load existing user details if available
    const existingDetails = localStorage.getItem("userDetails");
    if (existingDetails) {
      const details = JSON.parse(existingDetails);
      setFormData(details);
    }

    // Load existing location if available
    const existingLocation = localStorage.getItem("userLocation");
    if (existingLocation) {
      const loc = JSON.parse(existingLocation);
      setLocation(loc);
    }

    checkLocationPermission();
  }, []);

  // Check location permission status
  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationState({
        isLoading: false,
        error: "Geolocation is not supported by your browser",
        permissionStatus: "unsupported",
      });
      return;
    }

    // Check permission status if available
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        setLocationState((prev) => ({
          ...prev,
          permissionStatus: permission.state,
        }));

        // Auto-fetch if permission already granted and no location saved
        if (permission.state === "granted" && !location.address) {
          fetchLocation();
        }

        // Listen for permission changes
        permission.addEventListener("change", () => {
          setLocationState((prev) => ({
            ...prev,
            permissionStatus: permission.state,
          }));
        });
      } catch (error) {
        console.error("Permission API error:", error);
        setLocationState((prev) => ({
          ...prev,
          permissionStatus: "unknown",
        }));
      }
    }
  };

  const fetchLocation = async () => {
    setLocationState({
      isLoading: true,
      error: null,
      permissionStatus: locationState.permissionStatus,
    });

    if (!navigator.geolocation) {
      setLocationState({
        isLoading: false,
        error: "Geolocation is not supported by your browser",
        permissionStatus: "unsupported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLocationState((prev) => ({
          ...prev,
          permissionStatus: "granted",
        }));

        try {
          const address = await reverseGeocode(latitude, longitude);

          setLocation({ latitude, longitude, address });
          setFormData((prev) => ({
            ...prev,
            fullAddress: address,
          }));

          setLocationState({
            isLoading: false,
            error: null,
            permissionStatus: "granted",
          });
        } catch (error) {
          console.error("Geocoding error:", error);
          setLocation({
            latitude,
            longitude,
            address: "Unable to fetch address",
          });
          setLocationState({
            isLoading: false,
            error: "Could not fetch address, but coordinates are saved",
            permissionStatus: "granted",
          });
        }
      },
      (error) => {
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Veggie-Cart/1.0",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Geocoding service unavailable");
    }

    const data = await response.json();
    return data.display_name || "Address not found";
  };

  const handleLocationError = (error) => {
    let errorMessage = "";
    let permissionStatus = locationState.permissionStatus;

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          "Location access denied. Please enable location permissions in your browser settings.";
        permissionStatus = "denied";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage =
          "Location information unavailable. Please check your device settings.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Please try again.";
        break;
      default:
        errorMessage = "An unknown error occurred while fetching location.";
    }

    setLocationState({
      isLoading: false,
      error: errorMessage,
      permissionStatus,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.flatNo ||
      !formData.apartmentName ||
      !formData.fullAddress
    ) {
      alert("Please fill in all required fields");
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
      <Header showBackButton={true} />

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {formData.name ? `Hello, ${formData.name}! 👋` : "Welcome! 👋"}
          </h2>
          <p className="text-gray-600 text-lg">
            {formData.name
              ? "Update your delivery details"
              : "Please provide your details to start shopping"}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <FormInput
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              label="Name"
              placeholder="Enter your full name"
              required={true}
            />

            {/* Phone Number */}
            <FormInput
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              label="Phone Number"
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              helperText="Enter 10-digit mobile number"
              required={true}
            />

            {/* Delivery Address Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Address
              </h3>

              {/* Flat/House No */}
              <div className="mb-4">
                <FormInput
                  id="flatNo"
                  name="flatNo"
                  type="text"
                  value={formData.flatNo}
                  onChange={handleChange}
                  label="Home / Flat No."
                  placeholder="e.g., 101, A-12"
                  required={true}
                />
              </div>

              {/* Apartment/House Name */}
              <div className="mb-4">
                <FormInput
                  id="apartmentName"
                  name="apartmentName"
                  type="text"
                  value={formData.apartmentName}
                  onChange={handleChange}
                  label="Apartment / House Name"
                  placeholder="e.g., Green Valley Apartments, Sunrise Villa"
                  required={true}
                />
              </div>

              {/* Location Detection */}
              <LocationDetector
                isLoading={locationState.isLoading}
                error={locationState.error}
                permissionStatus={locationState.permissionStatus}
                locationAddress={location.address}
                latitude={location.latitude}
                longitude={location.longitude}
                onDetectLocation={fetchLocation}
              />

              {/* Full Address */}
              <FormInput
                id="fullAddress"
                name="fullAddress"
                type="textarea"
                value={formData.fullAddress}
                onChange={handleChange}
                label="Full Address (Street, Locality, City, Pincode)"
                placeholder="Enter complete address with street, locality, landmark, city, and pincode"
                rows={4}
                helperText="You can edit the auto-detected address or enter it manually"
                required={true}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {formData.name ? "Update Details" : "Continue Shopping"}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
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
