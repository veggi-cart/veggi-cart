import { useState } from "react";
import useCartStore from "../store/cartStore";
import { products } from "../data/products";
import Header from "../components/common/Header";
import DeliveryAddressBanner from "../components/common/DeliveryAddressBanner";
import SearchBar from "../components/common/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/products/ProductCard";
import PriceConfigSelector from "../components/products/PriceConfigSelection";
import EmptyState from "../components/common/EmptyState";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPriceSelector, setShowPriceSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart, increaseQuantity, decreaseQuantity, cart, getCartCount } =
    useCartStore();

  // Get user details from localStorage
  const getUserName = () => {
    const userDetailsString = localStorage.getItem("userDetails");
    if (userDetailsString) {
      const userDetails = JSON.parse(userDetailsString);
      return userDetails.name || "User";
    }
    return "User";
  };

  // Get user address from localStorage
  const getUserAddress = () => {
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

  // Format unit display
  const formatUnit = (unit, value) => {
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

  // Handle add to cart click
  const handleAddToCart = (product) => {
    if (product.priceConfigs.length > 1) {
      // Show price selector for multiple configs
      setSelectedProduct(product);
      setShowPriceSelector(true);
    } else {
      // Add directly for single config
      addToCart({
        ...product,
        priceConfigIndex: 0,
        selectedPrice: product.priceConfigs[0].price,
        selectedUnit: formatUnit(
          product.priceConfigs[0].unit,
          product.priceConfigs[0].value,
        ),
        unitValue: product.priceConfigs[0].value,
        unitType: product.priceConfigs[0].unit,
      });
    }
  };

  // Handle price config selection
  const handlePriceConfigSelect = (priceConfig, index) => {
    addToCart({
      ...selectedProduct,
      priceConfigIndex: index,
      selectedPrice: priceConfig.price,
      selectedUnit: formatUnit(priceConfig.unit, priceConfig.value),
      unitValue: priceConfig.value,
      unitType: priceConfig.unit,
    });
    setShowPriceSelector(false);
    setSelectedProduct(null);
  };

  // Enhanced search function that checks keywords
  const matchesSearchTerm = (product, searchTerm) => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase().trim();

    // Check if product name matches
    if (product.name.toLowerCase().includes(search)) {
      return true;
    }

    // Check if any keyword matches
    return product.keywords.some((keyword) =>
      keyword.toLowerCase().includes(search),
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = matchesSearchTerm(product, searchTerm);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All", icon: "✨" },
    { id: "vegetables", name: "Vegetables", icon: "🥬" },
    { id: "dairy", name: "Dairy", icon: "🥛" },
    { id: "pulses", name: "Pulses", icon: "🫘" },
    { id: "flours", name: "Flours", icon: "🌾" },
    { id: "rice & grains", name: "Rice & Grains", icon: "🌾" },
    { id: "coconut products", name: "Coconut", icon: "🥥" },
    { id: "bakery", name: "Bakery", icon: "🍞" },
    { id: "egg", name: "Eggs", icon: "🥚" },
    { id: "meat", name: "Meat", icon: "🦀" },
  ];

  // Get cart items for a specific product
  const getCartItemsForProduct = (productId) => {
    return cart.filter((item) => item.id === productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        showCartButton={true}
        showUserButton={true}
        cartCount={getCartCount()}
        userName={getUserName()}
      />

      {/* Delivery Address Banner */}
      <DeliveryAddressBanner address={getUserAddress()} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Fresh & Organic Products
          </h2>
          <p className="text-gray-600 text-lg">
            Premium quality delivered to your doorstep
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search products (e.g., tomato, tamatar, badanekayi)..."
          />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="mb-4">
            <p className="text-gray-600">
              Found{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
              {selectedCategory !== "all" &&
                ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartItems={getCartItemsForProduct(product.id)}
                onAddToCart={handleAddToCart}
                onIncreaseQuantity={increaseQuantity}
                onDecreaseQuantity={decreaseQuantity}
                formatUnit={formatUnit}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No products found"
            description="Try adjusting your search or filters"
            actionText={searchTerm ? "Clear search" : null}
            onActionClick={searchTerm ? () => setSearchTerm("") : null}
          />
        )}
      </div>

      {/* Price Config Selector Bottom Sheet */}
      {showPriceSelector && selectedProduct && (
        <PriceConfigSelector
          product={selectedProduct}
          cartItems={getCartItemsForProduct(selectedProduct.id)}
          onClose={() => {
            setShowPriceSelector(false);
            setSelectedProduct(null);
          }}
          onSelectConfig={handlePriceConfigSelect}
          formatUnit={formatUnit}
        />
      )}

      <style>
        {`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}
      </style>
    </div>
  );
};

export default ProductsPage;
