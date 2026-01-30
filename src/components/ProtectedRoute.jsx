import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userDetails = localStorage.getItem("userDetails");

  if (!userDetails) {
    return <Navigate to="/user-details" replace />;
  }

  const user = JSON.parse(userDetails);

  if (!user.name || !user.phoneNumber) {
    return <Navigate to="/user-details" replace />;
  }

  return children;
}

export default ProtectedRoute;
