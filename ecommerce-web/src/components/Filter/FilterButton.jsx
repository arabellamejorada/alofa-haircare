import { useState } from "react";
import PropTypes from "prop-types";
import { FaFilter } from "react-icons/fa6";

const FilterButton = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      // Deselect the category if it's already selected
      setSelectedCategory("All");
    } else {
      // Select the new category
      setSelectedCategory(category);
    }
  };

  const handleSortClick = (sortOption) => {
    if (selectedSort === sortOption) {
      // Deselect the sort option if it's already selected
      setSelectedSort("none");
    } else {
      // Select the new sort option
      setSelectedSort(sortOption);
    }
  };

  return (
    <div className="relative w-auto lg:w-auto z-50">
      {/* Filter Button Styled for Smaller Width */}
      <button
        className="flex items-center justify-center bg-white text-alofa-pink py-2 px-4 rounded-full shadow-lg hover:bg-pink-100 transition-all w-auto"
        onClick={toggleDropdown}
      >
        <FaFilter className="mr-2 text-2xl text-alofa-pink" />
        <span className="text-lg font-semibold">Filter</span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute mt-2 bg-white rounded-lg shadow-lg p-4 w-full max-w-md z-50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Category
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category.product_category_id}
                    value={category.name}
                    className={`py-2 px-4 rounded-full border ${
                      selectedCategory === category.name
                        ? "bg-gray-300"
                        : "bg-gray-100"
                    } hover:bg-gray-300 transition`}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name}
                  </button>
                ))}

                <button
                  name="category"
                  value="All"
                  onClick={() => handleCategoryClick("All")}
                  className={`py-2 px-4 rounded-full border ${
                    selectedCategory === "All" ? "bg-gray-300" : "bg-gray-100"
                  } hover:bg-gray-300 transition`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Price</h3>
              <div className="flex flex-col gap-2">
                <button
                  className={`py-2 px-4 rounded-full border ${
                    selectedSort === "low-to-high"
                      ? "bg-gray-300"
                      : "bg-gray-100"
                  } hover:bg-gray-300 transition`}
                  onClick={() => handleSortClick("low-to-high")}
                >
                  Lowest to Highest
                </button>
                <button
                  className={`py-2 px-4 rounded-full border ${
                    selectedSort === "high-to-low"
                      ? "bg-gray-300"
                      : "bg-gray-100"
                  } hover:bg-gray-300 transition`}
                  onClick={() => handleSortClick("high-to-low")}
                >
                  Highest to Lowest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

FilterButton.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // Category name is a string
      product_category_id: PropTypes.number.isRequired, // Category ID is a number
    }),
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  setSelectedCategory: PropTypes.func.isRequired,
  selectedSort: PropTypes.string.isRequired,
  setSelectedSort: PropTypes.func.isRequired,
};

export default FilterButton;
