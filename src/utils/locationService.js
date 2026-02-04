// Service center location
const SERVICE_CENTER = {
  latitude: 12.92216411775162,
  longitude: 77.5065772324539,
  name: "Bengaluru Service Center",
};

// const SERVICE_RADIUS_KM = 4;
const SERVICE_RADIUS_KM = 14;

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a location is within service area
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Object} { isServiceable: boolean, distance: number }
 */
export const checkServiceAvailability = (latitude, longitude) => {
  if (!latitude || !longitude) {
    return { isServiceable: false, distance: null };
  }

  const distance = calculateDistance(
    latitude,
    longitude,
    SERVICE_CENTER.latitude,
    SERVICE_CENTER.longitude,
  );

  return {
    isServiceable: distance <= SERVICE_RADIUS_KM,
    distance: distance,
    maxDistance: SERVICE_RADIUS_KM,
  };
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return "Unknown";
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }

  return `${distance.toFixed(2)}km`;
};

export { SERVICE_CENTER, SERVICE_RADIUS_KM };
