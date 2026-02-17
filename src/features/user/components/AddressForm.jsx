import { useState, useEffect } from "react";
import { MapPin, Home, Navigation } from "lucide-react";

const AddressForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    houseOrFlat: "",
    street: "",
    area: "",
    pincode: "",
    geoLocation: {
      coordinates: [0, 0],
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        houseOrFlat: initialData.houseOrFlat || "",
        street: initialData.street || "",
        area: initialData.area || "",
        pincode: initialData.pincode || "",
        geoLocation: initialData.geoLocation || { coordinates: [0, 0] },
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.houseOrFlat?.trim()) {
      newErrors.houseOrFlat = "House/Flat number is required";
    }
    if (!formData.street?.trim()) {
      newErrors.street = "Street is required";
    }
    if (!formData.area?.trim()) {
      newErrors.area = "Area is required";
    }
    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          geoLocation: {
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
        }));
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* House/Flat */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Home className="inline w-4 h-4 mr-1.5" />
            House/Flat Number
          </label>
          <input
            type="text"
            name="houseOrFlat"
            value={formData.houseOrFlat}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.houseOrFlat
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-200"
            }`}
            placeholder="e.g., 301"
          />
          {errors.houseOrFlat && (
            <p className="mt-1.5 text-sm text-red-600">{errors.houseOrFlat}</p>
          )}
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Street
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.street
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-200"
            }`}
            placeholder="e.g., Ghansoli Gaon Road"
          />
          {errors.street && (
            <p className="mt-1.5 text-sm text-red-600">{errors.street}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1.5" />
            Area
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.area
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-200"
            }`}
            placeholder="e.g., Ghansoli"
          />
          {errors.area && (
            <p className="mt-1.5 text-sm text-red-600">{errors.area}</p>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength={6}
            className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.pincode
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-200"
            }`}
            placeholder="e.g., 400701"
          />
          {errors.pincode && (
            <p className="mt-1.5 text-sm text-red-600">{errors.pincode}</p>
          )}
        </div>
      </div>

      {/* Geolocation */}
      <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Location Coordinates
            </p>
            {formData.geoLocation?.coordinates?.[0] !== 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Lat: {formData.geoLocation.coordinates[1].toFixed(4)}, Lng:{" "}
                {formData.geoLocation.coordinates[0].toFixed(4)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            Get Current Location
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : initialData ? "Address" : "Address"}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
