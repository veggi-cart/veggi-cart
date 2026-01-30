// const OrderConfirmationModal = ({ onConfirm, onCancel }) => {
//   return (
//     // <div className="fixed inset-0 bg-black  flex items-center justify-center z-100 p-4">
//     <div className="fixed inset-0 bg-black opacity-50 z-60 animate-fade-in flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//             <svg
//               className="w-8 h-8 text-green-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">
//             Order Confirmation
//           </h3>
//           <p className="text-gray-600">
//             Did you successfully place your order via WhatsApp?
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onCancel}
//             className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-medium transition-colors"
//           >
//             Not Yet
//           </button>
//           <button
//             onClick={onConfirm}
//             className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
//           >
//             Yes, Clear Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmationModal;
const OrderConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 z-50 animate-fade-in" />

      {/* Modal */}
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Order Confirmation
            </h3>
            <p className="text-gray-600">
              Did you successfully place your order via WhatsApp?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-medium transition-colors"
            >
              Not Yet
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Yes, Clear Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationModal;
