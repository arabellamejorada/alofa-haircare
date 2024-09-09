import React, { Fragment, useEffect, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  archiveSupplier
} from "../../api/suppliers.js";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [supplier_name, setSupplierName] = useState("");
  const [contact_person, setContactPerson] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const suppliersData = await getSuppliers();

        setSuppliers(suppliersData);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isModalVisible) {
      // Reset fields when modal is closed
      setSupplierName("");
      setContactPerson("");
      setContactNumber("");
      setEmail("");
      setAddress("");
      setStatus("");
      setSelectedSupplier(null); // Clear selected supplier
    }
  }, [isModalVisible]);

  const handleAddSupplier = async (e) => {
    e.preventDefault();

    const newSupplier = {
     supplier_name : supplier_name,
      contact_person : contact_person,
      contact_number : contact_number,
      email : email,
      address : address,
      status : status
    };

    try {
      const response = await createSupplier(newSupplier);
      console.log(response);
      setShowModal(false);

      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error creating supplier: ", error);
    }
  };

  const handleUpdateSupplier = async (e) => {
    e.preventDefault();

    if (!selectedSupplier) return;

    const formData = new FormData();
    formData.append("supplier_name", supplier_name);
    formData.append("contact_person", contact_person);
    formData.append("contact_number", contact_number);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("status", status);
  
    try {
      const response = await updateSupplier(selectedSupplier.supplier_id, formData);
      console.log(response);
      setIsModalVisible(false);

      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error updating supplier: ", error);
      setError("Failed to update supplier");
    }
  };

  const handleArchiveSupplier = async (selectedSupplier) => {
    if (!selectedSupplier) return;
  
    const isConfirmed = window.confirm("Are you sure you want to archive this supplier?");
    if (!isConfirmed) return;
  
    try {
      console.log("Archiving supplier: ", selectedSupplier.supplier_id);
      const response = await archiveSupplier(selectedSupplier.supplier_id);
      console.log(response);
  
      // Optionally refresh the suppliers list
      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error archiving supplier: ", error);
      setError("Failed to update supplier status to Archived");
    }
  };
  
  const handleEdit = (supplier) => {
    console.log("Selected Supplier:", supplier); // Check if supplier data is correct

    setSelectedSupplier(supplier);
    setSupplierName(supplier.supplier_name);
    setContactPerson(supplier.contact_person);
    setContactNumber(supplier.contact_number);
    setEmail(supplier.email);
    setAddress(supplier.address);
    setStatus(supplier.status);

    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedSupplier(null);
  };

  const columns = [
    {key: "supplier_id", title: "Supplier ID"},
    {key: "supplier_name", title: "Supplier Name"},
    {key: "contact_person", title: "Contact Person"},
    {key: "contact_number", title: "Contact Number"},
    {key: "email", title: "Email"},
    {key: "address", title: "Address"},
    {key: "status", title: "Status"},
  ];

  if (error) return <div>{error}</div>;

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Suppliers
          </strong>
          <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>

        {/* Render Table with data*/}
        <DataTable
          data={suppliers}
          columns={columns}
          onEdit={handleEdit}
          onArchive={handleArchiveSupplier}
        />
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6" onSubmit={handleAddSupplier}>
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Register New Supplier:
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="supplier_name">
                Supplier Name:
              </label>
              <input
                type="text"
                name="supplier_name"
                id="supplier_name"
                placeholder="Supplier Name"
                value={supplier_name}
                onChange={(e) => setSupplierName(e.target.value)}
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="contact_person">
                  Contact Person:
                </label>
                <input
                  type="text" 
                  name="contact_person"
                  id="contact_person"
                  placeholder="Contact Person"
                  value={contact_person}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="contact_number">
                  Contact Number:
                </label>
                <input
                  type="text"
                  name="contact_number"
                  id="contact_number"
                  placeholder="Contact Number"
                  value={contact_number}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="supplier_email">
                  Email:
                </label>
                <input
                  type="text"
                  name="supplier_email"
                  id="supplier_email"
                  placeholder="supplier@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="address">
                  Address:
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 dark:bg-slate-800 hover:border-pink-500 dark:hover:border-pink-700 hover:bg-white dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="status">
                Status:
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Archived">Archived</option>
                </select>
                <IoMdArrowDropdown className="absolute top-3 right-4 text-gray-400" />
                </div>
            </div>
                    
            <div className="flex flex-row justify-end gap-4">
                <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-pink-400 rounded-lg hover:bg-pink-500"
                >
                    Save
                </button>
            </div>
            </div>
        </form>
        </Modal>

        {/* Edit Supplier Modal */}
        <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
          <form className="p-6" onSubmit={handleUpdateSupplier}>
            <div className="flex flex-col gap-4">
              <div className="font-extrabold text-3xl text-pink-400">
                Edit Supplier:
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="supplier_name">
                  Supplier Name:
                </label>
                <input
                  type="text"
                  name="supplier_name"
                  id="supplier_name"
                  value={supplier_name}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="contact_person">
                    Contact Person:
                  </label>
                  <input
                    type="text"
                    name="contact_person"
                    id="contact_person"
                    value={contact_person}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="contact_number">
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    id="contact_number"
                    value={contact_number}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="email">
                    Email:
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold" htmlFor="address">
                    Address:
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="status">
                  Status:
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <IoMdArrowDropdown className="absolute top-3 right-4 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-pink-400 rounded-lg hover:bg-pink-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </Modal> 
        </Fragment>
    );
}

export default Suppliers;