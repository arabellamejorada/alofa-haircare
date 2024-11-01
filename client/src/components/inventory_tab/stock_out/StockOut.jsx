import React, { Fragment, useEffect, useState } from "react";
import StockOutTable from "./StockOutTable";
import { getAllProductVariations } from "../../../api/products";
import { createStockOut } from "../../../api/stockOut";
import { getInventory } from "../../../api/products";
import { getEmployeeIdByProfileId } from "../../../api/employees";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../AuthContext";
import {
  validateDropdown,
  validateQuantity,
  validateReason,
} from "../../../lib/consts/utils/validationUtils";

const StockOut = () => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [productVariations, setProductVariations] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [stockOutDate, setStockOutDate] = useState(() => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  });

  const [stockOutProducts, setStockOutProducts] = useState([]);
  const [rows, setRows] = useState([
    {
      variation_id: "",
      product_name: "",
      sku: "",
      type: "",
      value: "",
      quantity: 1,
      reason: "",
      searchTerm: "",
      isDropdownVisible: false,
      errors: { variation: false, quantity: false, reason: false },
    },
  ]);

  // Fetch employee and product variation data on component mount
  useEffect(() => {
    try {
      const loadData = async () => {
        setLoading(true);
        const productVariationsData = await getAllProductVariations();
        const inventoryData = await getInventory();
        const employeeId = parseInt(
          await getEmployeeIdByProfileId(user.id),
          10,
        );

        setEmployeeId(employeeId);
        setProductVariations(productVariationsData);
        setInventories(inventoryData);
      };
      loadData();
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("An error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const adjustToLocalTime = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000); // Adjust to local timezone
    return localDate.toISOString().slice(0, 16);
  };

  const validateRows = () => {
    let isValid = true;

    const updatedRows = rows.map((row) => {
      const inventory = inventories.find(
        (inv) => inv.variation_id === row.variation_id,
      );

      const errors = {
        variation: !validateDropdown(row.variation_id),
        quantity: !validateQuantity(
          row.quantity,
          inventory?.stock_quantity || 0,
        ),
        reason: !validateReason(row.reason),
      };

      if (errors.variation || errors.quantity || errors.reason) {
        isValid = false;
      }

      return { ...row, errors };
    });

    setRows(updatedRows);
    setStockOutProducts(updatedRows);

    return isValid;
  };

  const resetRows = () => {
    const initialRow = [
      {
        variation_id: "",
        product_name: "",
        sku: "",
        type: "",
        value: "",
        quantity: 1,
        reason: "",
        searchTerm: "",
        isDropdownVisible: false,
        errors: { variation: false, quantity: false, reason: false },
      },
    ];
    setRows(initialRow); // Reset rows state
    setStockOutProducts(initialRow); // Reset stockOutProducts state
  };

  const handleSubmitStockOut = async () => {
    const isValid = validateRows();

    if (!isValid) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    const stockOutData = {
      stock_out_date: selectedDate || stockOutDate,
      stockOutProducts,
      employee_id: employeeId,
    };

    try {
      setLoading(true);
      await createStockOut(stockOutData);
      toast.success("Stock out recorded successfully.");

      // Reset the rows and other fields
      resetRows();
      setStockOutDate(adjustToLocalTime());
      setEmployeeId("");
    } catch (error) {
      console.error("Error saving stock out:", error);
      toast.error("An error occurred while saving stock out.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "product_name", header: "Product Name" },
    { key: "variation", header: "Variation" },
    { key: "sku", header: "SKU" },
    { key: "stock_quantity", header: "Current Stock" },
    { key: "quantity", header: "Stock-Out Qty." },
    { key: "reason", header: "Reason" },
  ];

  return (
    <Fragment>
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}

        <div className="flex flex-col">
          <strong className="text-3xl font-bold text-gray-500">
            Stock Out
          </strong>

          <div className="flex flex-col px-6 pt-4 w-full gap-4">
            {/* Employee */}
            <div className="flex items-center gap-4">
              <label className="font-bold w-[15%] text-left" htmlFor="employee">
                Employee:
              </label>
              {/* Hidden Input for the User ID */}
              <input
                type="hidden"
                id="employee"
                name="employee"
                value={employeeId}
              />
              {/* Displayed Name */}
              <span className="w-1/3 h-8 pl-4 flex items-center bg-gray-50 rounded-md border border-slate-300 text-slate-700">
                {user ? `${user.first_name} ${user.last_name}` : ""}
              </span>
            </div>

            {/* Stock Out Date */}
            <div className="flex items-center gap-4">
              <label
                className="font-bold w-[15%] text-left"
                htmlFor="stock_out_date"
              >
                Stock Out Date:
              </label>
              <input
                type="datetime-local"
                name="stock_out_date"
                id="stock_out_date"
                value={selectedDate || stockOutDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-1/3 h-8 px-4 border rounded-md bg-gray-50 hover:border-alofa-pink hover:bg-white text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Stock Out Table */}
        <StockOutTable
          columns={columns}
          productVariations={productVariations}
          inventories={inventories}
          stockOutProducts={stockOutProducts}
          setStockOutProducts={setStockOutProducts}
          setRows={setRows}
          rows={rows}
          resetRows={resetRows}
        />

        {/* Submit Button */}
        <div className="flex flex-row mt-4 gap-2">
          <button
            className="px-4 py-2 bg-alofa-pink text-white rounded hover:bg-alofa-dark"
            onClick={handleSubmitStockOut}
          >
            Save
          </button>

          <Link to="/stockouthistory">
            <button className="px-4 py-2 bg-alofa-pink text-white rounded hover:bg-alofa-dark">
              View History
            </button>
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default StockOut;
