/**
 * Validation utilities for auth forms
 */

export const validators = {
  /**
   * Validate email format
   */
  email: (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "" : "Invalid email format";
  },

  /**
   * Validate phone number (10 digits)
   */
  phoneNumber: (value) => {
    if (!value) return "Phone number is required";
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value) ? "" : "Phone number must be 10 digits";
  },

  /**
   * Validate password
   */
  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  },

  /**
   * Validate full name
   */
  fullName: (value) => {
    if (!value) return "Full name is required";
    if (value.trim().length < 2)
      return "Full name must be at least 2 characters";
    return "";
  },

  /**
   * Validate pincode (6 digits)
   */
  pincode: (value) => {
    if (!value) return "Pincode is required";
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(value) ? "" : "Pincode must be 6 digits";
  },

  /**
   * Validate required field
   */
  required: (value, fieldName = "This field") => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return `${fieldName} is required`;
    }
    return "";
  },

  /**
   * Validate coordinates
   */
  coordinates: (longitude, latitude) => {
    if (longitude === undefined || latitude === undefined) {
      return "Location coordinates are required";
    }
    if (longitude < -180 || longitude > 180) {
      return "Invalid longitude";
    }
    if (latitude < -90 || latitude > 90) {
      return "Invalid latitude";
    }
    return "";
  },
};

/**
 * Validate login form
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  // Validate login identifier (email or phone)
  if (!formData.email && !formData.phoneNumber) {
    errors.identifier = "Email or phone number is required";
  } else if (formData.email) {
    const emailError = validators.email(formData.email);
    if (emailError) errors.email = emailError;
  } else if (formData.phoneNumber) {
    const phoneError = validators.phoneNumber(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
  }

  // Validate password
  const passwordError = validators.password(formData.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

/**
 * Validate registration form
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  // Validate full name
  const nameError = validators.fullName(formData.fullName);
  if (nameError) errors.fullName = nameError;

  // Validate phone number
  const phoneError = validators.phoneNumber(formData.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;

  // Validate password
  const passwordError = validators.password(formData.password);
  if (passwordError) errors.password = passwordError;

  // Validate email (optional but must be valid if provided)
  if (formData.email) {
    const emailError = validators.email(formData.email);
    if (emailError) errors.email = emailError;
  }

  // Validate address fields
  if (!formData.address) {
    errors.address = "Address is required";
  } else {
    const address = formData.address;

    if (!address.houseOrFlat?.trim()) {
      errors.houseOrFlat = "House/Flat number is required";
    }

    if (!address.street?.trim()) {
      errors.street = "Street is required";
    }

    if (!address.area?.trim()) {
      errors.area = "Area is required";
    }

    const pincodeError = validators.pincode(address.pincode);
    if (pincodeError) errors.pincode = pincodeError;

    // Validate coordinates
    if (address.geoLocation?.coordinates) {
      const [longitude, latitude] = address.geoLocation.coordinates;
      const coordError = validators.coordinates(longitude, latitude);
      if (coordError) errors.coordinates = coordError;
    } else {
      errors.coordinates = "Location is required";
    }
  }

  return errors;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone || phone.length !== 10) return phone;
  return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
};

/**
 * Clean phone number (remove formatting)
 */
export const cleanPhoneNumber = (phone) => {
  return phone.replace(/\D/g, "");
};
