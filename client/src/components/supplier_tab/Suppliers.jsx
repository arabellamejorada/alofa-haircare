import React, { Fragment, useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  archiveSupplier,
} from "../../api/suppliers.js";
import SupplierTable from "./SupplierTable";
import SupplierForm from "./SupplierForm";
import { toast } from "sonner";
import {
  validateSupplierForm,
  validateName,
  validateEmail,
  validateContactNumber,
  validateAddress,
  validateStatus,
} from "../../lib/consts/utils/validationUtils";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [originalSupplierData, setOriginalSupplierData] = useState(null); // Track original data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("supplier_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedStatus, setSelectedStatus] = useState(""); // Status filter state

  // Supplier form fields
  const [supplierFormData, setSupplierFormData] = useState({
    supplier_name: "",
    contact_person: "",
    contact_number: "",
    email: "",
    address: "",
    status: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const suppliersData = await getAllSuppliers();
        setSuppliers(suppliersData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setSupplierFormData({
      supplier_name: "",
      contact_person: "",
      contact_number: "",
      email: "",
      address: "",
      status: "",
    });
    setErrors({});
    setSelectedSupplier(null);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "supplier_name":
      case "contact_person":
        error = validateName(value)
          ? ""
          : `${name.replace("_", " ")} is required`;
        break;
      case "contact_number":
        error = validateContactNumber(value)
          ? ""
          : "Enter a valid 11-digit phone number";
        break;
      case "email":
        error = validateEmail(value) ? "" : "Enter a valid email address";
        break;
      case "address":
        error = validateAddress(value) ? "" : "Address is required";
        break;
      case "status":
        error = validateStatus(value) ? "" : "Status is required";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value); // Validate the field as user types
  };

  const validateForm = () => {
    const formErrors = validateSupplierForm(supplierFormData);
    setErrors(formErrors);
    return !Object.values(formErrors).some((error) => error !== "");
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    try {
      await createSupplier(supplierFormData);
      const updatedSuppliers = await getAllSuppliers();
      setSuppliers(updatedSuppliers);
      toast.success("Supplier added successfully!");
      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to add supplier");
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    if (!selectedSupplier) return;
    try {
      await updateSupplier(selectedSupplier.supplier_id, supplierFormData);
      const updatedSuppliers = await getAllSuppliers();
      setSuppliers(updatedSuppliers);
      toast.success("Supplier updated successfully");
      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to update supplier");
    }
  };

  const handleArchiveSupplier = async (supplier) => {
    if (!supplier) return;
    if (window.confirm("Are you sure you want to archive this supplier?")) {
      try {
        await archiveSupplier(supplier.supplier_id);
        const updatedSuppliers = await getAllSuppliers();
        setSuppliers(updatedSuppliers);
        toast.success("Supplier archived successfully");
      } catch (error) {
        toast.error("Failed to archive supplier");
      }
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setOriginalSupplierData(supplier); // Store original data for comparison
    setSupplierFormData(supplier);
    setIsModalVisible(true);
  };

  const isFormModified = () => {
    return (
      supplierFormData.supplier_name !== originalSupplierData?.supplier_name ||
      supplierFormData.contact_person !==
        originalSupplierData?.contact_person ||
      supplierFormData.contact_number !==
        originalSupplierData?.contact_number ||
      supplierFormData.email !== originalSupplierData?.email ||
      supplierFormData.address !== originalSupplierData?.address ||
      supplierFormData.status !== originalSupplierData?.status
    );
  };

  const handleColumnSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const filteredSuppliers = suppliers
    .filter((supplier) => {
      const matchesSearch =
        supplier.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.address.toLowerCase().includes(search.toLowerCase()) ||
        supplier.contact_person.toLowerCase().includes(search.toLowerCase()) ||
        supplier.contact_number.toLowerCase().includes(search.toLowerCase()) ||
        supplier.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = selectedStatus
        ? supplier.status === selectedStatus
        : supplier.status !== "Archived"; // Exclude archived by default

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <strong className="text-3xl font-bold text-gray-500">
              Suppliers
            </strong>
            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[300px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            />
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-[150px] h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <MdAddBox
            fontSize={30}
            className="text-gray-400 hover:text-pink-400 active:text-pink-500"
            onClick={() => setIsModalVisible(true)}
          />
        </div>

        <SupplierTable
          suppliers={filteredSuppliers}
          onEdit={handleEdit}
          onArchive={handleArchiveSupplier}
          sortField={sortField}
          sortOrder={sortOrder}
          handleColumnSort={handleColumnSort}
        />
      </div>

      <SupplierForm
        isVisible={isModalVisible}
        handleCloseModal={() => setIsModalVisible(false)}
        selectedSupplier={selectedSupplier}
        handleUpdateSupplier={handleUpdateSupplier}
        handleAddSupplier={handleAddSupplier}
        handleInputChange={handleInputChange}
        supplierFormData={supplierFormData}
        isFormModified={isFormModified} // Pass the form modification check
        errors={errors}
      />
    </Fragment>
  );
};

export default Suppliers;
