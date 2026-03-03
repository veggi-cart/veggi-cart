import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { validateLoginForm } from "../utils/validation";

const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    loginWith: "email", // 'email' or 'phone'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLoginMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      loginWith: method,
      email: "",
      phoneNumber: "",
    }));
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data based on login method
    const loginData = {
      password: formData.password,
    };

    if (formData.loginWith === "email") {
      loginData.email = formData.email;
    } else {
      loginData.phoneNumber = formData.phoneNumber;
    }

    // Validate form
    const validationErrors = validateLoginForm(loginData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit form
    onSubmit(loginData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Login method toggle */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200">
        <button
          type="button"
          onClick={() => handleLoginMethodChange("email")}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold transition-colors ${
            formData.loginWith === "email"
              ? "bg-[#009661] text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => handleLoginMethodChange("phone")}
          className={`flex-1 py-2.5 px-4 text-sm font-semibold transition-colors ${
            formData.loginWith === "phone"
              ? "bg-[#009661] text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          Phone
        </button>
      </div>

      {/* Email or Phone input */}
      {formData.loginWith === "email" ? (
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009661] focus:border-transparent transition-colors ${
              errors.email || errors.identifier
                ? "border-red-500"
                : "border-slate-200"
            }`}
            placeholder="your@email.com"
          />
          {(errors.email || errors.identifier) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email || errors.identifier}
            </p>
          )}
        </div>
      ) : (
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            maxLength={10}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009661] focus:border-transparent transition-colors ${
              errors.phoneNumber || errors.identifier
                ? "border-red-500"
                : "border-slate-200"
            }`}
            placeholder="10-digit phone number"
          />
          {(errors.phoneNumber || errors.identifier) && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phoneNumber || errors.identifier}
            </p>
          )}
        </div>
      )}

      {/* Password input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009661] focus:border-transparent transition-colors ${
              errors.password ? "border-red-500" : "border-slate-200"
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#009661] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#007d51] focus:outline-none focus:ring-2 focus:ring-[#009661] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
