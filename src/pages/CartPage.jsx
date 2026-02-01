// import { useEffect, useState } from "react";
// import useCartStore from "../store/cartStore";
// import Header from "../components/common/Header";
// import DeliveryAddressBanner from "../components/common/DeliveryAddressBanner";
// import EmptyState from "../components/common/EmptyState";
// import CartItemGroup from "../components/cart/CartItemGroup";
// import OrderSummary from "../components/cart/OrderSummary";
// import OrderConfirmationModal from "../components/cart/OrderConfirmationModal";
// import { formatUnit, getUserAddress } from "../utils/formatters";
// import { sendWhatsAppOrder } from "../utils/whatsappHelper";

// const CartPage = () => {
//   const {
//     cart,
//     increaseQuantity,
//     decreaseQuantity,
//     removeFromCart,
//     getCartTotal,
//     clearCart,
//   } = useCartStore();

//   const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

//   // Get cart count
//   const getCartCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       // When page becomes visible again
//       if (!document.hidden) {
//         const wasRedirectedToWhatsApp = sessionStorage.getItem(
//           "whatsappOrderInitiated",
//         );

//         if (wasRedirectedToWhatsApp === "true" && cart.length > 0) {
//           // Small delay to ensure smooth transition
//           setTimeout(() => {
//             setShowOrderConfirmation(true);
//             sessionStorage.removeItem("whatsappOrderInitiated");
//           }, 500);
//         }
//       }
//     };

//     // Listen for visibility changes
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     // Also check on mount (in case user refreshes after coming back)
//     const checkOnMount = sessionStorage.getItem("whatsappOrderInitiated");
//     if (checkOnMount === "true" && cart.length > 0) {
//       setTimeout(() => {
//         setShowOrderConfirmation(true);
//         sessionStorage.removeItem("whatsappOrderInitiated");
//       }, 500);
//     }

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [cart.length]);

//   const handleWhatsAppOrder = () => {
//     if (cart.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }

//     sendWhatsAppOrder(cart, getCartTotal());
//   };

//   const handleOrderConfirmation = (placed) => {
//     if (placed) {
//       clearCart();
//     }
//     setShowOrderConfirmation(false);
//   };

//   // Group cart items by product ID for better display
//   const groupedCart = cart.reduce((acc, item) => {
//     if (!acc[item.id]) {
//       acc[item.id] = {
//         name: item.name,
//         imageUrl: item.imageUrl,
//         isVeg: item.isVeg,
//         items: [],
//       };
//     }
//     acc[item.id].items.push(item);
//     return acc;
//   }, {});

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <DeliveryAddressBanner address={getUserAddress()} />

//         <div className="max-w-md mx-auto px-4 py-16">
//           <div className="bg-white rounded-lg border border-gray-200 p-12">
//             <EmptyState
//               icon="cart"
//               title="Your cart is empty"
//               description="Start adding fresh products to your cart"
//               actionText="Start Shopping"
//               actionLink="/"
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <Header showBackButton={true} showCartButton={true} />

//       {/* Delivery Address Banner */}
//       <DeliveryAddressBanner address={getUserAddress()} />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page Title */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Shopping Cart
//           </h2>
//           <p className="text-gray-600">
//             {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {Object.entries(groupedCart).map(([productId, product]) => (
//               <CartItemGroup
//                 key={productId}
//                 product={product}
//                 items={product.items}
//                 onIncrease={increaseQuantity}
//                 onDecrease={decreaseQuantity}
//                 onRemove={removeFromCart}
//                 formatUnit={formatUnit}
//               />
//             ))}
//           </div>

