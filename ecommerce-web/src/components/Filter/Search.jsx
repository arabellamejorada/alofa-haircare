import PropTypes from "prop-types";
import { FaTimes, FaSearch } from "react-icons/fa";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-white p-2 border border-gray-300 rounded-lg w-full pr-10 h-10 focus:outline-none focus:ring-2 focus:ring-alofa-pink"
      />
      {/* Display FaTimes when there is a search query, otherwise display FaSearch */}
      {searchQuery ? (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-alofa-pink"
          onClick={() => setSearchQuery("")} // Clear the search query
        >
          <FaTimes />
        </button>
      ) : (
        <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
      )}
    </div>
  );
};

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default Search;
