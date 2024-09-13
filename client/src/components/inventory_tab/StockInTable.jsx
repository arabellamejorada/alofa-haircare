import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdAddBox } from "react-icons/md";

const StockInTable = ({ initialData, columns, varID }) => {
  const [data, setData] = useState(initialData); // State for managing rows

  // Function to convert column names to a proper form
  const formatColumnName = (columnName) => {
    if (columnName.toLowerCase() === "id") {
      return columnName.toUpperCase(); // Special case for "ID"
    }
    return columnName
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  // Function to convert UTC date string to local timezone string
  const formatDateInLocalTimezone = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", { timeZone: "Asia/Manila" });
  };

  // Function to handle adding a new row
  const handleAddRow = () => {
    const newRow = columns.reduce(
      (acc, column) => {
        // Check if the column key contains 'date' to assume it's a date field
        if (column.key.toLowerCase().includes("date")) {
          acc[column.key] = new Date().toISOString(); // Add current date in ISO format as default
        } else {
          acc[column.key] = ""; // Initialize with an empty string or default value
        }
        return acc;
      },
      { id: data.length + 1 } // Auto-generate a new ID
    );

    setData([...data, newRow]); // Add new row to the data state
  };

  // Function to handle deletion of a row
  const handleDeleteRow = (index) => {
    const updatedData = data.filter((_, i) => i !== index); // Remove the row at the specific index
    setData(updatedData);
  };

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="overflow-x-auto pt-4">
      <div className="flex justify-end pr-6">
        <MdAddBox
          fontSize={30}
          className="text-gray-400 mb-2 hover:text-pink-400 active:text-pink-500"
          onClick={handleAddRow}
        />
      </div>
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {/* Add # column */}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </th>
              {columns.map((column) => (
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  key={column.key}
                >
                  {column.header || formatColumnName(column.key)}
                </th>
              ))}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {/* Auto-incremented # column */}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  {index + 1}
                </td>
                {columns.map((column) => (
                  <td
                    className="px-5 py-2 border-b border-gray-200 text-sm text-center"
                    key={column.key}
                  >
                    {column.key === "quantity" ? (
                      // Editable input for quantity column (only accepts numbers)
                      <input
                        type="number" // Restricts input to numbers only
                        value={item[column.key] || 1} // Default to 1 if the value is undefined or empty
                        onChange={(e) => {
                          // Ensure only valid numbers are entered
                          const value = e.target.value;
                          if (!isNaN(value) && value !== "") {
                            const updatedData = [...data];
                            updatedData[index][column.key] = value;
                            setData(updatedData);
                          }
                        }}
                        className="w-20 border border-gray-200 rounded px-2 py-1 text-center"
                      />
                    ) : column.key === "var_ID" ? (
                      // Dropdown for var_ID
                      <select
                        value={item[column.key]}
                        onChange={(e) => {
                          const updatedData = [...data];
                          updatedData[index][column.key] = e.target.value;
                          setData(updatedData);
                        }}
                        className="w-32 border border-gray-200 rounded px-2 py-1 text-center appearance-none"
                      >
                        <option value="" disabled>
                          Select Variation
                        </option>
                        {varID.map((var_ID, idx) => (
                          <option key={idx} value={var_ID}>
                            {var_ID}
                          </option>
                        ))}
                      </select>
                    ) : column.key === "stock_in_date" ? (
                      formatDateInLocalTimezone(item[column.key])
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteRow(index)} // Handle delete row
                  >
                    <MdDelete fontSize={30} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Save
        </button>
      </div>
    </div>
  );
};

export default StockInTable;
