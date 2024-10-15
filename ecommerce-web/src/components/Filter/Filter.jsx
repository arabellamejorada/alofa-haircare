import PropTypes from "prop-types";

const Filter = ({ categories, selectedCategory, setSelectedCategory, selectedSort, setSelectedSort }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full max-w-xs bg-opacity-70">
      <h2 className="text-3xl font-heading font-semibold text-alofa-pink mb-4">Filter</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-600">Category</h3>
        <div className="ml-4 mt-2">
          {categories.map((category, index) => (
            <label key={index} className="block text-gray-600 mb-2">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="mr-2"
              />
              {category}
            </label>
          ))}
          <label className="block text-gray-600 mb-2">
            <input
              type="radio"
              name="category"
              value="All"
              checked={selectedCategory === "All"}
              onChange={() => setSelectedCategory("All")}
              className="mr-2"
            />
            All
          </label>
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-lg font-medium text-gray-600">Price</h3>
        <div className="ml-4 mt-2">
          <label className="block text-gray-600 mb-2">
            <input
              type="radio"
              name="sort"
              value="low-to-high"
              checked={selectedSort === "low-to-high"}
              onChange={() => setSelectedSort("low-to-high")}
              className="mr-2"
            />
            Lowest to Highest
          </label>
          <label className="block text-gray-600 mb-2">
            <input
              type="radio"
              name="sort"
              value="high-to-low"
              checked={selectedSort === "high-to-low"}
              onChange={() => setSelectedSort("high-to-low")}
              className="mr-2"
            />
            Highest to Lowest
          </label>
          <label className="block text-gray-600 mb-2">
            <input
              type="radio"
              name="sort"
              value="none"
              checked={selectedSort === "none"}
              onChange={() => setSelectedSort("none")}
              className="mr-2"
            />
            None
          </label>
        </div>
      </div>
    </div>
  );
};

Filter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  selectedSort: PropTypes.string.isRequired,
  setSelectedSort: PropTypes.func.isRequired,
};

export default Filter;
