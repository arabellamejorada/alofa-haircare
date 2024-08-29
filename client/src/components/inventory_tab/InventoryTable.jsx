import React from "react";

const DataTable = ({ data, columns, onEdit }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

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

  return (
    <div className="overflow-x-auto pt-4">
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  key={column.key}
                >
                  {column.header || formatColumnName(column.key)}
                </th>
              ))}
              {/* New column for the "Edit" button */}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                    key={column.key}
                  >
                    {column.render
                      ? column.render(item[column.key])
                      : column.key === "stock_in_date"
                      ? formatDateInLocalTimezone(item[column.key])
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;