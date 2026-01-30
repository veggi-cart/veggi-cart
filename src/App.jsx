// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

function App() {
  return (
    // <Router basename="/veggi-cart">
    <Router>
      <Routes>
        <Route
          index
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/user-details" element={<UserDetailsPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Optional: Redirect any unknown paths back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
