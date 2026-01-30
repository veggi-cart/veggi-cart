// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cart: [],
//       addToCart: (product) => {
//         const cart = get().cart;
//         const existingItem = cart.find((item) => item.id === product.id);
//         if (existingItem) {
//           set({
//             cart: cart.map((item) =>
//               item.id === product.id
//                 ? { ...item, quantity: item.quantity + 1 }
//                 : item,
//             ),
//           });
//         } else {
//           set({ cart: [...cart, { ...product, quantity: 1 }] });
//         }
//       },
//       removeFromCart: (productId) => {
//         set({ cart: get().cart.filter((item) => item.id !== productId) });
//       },
//       updateQuantity: (productId, quantity) => {
//         if (quantity <= 0) {
//           get().removeFromCart(productId);
//           return;
//         }
//         set({
//           cart: get().cart.map((item) =>
//             item.id === productId ? { ...item, quantity } : item,
//           ),
//         });
//       },
//       increaseQuantity: (productId) => {
//         set({
//           cart: get().cart.map((item) =>
//             item.id === productId
//               ? { ...item, quantity: item.quantity + 1 }
//               : item,
//           ),
//         });
//       },
//       decreaseQuantity: (productId) => {
//         const item = get().cart.find((item) => item.id === productId);
//         if (item && item.quantity > 1) {
//           set({
//             cart: get().cart.map((item) =>
//               item.id === productId
//                 ? { ...item, quantity: item.quantity - 1 }
//                 : item,
//             ),
//           });
//         } else {
//           get().removeFromCart(productId);
//         }
//       },
//       getCartTotal: () => {
//         return get().cart.reduce(
//           (total, item) => total + item.price * item.quantity,
//           0,
//         );
//       },
//       getCartCount: () => {
//         return get().cart.reduce((count, item) => count + item.quantity, 0);
//       },
//       clearCart: () => {
//         set({ cart: [] });
//       },
//     }),
//     {
//       name: "veggie-cart-storage", // name of the item in localStorage
//       getStorage: () => localStorage, // use localStorage for persistence
//     },
//   ),
// );

// export default useCartStore;
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add item to cart with specific price configuration
      addToCart: (product) => {
        const { cart } = get();

        // Check if this specific config already exists in cart
        const existingItemIndex = cart.findIndex(
          (item) =>
            item.id === product.id &&
            item.priceConfigIndex === product.priceConfigIndex,
        );

        if (existingItemIndex > -1) {
          // If config already exists, increase quantity
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += 1;
          set({ cart: updatedCart });
        } else {
          // Add new item with this config
          set({
            cart: [
              ...cart,
              {
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
                category: product.category,
                isVeg: product.isVeg,
                priceConfigIndex: product.priceConfigIndex,
                selectedPrice: product.selectedPrice,
                selectedUnit: product.selectedUnit,
                unitValue: product.unitValue,
                unitType: product.unitType,
                quantity: 1,
              },
            ],
          });
        }
      },

      // Increase quantity for specific config
      increaseQuantity: (productId, priceConfigIndex) => {
        const { cart } = get();
        const updatedCart = cart.map((item) => {
          if (
            item.id === productId &&
            item.priceConfigIndex === priceConfigIndex
          ) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        set({ cart: updatedCart });
      },

      // Decrease quantity for specific config
      decreaseQuantity: (productId, priceConfigIndex) => {
        const { cart } = get();
        const updatedCart = cart
          .map((item) => {
            if (
              item.id === productId &&
              item.priceConfigIndex === priceConfigIndex
            ) {
              if (item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
              }
              return null; // Mark for removal
            }
            return item;
          })
          .filter(Boolean); // Remove null items
        set({ cart: updatedCart });
      },

      // Remove specific config from cart
      removeFromCart: (productId, priceConfigIndex) => {
        const { cart } = get();
        const updatedCart = cart.filter(
          (item) =>
            !(
              item.id === productId &&
              item.priceConfigIndex === priceConfigIndex
            ),
        );
        set({ cart: updatedCart });
      },

      // Clear entire cart
      clearCart: () => set({ cart: [] }),

      // Get total number of items in cart (sum of all quantities)
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price of all items in cart
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + item.selectedPrice * item.quantity,
          0,
        );
      },

      // Get number of unique products in cart (not configs)
      getUniqueProductCount: () => {
        const { cart } = get();
        const uniqueIds = new Set(cart.map((item) => item.id));
        return uniqueIds.size;
      },
    }),
    {
      name: "veggie-cart-storage",
    },
  ),
);

export default useCartStore;
