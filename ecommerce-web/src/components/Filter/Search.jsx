import PropTypes from "prop-types";


const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="p-2 border border-gray-300 rounded-lg w-full lg:w-auto"
    />
  );
};

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};

export default Search;
