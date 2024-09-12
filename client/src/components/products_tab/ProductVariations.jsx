import React, { Fragment, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";
import { IoMdArrowDropdown } from "react-icons/io";


const ProductVariations = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    // setSelectedProduct(product);
    // setProductName(product.name || "");
    // setProductDescription(product.description || "");
    // setProductStatus(product.product_status_id || "");
    // setProductCategory(product.product_category_id || "");

    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setShowModal(false);
    // setSelectedProduct(null);
    // setProductName("");
    // setProductDescription("");
    // setProductStatus("");
    // setProductCategory("");
  };

  const columns = [
    { key: "variation_id", header: "ID" },
    { key: "product_name", header: "Product Name" },
    { key: "variation_name", header: "Variation Type" },
    { key: "variation_value", header: "Variation Value" },
    { key: "product_category", header: "Category" },
    { key: "product_status", header: "Variation Status" },
    { key: "sku", header: "SKU" },
    { key: "unit_price", header: "Price" },
  ];

  const sampleData = [
    {
      variation_id: 1,
      name: "Variant A",
      product_name: "Hair Clip",
      variation_name: "Color",
      variation_value: "Blue",
      product_category: "Clip",
      sku: "001",
      unit_price: "₱10.00",
    },
  ];

  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <strong className="text-3xl font-bold text-gray-500">
            Product Variations
          </strong>
          <div>
            <MdAddBox
              fontSize={30}
              className="text-gray-400 mx-2 hover:text-pink-400 active:text-pink-500"
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
        <DataTable data={sampleData} columns={columns} onEdit={handleEdit} />{" "}
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <form className="p-6">
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Add Product Variation:
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_name">
                Product Name:
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="product_name"
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Type</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="variation_type">
                Variation Type:
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="variation_type"
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Type</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="variation_value">
                Variation Value:
              </label>
              <input
                type="text"
                name="variation_value"
                id="variation_value"
                placeholder="Variation"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="sku">
                SKU:
              </label>
              <input
                type="text"
                name="sku"
                id="sku"
                placeholder="SKU"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="unit_price">
                Price:
              </label>
              <input
                type="text"
                name="unit_price"
                id="unit_price"
                placeholder="Unit Price"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            {/* add image here*/}

            <div className="flex flex-row justify-between mt-4">
              <button
                type="submit"
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-extrabold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}

      <Modal isVisible={isModalVisible} onClose={handleCloseModal}>
        <form className="p-6">
          <div className="flex flex-col gap-4">
            <div className="font-extrabold text-3xl text-pink-400">
              Edit Product Variation:
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="product_name">
                Product Name:
              </label>
              <input
                type="text"
                name="product_name"
                id="edit_product_name"
                placeholder="Product Name"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="variation_type">
                Variation Type:
              </label>
              <div className="relative">
                <select
                  id="edit_type"
                  name="variation_type"
                  className="w-full h-10 px-4 appearance-none border rounded-xl bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                >
                  <option value="">Select Type</option>
                </select>
                <IoMdArrowDropdown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="variation_value">
                Variation Value:
              </label>
              <input
                type="text"
                name="variation_value"
                id="edit_variation_value"
                placeholder="Variation"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="unit_price">
                Price:
              </label>
              <input
                type="text"
                name="unit_price"
                id="edit_unit_price"
                placeholder="Unit Price"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="sku">
                SKU:
              </label>
              <input
                type="text"
                name="sku"
                id="edit_sku"
                placeholder="SKU"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
                readOnly
              />
            </div>

            {/* replace current image here */}
            

            <div className="flex flex-row justify-between mt-4">
              <button
                type="submit"
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-semibold text-white"
              >
                Apply Changes
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-[10rem] text-center py-3 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 rounded-full font-extrabold text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};

export default ProductVariations;
