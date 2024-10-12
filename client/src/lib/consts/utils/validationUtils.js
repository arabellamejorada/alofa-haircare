// Validation utilities

// Validate that a string is not empty
export const validateName = (name) => name.trim() !== "";

// Validate email format using regex
export const validateEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

// Validate that contact number is an 11-digit number
export const validateContactNumber = (number) => /^\d{11}$/.test(number);

// Validate that a role is not empty
export const validateRole = (role) => role?.toString().trim() !== "";

// Validate that a username is not empty
export const validateUsername = (username) => username.trim() !== "";

// Validate that a password is at least 6 characters long
export const validatePassword = (password) => password.length >= 6;

// Validate that an address is not empty
export const validateAddress = (address) => address.trim() !== "";

// Validate that a status is selected
export const validateStatus = (status) => status.trim() !== "";

// Function to validate employee form data
export const validateEmployeeForm = ({
  firstName,
  lastName,
  email,
  contactNumber,
  roleId,
  username = "",
  password = "",
  isEdit = false, // Flag to differentiate between create and update
}) => {
  const errors = {};

  // First Name Validation
  if (!validateName(firstName)) errors.firstName = "First name is required";

  // Last Name Validation
  if (!validateName(lastName)) errors.lastName = "Last name is required";

  // Email Validation
  if (!validateEmail(email)) errors.email = "Enter a valid email address";

  // Contact Number Validation
  if (!validateContactNumber(contactNumber)) errors.contactNumber = "Enter a valid 11-digit phone number";

  // Role Validation
  if (!validateRole(roleId)) errors.roleId = "Role is required";

  // Username Validation (Only for creating new employee)
  if (!isEdit && !validateUsername(username)) errors.username = "Username is required";

  // Password Validation (Only for creating new employee)
  if (!isEdit && !validatePassword(password)) errors.password = "Password must be at least 6 characters";

  return errors;
};

// Function to validate supplier form data
export const validateSupplierForm = ({
  supplier_name,
  contact_person,
  contact_number,
  email,
  address,
  status,
}) => {
  return {
    supplier_name: validateName(supplier_name) ? "" : "Supplier name is required",
    contact_person: validateName(contact_person) ? "" : "Contact person is required",
    contact_number: validateContactNumber(contact_number) ? "" : "Enter a valid 11-digit phone number",
    email: validateEmail(email) ? "" : "Enter a valid email address",
    address: validateAddress(address) ? "" : "Address is required",
    status: validateStatus(status) ? "" : "Status is required",
  };
};
