// import { Link } from "react-router-dom";

// const EmptyState = ({
//   icon = "cart", // cart, search
//   title,
//   description,
//   actionText,
//   actionLink = "/",
//   onActionClick,
// }) => {
//   const icons = {
//     cart: (
//       <svg
//         className="w-12 h-12 text-gray-400"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={1.5}
//           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </svg>
//     ),
//     search: (
//       <svg
//         className="w-10 h-10 text-gray-400"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//         />
//       </svg>
//     ),
//   };

//   return (
//     <div className="text-center py-16">
//       <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
//         {icons[icon]}
//       </div>
//       <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
//       <p className="text-gray-600 mb-4">{description}</p>
//       {actionText &&
//         (onActionClick ? (
//           <button
//             onClick={onActionClick}
//             className="text-emerald-600 hover:text-emerald-700 font-medium"
//           >
//             {actionText}
//           </button>
//         ) : (
//           <Link to={actionLink}>
//             <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
//               {actionText}
//             </button>
//           </Link>
//         ))}
//     </div>
//   );
// };

// export default EmptyState;
import { useNavigate } from "react-router-dom";

const EmptyState = ({
  icon = "cart",
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (icon) {
      case "cart":
        return (
          <svg
            className="w-16 h-16 text-gray-300"
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
        );
      case "search":
        return (
          <svg
            className="w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        );
      case "orders":
        return (
          <svg
            className="w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else if (actionLink) {
      navigate(actionLink);
    }
  };

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">{getIcon()}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionText && (
        <button
          onClick={handleAction}
          className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
