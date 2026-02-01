import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import FormInput from "../components/common/FormInput";
import LocationDetector from "../components/user/LocationDetector";
import ServiceUnavailable from "../components/user/ServiceUnavailable";
import { checkServiceAvailability } from "../utils/locationService";

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

  const [serviceAvailability, setServiceAvailability] = useState({
    isServiceable: true,
    distance: null,
    maxDistance: 4,
  });

  useEffect(() => {
    // 1. Load User Details
    const existingDetails = localStorage.getItem("userDetails");
    if (existingDetails) {
      setFormData(JSON.parse(existingDetails));
    }

    // 2. Load Location and Capture it in a local variable to prevent stale state checks
    const existingLocation = localStorage.getItem("userLocation");
    let savedLoc = null;
    if (existingLocation) {
      savedLoc = JSON.parse(existingLocation);
      setLocation(savedLoc);

      // Check service availability for saved location
      if (savedLoc.latitude && savedLoc.longitude) {
        const availability = checkServiceAvailability(
          savedLoc.latitude,
          savedLoc.longitude,
        );
        setServiceAvailability(availability);
      }
    }

    // 3. Check permissions, passing the savedLoc to prevent auto-fetch if data exists
    checkLocationPermission(savedLoc);
  }, []);

  const checkLocationPermission = async (savedLoc) => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        permissionStatus: "unsupported",
      }));
      return;
    }

    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        setLocationState((prev) => ({
          ...prev,
          permissionStatus: permission.state,
        }));

        /**
         * LOGIC CHANGE:
         * Only auto-fetch if:
         * 1. Permission is already 'granted'
         * 2. AND we have NO saved address in localStorage
         */
        if (
          permission.state === "granted" &&
          (!savedLoc || !savedLoc.address)
        ) {
          fetchLocation();
        }

        permission.addEventListener("change", () => {
          setLocationState((prev) => ({
            ...prev,
            permissionStatus: permission.state,
          }));
        });
      } catch (error) {
        console.error("Permission API error:", error);
      }
    }
  };

  const fetchLocation = async () => {
    setLocationState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Check service availability FIRST
        const availability = checkServiceAvailability(latitude, longitude);
        setServiceAvailability(availability);

        try {
          const address = await reverseGeocode(latitude, longitude);

          setLocation({ latitude, longitude, address });

          // Update form address only if it's currently empty AND location is serviceable
          if (availability.isServiceable) {
            setFormData((prev) => ({
              ...prev,
              fullAddress: prev.fullAddress || address,
            }));
          }

          setLocationState((prev) => ({
            ...prev,
            isLoading: false,
            permissionStatus: "granted",
          }));
        } catch (error) {
          setLocation({
            latitude,
            longitude,
            address: "Manual entry required",
          });
          setLocationState({
            isLoading: false,
            error: "Coordinates found, but failed to fetch address name.",
            permissionStatus: "granted",
          });
        }
      },
      (error) => handleLocationError(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      { headers: { "User-Agent": "Veggie-Cart/1.0" } },
    );
    if (!response.ok) throw new Error("Service unavailable");
    const data = await response.json();
    return data.display_name || "Address not found";
  };

  const handleLocationError = (error) => {
    let errorMessage = "An unknown error occurred.";
    let status = locationState.permissionStatus;

    if (error.code === error.PERMISSION_DENIED) {
      errorMessage =
        "Location access denied. Please enable it in browser settings.";
      status = "denied";
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      errorMessage = "Location unavailable.";
    } else if (error.code === error.TIMEOUT) {
      errorMessage = "Request timed out.";
    }

    setLocationState({
      isLoading: false,
      error: errorMessage,
      permissionStatus: status,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRetryLocation = () => {
    // Clear current location and reset service availability
    setLocation({
      latitude: null,
      longitude: null,
      address: "",
    });
    setServiceAvailability({
      isServiceable: true,
      distance: null,
      maxDistance: 4,
    });
    setLocationState({
      isLoading: false,
      error: null,
      permissionStatus: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.flatNo ||
      !formData.fullAddress
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check service availability if location is detected
    if (location.latitude && location.longitude) {
      if (!serviceAvailability.isServiceable) {
        alert(
          "Sorry, we don't deliver to your location yet. Please try a different address within our service area.",
        );
        return;
      }
    }

    localStorage.setItem("userDetails", JSON.stringify(formData));
    localStorage.setItem("userLocation", JSON.stringify(location));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50  pb-20 lg:pb-0">
      <Header showBackButton={true} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8  ">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {formData.name ? `Hello, ${formData.name}! 👋` : "Welcome! 👋"}
          </h2>
          <p className="text-gray-600 text-lg">
            {formData.name
              ? "Update your details"
              : "Provide details to start shopping"}
          </p>
        </div>

        {/* <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8"> */}
        <div
          className={`${!serviceAvailability.isServiceable ? "bg-red-50" : "bg-white"}  rounded-lg border border-gray-200 p-6 sm:p-8`}
        >
          {/* Show Service Unavailable if location is out of range */}
          {location.latitude &&
          location.longitude &&
          !serviceAvailability.isServiceable ? (
            <ServiceUnavailable
              distance={serviceAvailability.distance}
              maxDistance={serviceAvailability.maxDistance}
              onRetry={handleRetryLocation}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                label="Name"
                placeholder="Enter your full name"
                required
              />

              <FormInput
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                label="Phone Number"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                required
              />

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delivery Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <FormInput
                    id="flatNo"
                    name="flatNo"
                    type="text"
                    value={formData.flatNo}
                    onChange={handleChange}
                    label="Flat No."
                    placeholder="e.g., 101"
                    required
                  />
                  <FormInput
                    id="apartmentName"
                    name="apartmentName"
                    type="text"
                    value={formData.apartmentName}
                    onChange={handleChange}
                    label="Apartment Name"
                    placeholder="e.g., Green Valley"
                    required
                  />
                </div>

                <LocationDetector
                  isLoading={locationState.isLoading}
                  error={locationState.error}
                  permissionStatus={locationState.permissionStatus}
                  locationAddress={location.address}
                  latitude={location.latitude}
                  longitude={location.longitude}
                  onDetectLocation={fetchLocation}
                />

                <FormInput
                  id="fullAddress"
                  name="fullAddress"
                  type="textarea"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  label="Full Address"
                  placeholder="Complete address details..."
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-transform active:scale-95"
              >
                {formData.name ? "Update Details" : "Continue Shopping"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
