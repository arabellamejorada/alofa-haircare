import React, { Fragment, useEffect, useState } from "react";
import DataTable from "./shared/DataTable";
import ConfirmModal from "./shared/ConfirmModal";
import { MdAddBox } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Modal from "./modal/Modal";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { createFaq, getAllFaqs, updateFaq, deleteFaq } from "../api/faqs";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [errors, setErrors] = useState({});

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // FAQ state
  const [faqData, setFaqData] = useState({
    question: "",
    answer: "",
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const faqsData = await getAllFaqs();
      setFaqs(faqsData);
    } catch (error) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  // Function to handle column sorting
  const handleColumnSort = (field) => {
    if (field === "id") {
      // Allow sorting only on the ID column
      const isAsc = sortField === field && sortOrder === "asc";
      setSortOrder(isAsc ? "desc" : "asc");
      setSortField(field);
    } else {
      toast.error("Sorting is allowed only on the ID column.");
    }
  };

  // Adjust filteredFaqs to sort by `id` only
  const filteredFaqs = faqs
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search),
    )
    .sort((a, b) => {
      if (sortField === "id") {
        // Sort only if the column is "id"
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0; // No sorting on other columns
    });

  const validateForm = () => {
    const validationErrors = {};
    if (!faqData.question) validationErrors.question = "Question is required";
    if (!faqData.answer) validationErrors.answer = "Answer is required";
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
      if (selectedFaq) {
        await updateFaq(selectedFaq.id, faqData);
        toast.success("FAQ updated successfully.");
      } else {
        await createFaq(faqData);
        toast.success("FAQ created successfully.");
      }
      handleCloseModal();
      fetchFaqs();
    } catch (error) {
      toast.error("Error saving FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (faq) => {
    setConfirmMessage(
      `Are you sure you want to delete the FAQ "${faq.question}"?`,
    );
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        await deleteFaq(faq.id);
        toast.success("FAQ deleted successfully.");
        fetchFaqs();
      } catch (error) {
        toast.error("Error deleting FAQ. Please try again.");
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
    setSelectedFaq(null);
    setFaqData({
      question: "",
      answer: "",
    });
    setErrors({});
  };

  const openModal = (faq = null) => {
    if (faq) {
      setSelectedFaq(faq);
      setFaqData(faq);
    } else {
      setSelectedFaq(null);
      setFaqData({
        question: "",
        answer: "",
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
    { key: "id", header: renderHeader("id", "ID") },
    { key: "question", header: "Question" },
    { key: "answer", header: "Answer" },
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
          <strong className="text-3xl font-bold text-gray-500">FAQs</strong>

          <div className="flex flex-row justify-between mt-4 gap-4">
            <div className="relative flex items-center w-[300px]">
              <input
                type="text"
                className="w-full h-10 px-4 border rounded-xl bg-gray-50 border-slate-300"
                placeholder="Search by question"
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

            <MdAddBox
              fontSize={40}
              className="text-gray-400 mx-2 hover:text-alofa-highlight active:text-alofa-pink"
              onClick={() => openModal()}
            />
          </div>

          <DataTable
            data={filteredFaqs}
            columns={columns}
            onEdit={openModal}
            onDelete={handleDeleteFaq}
            isProductCategory={true}
          />
        </div>

        <Modal isVisible={showModal} onClose={handleCloseModal}>
          <form className="p-6" onSubmit={handleSubmit}>
            <div className="font-extrabold text-3xl text-alofa-highlight mb-4">
              {selectedFaq ? "Edit FAQ" : "Add New FAQ"}
            </div>

            <div className="flex flex-col mb-4">
              <label className="font-bold" htmlFor="question">
                Question
              </label>
              <input
                type="text"
                name="question"
                id="question"
                placeholder="FAQ Question"
                value={faqData.question}
                onChange={handleInputChange}
                className="rounded-xl border h-10 px-4 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
              />
              {errors.question && (
                <p className="text-red-500 text-sm mt-1">{errors.question}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label className="font-bold" htmlFor="answer">
                Answer
              </label>
              <textarea
                name="answer"
                id="answer"
                placeholder="FAQ Answer"
                value={faqData.answer}
                onChange={handleInputChange}
                className="rounded-xl border px-4 py-2 bg-gray-50 hover:border-alofa-pink hover:bg-white border-slate-300"
              />
              {errors.answer && (
                <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
              )}
            </div>

            <div className="flex flex-row justify-end gap-4 mt-6">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-alofa-highlight rounded-lg hover:bg-alofa-pink"
              >
                {selectedFaq ? "Update FAQ" : "Add FAQ"}
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

export default FAQ;
