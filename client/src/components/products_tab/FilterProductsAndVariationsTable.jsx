import React from "react";

const FilterProductsAndVariationsTable = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  handleCategoryChange,
  categories,
  selectedStatus,
  setSelectedStatus,
  handleStatusChange,
  statuses,
  showArchived,
  setShowArchived,
  handleSearchChange,
  isProducts,
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* Search Input with Clear Button */}
      <div className="relative flex items-center w-[300px]">
        <input
          type="text"
          className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="ml-2 text-alofa-pink hover:text-alofa-dark"
          >
            Clear
          </button>
        )}
      </div>

      {isProducts && categories.length > 0 && (
        <div className="relative flex items-center w-[200px]">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option
                key={category.product_category_id}
                value={category.product_category_id}
              >
                {category.name}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory("")}
              className="ml-2 text-alofa-pink hover:text-alofa-dark"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Status Dropdown with Clear Button */}
      <div className="relative flex items-center w-[200px]">
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status.status_id} value={status.status_id}>
              {status.description}
            </option>
          ))}
        </select>
        {selectedStatus && (
          <button
            onClick={() => setSelectedStatus("")}
            className="ml-2 text-alofa-pink hover:text-alofa-dark"
          >
            Clear
          </button>
        )}
      </div>

      {/* Checkbox for Show/Hide Archived */}
      {selectedStatus === "" && (
        <div className="flex items-center ml-4">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="h-5 w-5 accent-alofa-pink"
          />
          <label className="ml-2 font-semibold text-gray-700">
            {showArchived ? "Hide Archived" : "Show Archived"}
          </label>
        </div>
      )}
    </div>
  );
};

export default FilterProductsAndVariationsTable;
