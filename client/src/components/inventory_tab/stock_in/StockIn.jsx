import React, { useEffect, useState, useRef } from "react";
import StockInTable from "./StockInTable";
import { getAllSuppliers, getSupplier } from "../../../api/suppliers";
import { getAllProductVariations } from "../../../api/products";
import { createStockIn } from "../../../api/stockIn";
import { getEmployeeIdByProfileId } from "../../../api/employees";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { validateDropdown } from "../../../lib/consts/utils/validationUtils";
import { useAuth } from "../../AuthContext";

const StockIn = () => {
  const { user } = useAuth();
  const supplierInputRef = useRef(null);
  const supplierDropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [productVariations, setProductVariations] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState({
    contact_person: "",
    contact_number: "",
    email: "",
    address: "",
  });

  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
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
      try {
        const supplierData = await getAllSuppliers();
        const productVariationsData = await getAllProductVariations();
        const employeeId = parseInt(
          await getEmployeeIdByProfileId(user.id),
          10,
        );

        // Only show active suppliers
        setSuppliers(
          supplierData.filter(
            (supplier) => supplier.status.toLowerCase() === "active",
          ),
        );
        setProductVariations(productVariationsData);
        setEmployeeId(employeeId);
        generateReferenceNumber();
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user.id]);

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
    setEmployeeId("");
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
    const productErrors = stockInProducts.map((row) => ({
      variation: !validateDropdown(row.variation_id),
      quantity: row.quantity <= 0,
    }));
    const supplierError = !validateDropdown(selectedSupplier);

    setErrors({
      ...errors,
      supplier: supplierError,
      products: productErrors,
    });

    if (supplierError) {
      console.error("Supplier validation error");
    }

    if (productErrors.some((err) => err.variation || err.quantity)) {
      console.error("Product variation or quantity validation error");
    }

    const hasErrors =
      supplierError ||
      productErrors.some((err) => err.variation || err.quantity);
    if (hasErrors) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    const stockInData = {
      supplier_id: selectedSupplier,
      employee_id: employeeId,
      reference_number: referenceNumber,
      stock_in_date: selectedDate || stockInDate,
      stockInProducts,
    };

    console.log("Stock In Data:", stockInData);
    try {
      setLoading(true);
      await createStockIn(stockInData);
      toast.success("Stock In recorded successfully");
      resetRows();
    } catch (error) {
      console.error("Error saving stock in:", error.message);
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
                className="rounded-md border w-[85%] h-8 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* Employee: Display logged-in employee info */}
            <div className="flex flex-row justify-between items-center">
              <label className="font-bold w-[30%]" htmlFor="employee">
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
              <span className="w-[85%] h-8 pl-4 flex items-center bg-gray-50 rounded-md border border-slate-300 text-slate-700">
                {user ? `${user.first_name} ${user.last_name}` : ""}
              </span>
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
                  className={`rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-alofa-pink hover:bg-white ${
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
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-alofa-pink"
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
            className="px-4 py-2 bg-alofa-pink text-white rounded hover:bg-alofa-dark"
            onClick={handleSubmitStockIn}
          >
            Save
          </button>

          <Link to="/stockinhistory">
            <button className="px-4 py-2 bg-alofa-pink text-white rounded hover:bg-alofa-dark">
              View History
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StockIn;