//           {/* Summary */}
//           <div className="lg:col-span-1">
//             <OrderSummary
//               cart={cart}
//               total={getCartTotal()}
//               onWhatsAppOrder={handleWhatsAppOrder}
//               onClearCart={clearCart}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Order Confirmation Modal */}
//       {showOrderConfirmation && (
//         <OrderConfirmationModal
//           onConfirm={() => handleOrderConfirmation(true)}
//           onCancel={() => handleOrderConfirmation(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default CartPage;
import { useEffect, useState } from "react";
import useCartStore from "../store/cartStore";
import Header from "../components/common/Header";
import DeliveryAddressBanner from "../components/common/DeliveryAddressBanner";
import EmptyState from "../components/common/EmptyState";
import CartItemGroup from "../components/cart/CartItemGroup";
import OrderSummary from "../components/cart/OrderSummary";
import OrderConfirmationModal from "../components/cart/OrderConfirmationModal";
import { formatUnit, getUserAddress } from "../utils/formatters";
import { sendWhatsAppOrder } from "../utils/whatsappHelper";

const CartPage = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCartStore();

  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  // Get cart count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes visible again
      if (!document.hidden) {
        const wasRedirectedToWhatsApp = sessionStorage.getItem(
          "whatsappOrderInitiated",
        );

        if (wasRedirectedToWhatsApp === "true" && cart.length > 0) {
          // Small delay to ensure smooth transition
          setTimeout(() => {
            setShowOrderConfirmation(true);
            sessionStorage.removeItem("whatsappOrderInitiated");
          }, 500);
        }
      }
    };

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also check on mount (in case user refreshes after coming back)
    const checkOnMount = sessionStorage.getItem("whatsappOrderInitiated");
    if (checkOnMount === "true" && cart.length > 0) {
      setTimeout(() => {
        setShowOrderConfirmation(true);
        sessionStorage.removeItem("whatsappOrderInitiated");
      }, 500);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cart.length]);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    sendWhatsAppOrder(cart, getCartTotal());
  };

  const saveOrderToHistory = () => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const newOrder = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
          isVeg: item.isVeg,
          selectedPrice: item.selectedPrice,
          selectedUnit: item.selectedUnit,
          quantity: item.quantity,
        })),
        total: getCartTotal(),
        status: "pending", // pending, confirmed, preparing, out_for_delivery, delivered, cancelled
        createdAt: new Date().toISOString(),
      };

      orders.unshift(newOrder); // Add to beginning of array
      localStorage.setItem("orders", JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error("Failed to save order:", error);
      return false;
    }
  };

  const handleOrderConfirmation = (placed) => {
    if (placed) {
      // IMPORTANT: Save order BEFORE clearing cart
      const saved = saveOrderToHistory();
      if (saved) {
        clearCart();
      } else {
        alert("Failed to save order. Please try again.");
        setShowOrderConfirmation(false);
        return;
      }
    }
    setShowOrderConfirmation(false);
  };

  // Group cart items by product ID for better display
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        name: item.name,
        imageUrl: item.imageUrl,
        isVeg: item.isVeg,
        items: [],
      };
    }
    acc[item.id].items.push(item);
    return acc;
  }, {});

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        <Header />
        <DeliveryAddressBanner address={getUserAddress()} />

        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <EmptyState
              icon="cart"
              title="Your cart is empty"
              description="Start adding fresh products to your cart"
              actionText="Start Shopping"
              actionLink="/"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <Header showBackButton={true} showCartButton={true} />

      {/* Delivery Address Banner */}
      <DeliveryAddressBanner address={getUserAddress()} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h2>
          <p className="text-gray-600">
            {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(groupedCart).map(([productId, product]) => (
              <CartItemGroup
                key={productId}
                product={product}
                items={product.items}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
                formatUnit={formatUnit}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              total={getCartTotal()}
              onWhatsAppOrder={handleWhatsAppOrder}
              onClearCart={clearCart}
            />
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && (
        <OrderConfirmationModal
          onConfirm={() => handleOrderConfirmation(true)}
          onCancel={() => handleOrderConfirmation(false)}
        />
      )}
    </div>
  );
};

export default CartPage;
