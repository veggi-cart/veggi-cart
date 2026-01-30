const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === category.id
              ? "bg-emerald-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
