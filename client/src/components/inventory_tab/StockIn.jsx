import React, { Fragment, useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import StockInTable from "./StockInTable";
import { getAllSuppliers, getSupplier } from "../../api/suppliers"; // Mock API functions
import { getAllProductVariations } from "../../api/products"; // Mock data
import { createStockIn } from "../../api/stockIn"; // API for creating stock in
import { getEmployees } from "../../api/employees"; // Mock API functions
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
  const [stockInDate, setStockInDate] = useState(
    new Date().toISOString().substring(0, 10), // Defaults to current date
  );
  const [stockInProducts, setStockInProducts] = useState([]); // Store stock-in products

  // Fetch employee, supplier, and product variation data on component mount
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

  const handleSupplierChange = async (supplierId) => {
    setSelectedSupplier(supplierId);
    if (supplierId) {
      const details = await getSupplier(supplierId); // Fetch supplier details
      setSupplierDetails(details);
    }
  };

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const handleSubmitStockIn = async () => {
    if (!selectedSupplier || stockInProducts.length === 0) {
      alert("Please select a supplier and add at least one product.");
      return;
    }

    const stockInData = {
      supplier_id: selectedSupplier,
      reference_number: referenceNumber,
      stock_in_date: stockInDate,
      stockInProducts,
    };

    try {
      await createStockIn(stockInData);
      alert("Stock In recorded successfully");
      // Reset form fields
      setStockInProducts([]);
      setStockInDate(new Date().toISOString().substring(0, 10));
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
    { key: "type", header: "Type" },
    { key: "value", header: "Value" },
    { key: "sku", header: "SKU" },
    { key: "quantity", header: "Qty." },
    { key: "stock_in_date", header: "Stock In Date" },
    { key: "supplier", header: "Supplier" },
  ];

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
                type="date"
                name="stock_in_date"
                id="stock_in_date"
                value={stockInDate}
                onChange={(e) => setStockInDate(e.target.value)}
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* Supplier Dropdown */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="supplier_name">
                Supplier:
              </label>
              <div className="relative w-[85%]">
                <select
                  id="supplier_name"
                  name="supplier_name"
                  value={selectedSupplier}
                  onChange={(e) => handleSupplierChange(e.target.value)}
                  className="w-full h-8 px-4 appearance-none border rounded-md bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.supplier_id}
                      value={supplier.supplier_id}
                    >
                      {supplier.supplier_name}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
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
        setStockInProducts={setStockInProducts} // Pass setter to manage stock-in products
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
