// Generate WhatsApp message for order
export const generateWhatsAppMessage = (cart, total) => {
  const userDetailsString = localStorage.getItem("userDetails");
  const userLocationString = localStorage.getItem("userLocation");
  const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
  const userLocation = userLocationString
    ? JSON.parse(userLocationString)
    : null;

  let message = "*🛒 New Order from Veggie-Cart*\n\n";

  // Add customer details
  if (userDetails) {
    message += "*Customer Details:*\n";
    message += `Name: ${userDetails.name}\n`;
    message += `Phone: ${userDetails.phoneNumber}\n\n`;

    message += "*Delivery Address:*\n";
    if (userDetails.flatNo) {
      message += `${userDetails.flatNo}`;
      if (userDetails.apartmentName) {
        message += `, ${userDetails.apartmentName}\n`;
      } else {
        message += `\n`;
      }
    } else if (userDetails.apartmentName) {
      message += `${userDetails.apartmentName}\n`;
    }

    if (userDetails.fullAddress) {
      message += `${userDetails.fullAddress}\n`;
    }

    // Add Google Maps link if location is available
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      const mapsLink = `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
      message += `\n📍 *Location:*\n${mapsLink}\n`;
    }
    message += "\n";
  }

  message += "*Order Details:*\n";
  message += "━━━━━━━━━━━━━━━━\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Pack Size: ${item.selectedUnit}\n`;
    message += `   Price: ₹${item.selectedPrice} per ${item.selectedUnit}\n`;
    message += `   Subtotal: ₹${item.selectedPrice * item.quantity}\n\n`;
  });

  message += "━━━━━━━━━━━━━━━━\n";
  message += `*Total Amount: ₹${total}*\n\n`;
  message += "Please confirm this order. Thank you! 🙏";

  return message;
};

// Send WhatsApp order
export const sendWhatsAppOrder = (
  cart,
  total,
  phoneNumber = "916363784290",
) => {
  const message = generateWhatsAppMessage(cart, total);
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Set flag before redirecting
  sessionStorage.setItem("whatsappOrderInitiated", "true");

  window.open(whatsappURL, "_blank");
};
