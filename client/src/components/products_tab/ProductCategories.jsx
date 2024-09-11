import React, { Fragment, useState } from "react";
import DataTable from "../shared/DataTable";
import { MdAddBox } from "react-icons/md";
import Modal from "../modal/Modal";

const ProductCategories = () => {
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
    { key: "category_id", header: "ID" },
    { key: "category_name", header: "Category Name" },
  ];

  const sampleData = [
    {
      category_id: 1,
      category_name: "Category A",
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
              Add New Category:
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="category_name">
                Category Name:
              </label>
              <input
                type="text"
                name="category_name"
                id="category_name"
                placeholder="Category Name"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

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
              Edit Category:
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold" htmlFor="category_name">
                Cateogry Name:
              </label>
              <input
                type="text"
                name="category_name"
                id="edit_category_name"
                placeholder="Category Name"
                className="rounded-xl border w-full h-10 pl-4 bg-gray-50 hover:border-pink-500 hover:bg-white border-slate-300 text-slate-700"
              />
            </div>

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

export default ProductCategories;
