import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

const CartPage = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCartStore();

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Get user details and location from localStorage
    const userDetailsString = localStorage.getItem("userDetails");
    const userLocationString = localStorage.getItem("userLocation");
    const userDetails = userDetailsString
      ? JSON.parse(userDetailsString)
      : null;
    const userLocation = userLocationString
      ? JSON.parse(userLocationString)
      : null;

    let message = "*🛒 New Order from Veggie-Cart*\n\n";

    // Add customer details
    if (userDetails) {
      message += "*Customer Details:*\n";
      message += `Name: ${userDetails.name}\n`;
      message += `Phone: ${userDetails.phoneNumber}\n`;
      if (userDetails.homeAddress) {
        message += `Address: ${userDetails.homeAddress}\n`;
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
      message += `   Quantity: ${item.quantity} ${item.unit}\n`;
      message += `   Price: ₹${item.price} per ${item.unit}\n`;
      message += `   Subtotal: ₹${item.price * item.quantity}\n\n`;
    });

    message += "━━━━━━━━━━━━━━━━\n";
    message += `*Total Amount: ₹${getCartTotal()}*\n\n`;
    message += "Please confirm this order. Thank you! 🙏";

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "916363784290";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <span className="text-3xl">🥬</span>
                <h1 className="text-2xl font-bold text-gray-900">Veggi-Cart</h1>
              </Link>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding fresh products to your cart
            </p>
            <Link to="/">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-3xl">🥬</span>
              <h1 className="text-2xl font-bold text-gray-900">Veggi-Cart</h1>
            </Link>

            <Link to="/">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Continue Shopping</span>
                <span className="sm:hidden">Back</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h2>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex gap-4 sm:gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-lg p-3 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow min-w-0 pr-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} / {item.unit}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center bg-emerald-600 rounded-lg p-1">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="bg-white text-emerald-600 w-9 h-9 rounded-md font-bold hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-white font-semibold px-5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="bg-white text-emerald-600 w-9 h-9 rounded-md font-bold hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xl font-bold text-gray-900">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span className="truncate pr-3">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold whitespace-nowrap">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{getCartTotal()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{getCartTotal()}
                  </span>
                </div>
              </div>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium mb-3 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Order via WhatsApp</span>
              </button>

              {/* Clear */}
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Cart
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You'll be redirected to WhatsApp to complete your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
