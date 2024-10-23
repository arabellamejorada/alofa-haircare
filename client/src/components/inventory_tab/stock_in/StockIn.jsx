import React, { useEffect, useState, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import StockInTable from "./StockInTable";
import { getAllSuppliers, getSupplier } from "../../../api/suppliers";
import { getAllProductVariations } from "../../../api/products";
import { createStockIn } from "../../../api/stockIn";
import { getEmployees } from "../../../api/employees";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { validateDropdown } from "../../../lib/consts/utils/validationUtils";

const StockIn = () => {
  const supplierInputRef = useRef(null);
  const supplierDropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
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
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
  });

  const [stockInProducts, setStockInProducts] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [isSupplierDropdownVisible, setIsSupplierDropdownVisible] =
    useState(false);

  const [errors, setErrors] = useState({
    employee: false,
    supplier: false,
    products: stockInProducts.map(() => ({
      variation: false,
      quantity: false,
    })),
  });

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const employeeData = await getEmployees();
      let supplierData = await getAllSuppliers();
      const productVariationsData = await getAllProductVariations();

      // Only show active suppliers
      supplierData = supplierData.filter(
        (supplier) => supplier.status.toLowerCase() === "active",
      );
      setEmployees(employeeData);
      setSuppliers(supplierData);
      setProductVariations(productVariationsData);
      generateReferenceNumber();
      setLoading(false);
    };
    loadData();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetRows = () => {
    setStockInProducts([]);
    setStockInDate(() => {
      const date = new Date();
      const offset = date.getTimezoneOffset();
      return new Date(date.getTime() - offset * 60000)
        .toISOString()
        .slice(0, 16);
    });
    setSelectedSupplier("");
    setSelectedEmployee("");
    setSupplierDetails({
      contact_person: "",
      contact_number: "",
      email: "",
      address: "",
    });
    setSupplierSearch("");

    generateReferenceNumber();
  };

  const generateReferenceNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    setReferenceNumber(`REF-${randomNumber}`);
  };

  const handleClickOutside = (event) => {
    const isClickInsideSupplierDropdown =
      supplierDropdownRef.current &&
      supplierDropdownRef.current.contains(event.target);
    const isClickInsideSupplierInput =
      supplierInputRef.current &&
      supplierInputRef.current.contains(event.target);

    if (!isClickInsideSupplierDropdown && !isClickInsideSupplierInput) {
      setTimeout(() => {
        setIsSupplierDropdownVisible(false);
      }, 300);
    }
  };

  const handleSupplierChange = async (supplierId, supplierName) => {
    setLoading(true);
    setSelectedSupplier(supplierId);
    setSupplierSearch(supplierName);
    setIsSupplierDropdownVisible(false);

    // Update validation state
    setErrors((prevErrors) => ({
      ...prevErrors,
      supplier: !validateDropdown(supplierId),
    }));

    if (supplierId) {
      const details = await getSupplier(supplierId);
      setSupplierDetails(details);
    }
    setLoading(false);
  };

  const handleSubmitStockIn = async () => {
    // Validate product variations
    const productErrors = stockInProducts.map((row) => ({
      variation: !validateDropdown(row.variation_id),
      quantity: row.quantity <= 0,
    }));

    // Validate supplier
    const supplierError = !validateDropdown(selectedSupplier);

    // Update the error state
    setErrors({
      ...errors,
      supplier: supplierError,
      products: productErrors,
    });

    // Check if there are any errors
    const hasErrors =
      supplierError ||
      productErrors.some((err) => err.variation || err.quantity);

    if (hasErrors) {
      toast.error("Please fill in all required fields correctly.");
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
      setLoading(true);
      await createStockIn(stockInData);
      toast.success("Stock In recorded successfully");

      resetRows(); // Reset rows and state after successful submission
    } catch (error) {
      console.error("Error saving stock in:", error);
      toast.error("An error occurred while saving stock in.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "product_name", header: "Product Name" },
    { key: "variation", header: "Variation" },
    { key: "sku", header: "SKU" },
    { key: "quantity", header: "Qty." },
    { key: "stock_in_date", header: "Stock In Date" },
    { key: "supplier", header: "Supplier" },
  ];

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_name
      ?.toLowerCase()
      .includes(supplierSearch.toLowerCase()),
  );

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

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
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>
            {/* Employee */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="employee">
                Employee:
              </label>
              <div className="relative w-[85%]">
                <select
                  id="employee"
                  name="employee"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
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

            {/* Supplier */}
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
                    setIsSupplierDropdownVisible(true);
                  }}
                  onFocus={() => setIsSupplierDropdownVisible(true)}
                  className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white ${
                    errors.supplier ? "border-red-500" : "border-slate-300"
                  }`}
                  ref={supplierInputRef}
                />
                {errors.supplier && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a supplier
                  </p>
                )}

                {isSupplierDropdownVisible && (
                  <div
                    ref={supplierDropdownRef}
                    className="absolute left-0 right-0 top-full bg-white border border-slate-300 rounded-md z-10 max-h-40 overflow-y-auto"
                  >
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

                {supplierSearch && (
                  <button
                    onClick={() => {
                      setSupplierSearch("");
                      setSelectedSupplier("");
                      setSupplierDetails({
                        contact_person: "",
                        contact_number: "",
                        email: "",
                        address: "",
                      });
                      setIsSupplierDropdownVisible(false);

                      // Set the error state for supplier
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        supplier: true,
                      }));
                    }}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-pink-500"
                    aria-label="Clear supplier search"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col px-6 pt-4 w-full gap-2">
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

        <StockInTable
          columns={columns}
          productVariations={productVariations}
          stockInProducts={stockInProducts}
          setStockInProducts={setStockInProducts}
          errors={errors.products}
          setErrors={(updatedErrors) => {
            setErrors((prevErrors) => ({
              ...prevErrors,
              products: updatedErrors,
            }));
          }}
        />

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
      </div>
    </div>
  );
};

export default StockIn;
