import React from "react";

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const columnNames = Object.keys(data[0]);

  // Function to convert column names to a proper form
  const formatColumnName = (columnName) => {
    if (columnName.toLowerCase() === "id") {
      return columnName.toUpperCase(); // Special case for "ID"
    }
    return columnName
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  return (
    <div className="bg-white px-4 pb-4 rounded-xl border-gray-200 flex-1">
      <div className="mt-3">
        <table className="w-full text-gray-700 border-x border-gray-200 rounded-xl">
          <thead>
            <tr>
              {columnNames.map((columnName) => (
                <td key={columnName}>{formatColumnName(columnName)}</td>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columnNames.map((columnName) => (
                  <td key={columnName}>{item[columnName]}</td>
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
