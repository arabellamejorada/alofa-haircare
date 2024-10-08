import PropTypes from 'prop-types';

const Filter = ({ categories, selectedCategory, setSelectedCategory, selectedSort, setSelectedSort }) => {
  return (
    <div className="mb-6">
      <div className="flex">
        {/* Category Filter */}
        <label className="mr-4">Category:</label>
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <label className="ml-4 mr-4">Sort by Price:</label>
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="none">None</option>
          <option value="low-to-high">Lowest to Highest</option>
          <option value="high-to-low">Highest to Lowest</option>
        </select>
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
