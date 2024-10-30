import React, { Fragment, useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import StockOutTable from "./StockOutTable";
import { getAllProductVariations } from "../../../api/products";
import { createStockOut } from "../../../api/stockOut";
import { getInventory } from "../../../api/products";
import { getEmployees } from "../../../api/employees";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  validateDropdown,
  validateQuantity,
  validateReason,
} from "../../../lib/consts/utils/validationUtils";

const StockOut = () => {
  const [employees, setEmployees] = useState([]);
  const [productVariations, setProductVariations] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState("");
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
        const employeeData = await getEmployees();
        const productVariationsData = await getAllProductVariations();
        const inventoryData = await getInventory();
        setEmployees(employeeData);
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
  }, []);

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

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

    if (!selectedEmployee || stockOutProducts.length === 0) {
      toast.error("Please select an employee and add at least one product.");
      return;
    }

    const stockOutData = {
      stock_out_date: selectedDate || stockOutDate,
      stockOutProducts,
      employee_id: selectedEmployee,
    };

    try {
      setLoading(true);
      await createStockOut(stockOutData);
      toast.success("Stock out recorded successfully.");

      // Reset the rows and other fields
      resetRows();
      setStockOutDate(adjustToLocalTime());
      setSelectedEmployee("");
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
          <div className="flex flex-row justify-between">
            <div className="flex flex-col px-6 pt-4 w-full gap-2">
              {/* Employee Dropdown */}
              <div className="flex flex-row justify-between items-center">
                <label className="font-bold w-[30%]" htmlFor="employee">
                  Employee:
                </label>
                <div className="relative w-[85%]">
                  <select
                    id="employee"
                    name="employee"
                    value={selectedEmployee}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    className="w-full h-8 px-4 appearance-none border rounded-md bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option
                        key={employee.employee_id}
                        value={employee.employee_id}
                      >
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                  <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Stock Out Date */}
              <div className="flex flex-row justify-between items-center">
                <label className="font-bold w-[30%]" htmlFor="stock_out_date">
                  Stock Out Date:
                </label>
                <input
                  type="datetime-local"
                  name="stock_out_date"
                  id="stock_out_date"
                  value={selectedDate || stockOutDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700"
                />
              </div>
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
