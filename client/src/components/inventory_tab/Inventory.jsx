import React, { Fragment } from "react";
import DataTable from "../shared/DataTable";
// import { Link } from "react-router-dom";

const sampleData = [
  {
    id: "1",
    name: "Product 1",
    stock: "Product 1 Description",
    status: "AVAILABLE",
    last_update: "Category 1",
  },
  {
    id: "2",
    name: "Product 2",
    stock: "Product 2 Description",
    status: "OUT OF STOCK",
    last_update: "Category 2",
  },
];

export default function Inventory() {
  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Inventory
          </strong>
        </div>

        {/* Render Table with data*/}
        <DataTable data={sampleData} />
      </div>
    </Fragment>
  );
}
