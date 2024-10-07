import React, { Fragment, useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import StockInTable from "./StockInTable";
import { getAllSuppliers, getSupplier } from "../../../api/suppliers";
import { getAllProductVariations } from "../../../api/products";
import { createStockIn } from "../../../api/stockIn";
import { getEmployees } from "../../../api/employees";
import { Link } from "react-router-dom";

const StockIn = () => {
  const [employees, setEmployees] = useState([]);
  const [productVariations, setProductVariations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState({
    contact_person: "",
    contact_number: "",
    email: "",
    address: "",
  });

  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [stockInDate, setStockInDate] = useState(() => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  });

  const [stockInProducts, setStockInProducts] = useState([]);

  const [supplierSearch, setSupplierSearch] = useState(""); // Supplier search input
  const [isSupplierDropdownVisible, setIsSupplierDropdownVisible] =
    useState(false); // Control visibility

  useEffect(() => {
    const loadData = async () => {
      const employeeData = await getEmployees();
      const supplierData = await getAllSuppliers();
      const productVariationsData = await getAllProductVariations();
      setEmployees(employeeData);
      setSuppliers(supplierData);
      setProductVariations(productVariationsData);
      generateReferenceNumber();
    };
    loadData();
  }, []);

  // Auto-generate reference number
  const generateReferenceNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    setReferenceNumber(`REF-${randomNumber}`);
  };

  const handleSupplierChange = async (supplierId, supplierName) => {
    setSelectedSupplier(supplierId);
    setSupplierSearch(supplierName); // Update the input with the selected supplier's name
    setIsSupplierDropdownVisible(false); // Hide the dropdown after selection
    if (supplierId) {
      const details = await getSupplier(supplierId);
      setSupplierDetails(details);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  // Adjust stock-in date to local timezone
  const adjustToLocalTime = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000); // Adjust to local timezone
    return localDate.toISOString().slice(0, 16);
  };

  const handleSubmitStockIn = async () => {
    if (
      !selectedEmployee ||
      !selectedSupplier ||
      stockInProducts.length === 0
    ) {
      alert("Please select a supplier and add at least one product.");
      return;
    }

    const stockInData = {
      supplier_id: selectedSupplier,
      employee_id: selectedEmployee,
      reference_number: referenceNumber,
      stock_in_date: selectedDate || stockInDate,
      stockInProducts,
    };

    try {
      await createStockIn(stockInData);
      alert("Stock In recorded successfully");
      // Reset form fields
      setStockInProducts([]);
      setStockInDate(adjustToLocalTime());
      setSelectedSupplier("");
      setSelectedEmployee("");
      setSupplierDetails({
        contact_person: "",
        contact_number: "",
        email: "",
        address: "",
      });
      generateReferenceNumber();
    } catch (error) {
      console.error("Error saving stock in:", error);
      alert("An error occurred while saving stock in.");
    }
  };

  const columns = [
    { key: "product_name", header: "Product Name" },
    // { key: "type", header: "Type" },
    // { key: "value", header: "Value" },
    { key: "sku", header: "SKU" },
    { key: "quantity", header: "Qty." },
    { key: "stock_in_date", header: "Stock In Date" },
    { key: "supplier", header: "Supplier" },
  ];

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(supplierSearch.toLowerCase()),
  );

  return (
    <Fragment>
      <div className="flex flex-col">
        <strong className="text-3xl font-bold text-gray-500">Stock In</strong>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col px-6 pt-4 w-full gap-2">
            {/* Reference Number */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="reference_number">
                Reference Number:
              </label>
              <input
                type="text"
                name="reference_number"
                id="reference_number"
                value={referenceNumber}
                readOnly
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 border-slate-300 text-slate-700"
              />
            </div>

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
                  className="w-full h-8 px-4 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
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

            {/* Stock In Date */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="stock_in_date">
                Stock In Date:
              </label>
              <input
                type="datetime-local"
                name="stock_in_date"
                id="stock_in_date"
                value={selectedDate || stockInDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* Supplier Searchable Dropdown */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="supplier_search">
                Supplier:
              </label>
              <div className="relative w-[85%]">
                <input
                  type="text"
                  placeholder="Search Supplier"
                  value={supplierSearch}
                  onChange={(e) => {
                    setSupplierSearch(e.target.value);
                    setIsSupplierDropdownVisible(true); // Show dropdown when typing
                  }}
                  onFocus={() => setIsSupplierDropdownVisible(true)} // Show dropdown when input is focused
                  className="w-full h-8 px-4 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                />
                {isSupplierDropdownVisible && (
                  <div className="absolute left-0 right-0 top-full bg-white border border-slate-300 rounded-md z-10 max-h-40 overflow-y-auto">
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <div
                          key={supplier.supplier_id}
                          onClick={() =>
                            handleSupplierChange(
                              supplier.supplier_id,
                              supplier.supplier_name,
                            )
                          }
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {supplier.supplier_name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No suppliers found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col px-6 pt-4 w-full gap-2">
            {/* Auto-fill supplier details */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="contact_person">
                Contact Person:
              </label>
              <input
                type="text"
                name="contact_person"
                id="contact_person"
                value={supplierDetails.contact_person}
                readOnly
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="contact_number">
                Contact Number:
              </label>
              <input
                type="text"
                name="contact_number"
                id="contact_number"
                value={supplierDetails.contact_number}
                readOnly
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="address">
                Address:
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={supplierDetails.address}
                readOnly
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="email">
                Email:
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={supplierDetails.email}
                readOnly
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 border-slate-300 text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock In Table */}
      <StockInTable
        columns={columns}
        productVariations={productVariations}
        stockInProducts={stockInProducts}
        setStockInProducts={setStockInProducts}
      />

      {/* Submit Button */}
      <div className="flex flex-row mt-4 gap-2">
        <button
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          onClick={handleSubmitStockIn}
        >
          Save
        </button>

        <Link to="/stockinhistory">
          <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
            View History
          </button>
        </Link>
      </div>
    </Fragment>
  );
};

export default StockIn;
