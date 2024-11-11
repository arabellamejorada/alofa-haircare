import React, { Fragment, useEffect, useState } from "react";
import ConfirmModal from "../shared/ConfirmModal";
import { MdAddBox, MdEditDocument } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  IoMdArrowDropdownCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import VoucherModal from "./VoucherModal";
import VariationsModal from "./VariationsModal";
import {
  createVoucher,
  getAllVouchers,
  getVoucherProductVariations,
  updateVoucher,
  deleteVoucher,
  manageVoucherVariations,
} from "../../api/voucher";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [errors, setErrors] = useState({});

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("voucher_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isActiveFilter, setIsActiveFilter] = useState("");

  const [expandedRows, setExpandedRows] = useState([]);
  const [variations, setVariations] = useState({});

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const [variationsModalOpen, setVariationsModalOpen] = useState(false);
  const [currentVoucherVariations, setCurrentVoucherVariations] = useState([]);
  const [currentVoucherId, setCurrentVoucherId] = useState(null);

  // Voucher state
  const [voucherData, setVoucherData] = useState({
    code: "",
    type: "",
    discount_value: "",
    min_spend: "",
    max_discount: "",
    total_limit: "",
    max_use_per_user: "",
    is_active: true,
    valid_from: "",
    valid_until: "",
    discount_scope: "",
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const vouchersData = await getAllVouchers();
      setVouchers(vouchersData);
    } catch (error) {
      toast.error("Failed to fetch vouchers");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductVariations = async (selectedVoucher) => {
    console.log(selectedVoucher);
    try {
      const response = await getVoucherProductVariations(selectedVoucher);
      setVariations((prevVariations) => ({
        ...prevVariations,
        [selectedVoucher]: response,
      }));
    } catch (error) {
      toast.error("Failed to fetch product variations");
    }
  };

  const toggleRow = (voucherId) => {
    if (expandedRows.includes(voucherId)) {
      setExpandedRows(expandedRows.filter((id) => id !== voucherId));
    } else {
      setExpandedRows([...expandedRows, voucherId]);
      if (!variations[voucherId] || variations[voucherId].length === 0) {
        fetchProductVariations(voucherId);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!voucherData.code) validationErrors.code = "Voucher code is required";
    if (!voucherData.type) validationErrors.type = "Voucher type is required";
    if (voucherData.discount_value <= 0)
      validationErrors.discount_value = "Discount value must be greater than 0";
    if (!voucherData.discount_scope)
      validationErrors.discount_scope = "Discount scope is required";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    try {
      setLoading(true);
      if (selectedVoucher) {
        await updateVoucher(selectedVoucher.voucher_id, voucherData);
        toast.success("Voucher updated successfully.");
      } else {
        await createVoucher(voucherData);
        toast.success("Voucher created successfully.");
      }
      handleCloseModal();
      fetchVouchers();
    } catch (error) {
      toast.error("Error saving voucher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucherId) => {
    console.log("delete voucher", voucherId);
    setConfirmMessage(
      `Are you sure you want to delete the voucher "${selectedVoucher.code}"?`,
    );
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        await deleteVoucher(selectedVoucher.voucher_id);
        toast.success("Voucher deleted successfully.");
        fetchVouchers();
      } catch (error) {
        toast.error("Error deleting voucher. Please try again.");
      } finally {
        setLoading(false);
        setIsConfirmModalOpen(false);
        handleCloseModal();
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVoucher(null);
    setVoucherData({
      code: "",
      type: "",
      discount_value: "",
      min_spend: "",
      max_discount: "",
      total_limit: "",
      max_use_per_user: "",
      is_active: true,
      valid_from: "",
      valid_until: "",
      discount_scope: "",
    });
    setErrors({});
  };

  const openModal = (voucher = null) => {
    if (voucher) {
      setSelectedVoucher(voucher);
      setVoucherData({
        ...voucher,
      });
    } else {
      setSelectedVoucher(null);
      setVoucherData({
        code: "",
        type: "",
        discount_value: "",
        min_spend: "",
        max_discount: "",
        total_limit: "",
        max_use_per_user: "",
        is_active: true,
        valid_from: "",
        valid_until: "",
        discount_scope: "",
      });
    }
    setShowModal(true);
  };

  const handleEditVoucherVariations = (voucherId) => {
    setCurrentVoucherId(voucherId);
    setCurrentVoucherVariations(variations[voucherId] || []);
    setVariationsModalOpen(true);
  };

  const saveVoucherVariations = async (selectedVariations) => {
    try {
      setLoading(true);
      // Save the variations
      await manageVoucherVariations(currentVoucherId, selectedVariations);

      // Fetch updated variations with full details
      const updatedVariations =
        await getVoucherProductVariations(currentVoucherId);

      // Update the state with full variation details
      setVariations((prevVariations) => ({
        ...prevVariations,
        [currentVoucherId]: updatedVariations,
      }));

      setVariationsModalOpen(false);
      setCurrentVoucherId(null);
      toast.success("Voucher variations updated successfully.");
    } catch (error) {
      toast.error("Failed to update voucher variations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = (key, label) => (
    <div
      onClick={() => handleColumnSort(key)}
      className="flex items-center cursor-pointer"
    >
      {label}
      {sortField === key && (
        <span className="ml-1">
          {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </span>
      )}
    </div>
  );

  const columns = [
    { key: "voucher_id", header: renderHeader("voucher_id", "ID") },
    { key: "code", header: renderHeader("code", "Code") },
    { key: "type", header: renderHeader("type", "Type") },
    {
      key: "discount_value",
      header: renderHeader("discount_value", "Discount Value"),
    },
    {
      key: "is_active",
      header: renderHeader("is_active", "Active"),
      render: (isActive) => (isActive ? "Yes" : "No"),
    },

    {
      key: "discount_scope",
      header: renderHeader("discount_scope", "Discount Scope"),
    },
  ];

  const variationColumns = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Product Name" },
    { key: "value", header: "Variation" },
    { key: "unit_price", header: "Unit Price" },
  ];

  const filteredVouchers = vouchers
    .filter(
      (voucher) =>
        voucher.code.toLowerCase().includes(search) &&
        (isActiveFilter === "" ||
          voucher.is_active === (isActiveFilter === "true")),
    )
    .sort((a, b) => {
      if (sortField) {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        const isNumeric = !isNaN(aValue) && !isNaN(bValue);
        return sortOrder === "asc"
          ? isNumeric
            ? parseFloat(aValue) - parseFloat(bValue)
            : aValue > bValue
              ? 1
              : -1
          : isNumeric
            ? parseFloat(bValue) - parseFloat(aValue)
            : aValue < bValue
              ? 1
              : -1;
      }
      return 0;
    });

  return (
    <>
      <div className="relative">
        {/* Loader */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}

        {/* Main content */}
        <div className="container mx-auto">
          <strong className="text-3xl font-bold text-gray-500">Vouchers</strong>

          {/* Filters Section */}
          <div className="flex items-center justify-between mt-4 flex-nowrap">
            {/* Left Side Filters */}
            <div className="flex items-center space-x-4">
              {/* Search input */}
              <input
                type="text"
                className="w-full max-w-md h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                placeholder="Search by code"
                value={search}
                onChange={handleSearchChange}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-sm text-alofa-pink hover:text-alofa-dark"
                >
                  Clear
                </button>
              )}
              {/* Status filter */}
              <select
                value={isActiveFilter}
                onChange={(e) => setIsActiveFilter(e.target.value)}
                className="h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {isActiveFilter !== "" && (
                <button
                  onClick={() => setIsActiveFilter("")}
                  className="ml-2 text-alofa-pink hover:text-alofa-dark"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Right Side Add Voucher Button */}
            <MdAddBox
              fontSize={40}
              className="text-gray-400 hover:text-alofa-highlight active:text-alofa-pink cursor-pointer"
              onClick={() => openModal()}
            />
          </div>

          {/* Voucher Table */}
          <table className="min-w-full bg-white mt-4 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-3 py-2 border-b-2 border-gray-200 bg-alofa-pink text-white text-left text-sm font-semibold"
                    onClick={() => handleColumnSort(column.key)}
                  >
                    {column.header}
                  </th>
                ))}
                <th className="px-3 py-2 border-b-2 border-gray-200 bg-alofa-pink text-white text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map((voucher) => (
                <Fragment key={voucher.voucher_id}>
                  <tr>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-5 py-3 border-b ${
                          column.key === "discount_value" ? "text-right" : ""
                        }`}
                      >
                        {column.key === "is_active"
                          ? voucher.is_active
                            ? "Yes"
                            : "No"
                          : column.key === "discount_value"
                            ? voucher.type === "flat"
                              ? `₱${new Intl.NumberFormat("en-PH", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(voucher.discount_value)}`
                              : `${voucher.discount_value}%`
                            : voucher[column.key] || "N/A"}
                      </td>
                    ))}
                    <td className="text-center border-b py-2">
                      <button
                        className="text-alofa-pink hover:text-alofa-dark"
                        onClick={() => openModal(voucher)}
                        tabIndex={0}
                        aria-label="Edit"
                      >
                        <MdEditDocument fontSize={24} />
                      </button>
                      <button
                        onClick={() => toggleRow(voucher.voucher_id)}
                        className="focus:outline-none"
                      >
                        {expandedRows.includes(voucher.voucher_id) ? (
                          <IoMdArrowDropdownCircle
                            fontSize={24}
                            className="text-alofa-pink hover:text-alofa-dark"
                          />
                        ) : (
                          <IoMdArrowDroprightCircle
                            fontSize={24}
                            className="text-alofa-pink hover:text-alofa-dark"
                          />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded details row */}
                  {expandedRows.includes(voucher.voucher_id) && (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="bg-gray-50 p-4 shadow-inner"
                      >
                        <div className="grid grid-cols-3 gap-y-1 gap-x-4 text-gray-700 text-xs font-semibold p-2 border-b border-gray-200">
                          <div>
                            Max Use Per User: {voucher.max_use_per_user}
                          </div>

                          <div>
                            Min Spend: ₱
                            {Number(voucher.min_spend).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>

                          <div>Valid From: {voucher.valid_from}</div>
                          <div>Usage Limit: {voucher.total_limit}</div>
                          <div>
                            Max Discount:
                            {voucher.max_discount
                              ? ` ₱${Number(
                                  voucher.max_discount,
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : " N/A"}
                          </div>
                          <div>Valid Until: {voucher.valid_until}</div>
                        </div>

                        {voucher.discount_scope === "product_variation" && (
                          <div>
                            <strong className="text-sm font-semibold text-gray-700 mb-2 block">
                              Product Variations Applicable for {voucher.code}
                            </strong>
                            <button
                              type="button"
                              className="px-4 py-1 mb-2 bg-alofa-pink text-white rounded-md hover:bg-alofa-dark"
                              onClick={() =>
                                handleEditVoucherVariations(voucher.voucher_id)
                              }
                            >
                              Add/Remove Variations
                            </button>

                            <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow-md">
                              <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                  <th className="px-3 py-2 text-left text-sm font-semibold">
                                    Index
                                  </th>
                                  {variationColumns.map((col) => (
                                    <th
                                      key={col.key}
                                      className="px-3 py-2 text-left text-sm font-semibold"
                                    >
                                      {col.header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(variations[voucher.voucher_id] || []).map(
                                  (variation, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-3 py-2 border-b text-center">
                                        {index + 1}
                                      </td>
                                      {variationColumns.map((col) => (
                                        <td
                                          key={col.key}
                                          className="px-3 py-2 border-b text-gray-800"
                                        >
                                          {col.key === "unit_price" &&
                                          variation[col.key] !== undefined
                                            ? `₱${Number(
                                                variation[col.key],
                                              ).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              })}`
                                            : variation[col.key] || "N/A"}
                                        </td>
                                      ))}
                                    </tr>
                                  ),
                                )}
                                {(variations[voucher.voucher_id] || [])
                                  .length === 0 && (
                                  <tr>
                                    <td
                                      colSpan={variationColumns.length + 1}
                                      className="px-3 py-2 text-center text-gray-500"
                                    >
                                      No variations added yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>

          {/* Modals */}
          <VoucherModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            onDelete={handleDeleteVoucher}
            voucherData={voucherData}
            setVoucherData={setVoucherData}
            selectedVoucher={selectedVoucher}
            errors={errors}
          />

          <VariationsModal
            isOpen={variationsModalOpen}
            onClose={() => setVariationsModalOpen(false)}
            voucherVariations={currentVoucherVariations}
            onSave={saveVoucherVariations}
          />

          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={() => confirmAction()}
            message={confirmMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Voucher;
