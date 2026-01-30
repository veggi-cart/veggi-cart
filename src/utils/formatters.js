// Format unit display for products
export const formatUnit = (unit, value) => {
  if (value === 1) {
    // Singular form
    if (unit === "piece") return "pc";
    if (unit === "bunch") return "bunch";
    if (unit === "packet") return "pack";
    if (unit === "dozen") return "dozen";
    if (unit === "tray") return "tray";
    if (unit === "kg") return "kg";
    if (unit === "gram") return "g";
    if (unit === "ml") return "ml";
    if (unit === "litre") return "L";
  }

  // Plural or specific values
  if (unit === "piece") return value + " pcs";
  if (unit === "bunch") return value + " bunch";
  if (unit === "packet") return value + " pack";
  if (unit === "dozen") return value + " doz";
  if (unit === "tray") return value + " tray";
  if (unit === "kg") return value + " kg";
  if (unit === "gram") return value + " g";
  if (unit === "ml") return value + " ml";
  if (unit === "litre") return value + " L";

  return `${value} ${unit}`;
};

// Get user name from localStorage
export const getUserName = () => {
  const userDetailsString = localStorage.getItem("userDetails");
  if (userDetailsString) {
    const userDetails = JSON.parse(userDetailsString);
    return userDetails.name || "User";
  }
  return "User";
};

// Get user address from localStorage
export const getUserAddress = () => {
  const userDetailsString = localStorage.getItem("userDetails");
  if (userDetailsString) {
    const userDetails = JSON.parse(userDetailsString);
    const parts = [];

    if (userDetails.flatNo) parts.push(userDetails.flatNo);
    if (userDetails.apartmentName) parts.push(userDetails.apartmentName);

    if (parts.length > 0) {
      return parts.join(", ");
    }

    if (userDetails.fullAddress) {
      return (
        userDetails.fullAddress.substring(0, 50) +
        (userDetails.fullAddress.length > 50 ? "..." : "")
      );
    }
  }
  return "Add delivery address";
};

// Get full user address without truncation
export const getFullUserAddress = () => {
  const userDetailsString = localStorage.getItem("userDetails");
  if (userDetailsString) {
    const userDetails = JSON.parse(userDetailsString);
    return userDetails.fullAddress || null;
  }
  return null;
};
