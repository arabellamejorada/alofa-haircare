import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import ConfirmModal from "../shared/ConfirmModal";
import { MdAddBox } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Modal from "../modal/Modal";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import {
  createVoucher,
  getAllVouchers,
  updateVoucher,
  deleteVoucher,
} from "../../api/voucher";
import { render } from "react-dom";

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
    expiration_date: "",
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

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

  const validateForm = () => {
    const validationErrors = {};
    if (!voucherData.code) validationErrors.code = "Voucher code is required";
    if (!voucherData.type) validationErrors.type = "Voucher type is required";
    if (voucherData.discount_value <= 0)
      validationErrors.discount_value = "Discount value must be greater than 0";
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

  const handleDeleteVoucher = async (voucher) => {
    setConfirmMessage(
      `Are you sure you want to delete the voucher "${voucher.code}"?`,
    );
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        await deleteVoucher(voucher.voucher_id);
        toast.success("Voucher deleted successfully.");
        fetchVouchers();
      } catch (error) {
        toast.error("Error deleting voucher. Please try again.");
      } finally {
        setLoading(false);
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirm = () => {
    if (confirmAction) confirmAction();
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
      expiration_date: "",
    });
    setErrors({});
  };

  const openModal = (voucher = null) => {
    if (voucher) {
      setSelectedVoucher(voucher);
      setVoucherData(voucher);
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
        expiration_date: "",
      });
    }
    setShowModal(true);
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
      isNumeric: true,
    },
    {
      key: "min_spend",
      header: renderHeader("min_spend", "Min Spend"),
      isNumeric: true,
    },
    {
      key: "max_discount",
      header: renderHeader("max_discount", "Max Discount"),
      isNumeric: true,
    },
    {
      key: "total_limit",
      header: renderHeader("total_limit", "Usage Limit"),
      isNumeric: true,
    },

    {
      key: "max_use_per_user",
      header: renderHeader("max_use_per_user", "Max Use/User"),
      isNumeric: true,
    },
    {
      key: "current_uses",
      header: renderHeader("current_uses", "Current Uses"),
      isNumeric: true,
    },
    {
      key: "is_active",
      header: renderHeader("is_active", "Active"),
      render: (isActive) => (isActive ? "Yes" : "No"),
    },
    {
      key: "expiration_date",
      header: renderHeader("expiration_date", "Expiration Date"),
    },
  ];

  return (
    <Fragment>
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
            <ClipLoader size={50} color="#E53E3E" loading={loading} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <strong className="text-3xl font-bold text-gray-500">Vouchers</strong>

          <div className="flex flex-row justify-between mt-4 gap-4">
            {/* Search and isActive Filter */}
            <div className="flex flex-row gap-4 items-center w-[500px]">
              {/* Search Input */}
              <div className="relative flex items-center w-[300px]">
                <input
                  type="text"
                  className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                  placeholder="Search by code"
                  value={search}
                  onChange={handleSearchChange}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 text-alofa-pink hover:text-alofa-dark"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* isActive Filter */}
              <div className="relative flex items-center w-[200px]">
                <select
                  value={isActiveFilter}
                  onChange={(e) => setIsActiveFilter(e.target.value)}
                  className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
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
            </div>

            <MdAddBox
              fontSize={40}
              className="text-gray-400 mx-2 hover:text-alofa-highlight active:text-alofa-pink"
              onClick={() => openModal()}
            />
          </div>

          <DataTable
            data={filteredVouchers}
            columns={columns}
            onEdit={openModal}
            onDelete={handleDeleteVoucher}
            isEmployee={true}
          />
        </div>

        <Modal isVisible={showModal} onClose={handleCloseModal}>
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="font-extrabold text-3xl text-alofa-highlight mb-4">
              {selectedVoucher ? "Edit Voucher" : "Add New Voucher"}
            </div>

            {/* Code Input (Single Column) */}
            <div className="flex flex-col mb-4">
              <label className="font-bold" htmlFor="code">
                Code
              </label>
              <input
                type="text"
                name="code"
                id="code"
                placeholder="Voucher Code"
                value={voucherData.code}
                onChange={handleInputChange}
                className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>

            {/* Two-Column Layout for Other Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="type">
                  Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={voucherData.type}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                >
                  <option value="">Select Type</option>
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                )}
              </div>

              {/* Discount Value Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="discount_value">
                  Discount Value
                </label>
                <input
                  type="number"
                  name="discount_value"
                  id="discount_value"
                  placeholder="Discount Value"
                  value={voucherData.discount_value}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                />
                {errors.discount_value && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.discount_value}
                  </p>
                )}
              </div>

              {/* Min Spend Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="min_spend">
                  Min. Spend
                </label>
                <input
                  type="number"
                  name="min_spend"
                  id="min_spend"
                  placeholder="Min Spend"
                  value={voucherData.min_spend}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                />
                {errors.min_spend && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.min_spend}
                  </p>
                )}
              </div>

              {/* Max Discount Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="max_discount">
                  Max. Discount
                </label>
                <input
                  type="number"
                  name="max_discount"
                  id="max_discount"
                  placeholder="Max Discount"
                  value={voucherData.max_discount}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                  disabled={voucherData.type === "flat"} // Disable if type is flat
                />
                {errors.max_discount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.max_discount}
                  </p>
                )}
              </div>

              {/* Total Limit Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="total_limit">
                  Usage Limit
                </label>
                <input
                  type="number"
                  name="total_limit"
                  id="total_limit"
                  placeholder="Total Limit"
                  value={voucherData.total_limit}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                />
                {errors.total_limit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.total_limit}
                  </p>
                )}
              </div>

              {/* Max Use Per User Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="max_use_per_user">
                  Max. Use Per User
                </label>
                <input
                  type="number"
                  name="max_use_per_user"
                  id="max_use_per_user"
                  placeholder="Max Use Per User"
                  value={voucherData.max_use_per_user}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                />
                {errors.max_use_per_user && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.max_use_per_user}
                  </p>
                )}
              </div>

              {/* Is Active Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="is_active">
                  Is Active
                </label>
                <select
                  name="is_active"
                  id="is_active"
                  value={voucherData.is_active}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                >
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </div>

              {/* Expiration Date Input */}
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="expiration_date">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expiration_date"
                  id="expiration_date"
                  value={voucherData.expiration_date}
                  onChange={handleInputChange}
                  className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
                />
                {errors.expiration_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expiration_date}
                  </p>
                )}
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex flex-row justify-end gap-4 mt-6">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-alofa-highlight rounded-lg hover:bg-alofa-pink"
              >
                {selectedVoucher ? "Update Voucher" : "Add Voucher"}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleConfirmClose}
          onConfirm={handleConfirm}
          message={confirmMessage}
        />
      </div>
    </Fragment>
  );
};

export default Voucher;
