import { showToast } from "../../lib/consts/utils/toastUtils.js";
import {
  createEmployee,
  updateEmployee,
  archiveEmployee,
} from "../../api/employees";

export const handleAddEmployee = async ({
  formData,
  validateForm,
  setErrors,
  setShowModal,
  setEmployees,
  getEmployees,
}) => {
  const formErrors = validateForm(formData);

  setErrors(formErrors);
  if (Object.values(formErrors).some((error) => error !== "")) {
    showToast("error", "Please fill out all required fields correctly.");
    return;
  }

  try {
    await createEmployee(formData);
    setShowModal(false);
    const employeesData = await getEmployees();
    setEmployees(employeesData);
    showToast("success", "Employee added successfully!");
  } catch (error) {
    console.error("Error creating employee: ", error);
    showToast("error", "Failed to add employee. Please try again.");
  }
};
