import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-white p-2 border border-pink-500 rounded-lg w-full pr-10 h-[2rem]"
      />
      {searchQuery && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500"
          onClick={() => setSearchQuery("")} // Clear the search query
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default Search;
