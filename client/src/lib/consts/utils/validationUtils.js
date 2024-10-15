// Validation utilities

// Validate that a string is not empty
export const validateName = (name) => name.trim() !== "";

// Validate that a description is not empty
export const validateDescription = (description) => description.trim() !== "";

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

// Validate that a string is not empty
export const validateType = (type) => type.trim() !== "";

// Validate that a value is not empty
export const validateValue = (value) => value.trim() !== "";

// Validate SKU format using regex (assuming alphanumeric and dashes are allowed)
export const validateSku = (sku) => /^[a-zA-Z0-9-]+$/.test(sku);

// Validate that the unit price is a positive number
export const validateUnitPrice = (unit_price) => !isNaN(unit_price) && unit_price > 0;

// Validate image to be non-empty and an actual image file (if provided)
export const validateImage = (image) => {
  return image ? image.type.startsWith("image/") : true; // If there's no image, it's valid (optional field)
};

export const validateProductStatusId = (product_status_id) => {
  if (!product_status_id) return false; // If status is empty or falsy, it's invalid
  // Accept both strings and numbers as valid
  return (typeof product_status_id === "string" || typeof product_status_id === "number") 
    ? String(product_status_id).trim() !== "" 
    : false;
};


// Validate that a status is selected
export const validateStatus = (status) => {
  if (!status) return false; // If status is empty or falsy, it's invalid
  return typeof status === "string" ? status.trim() !== "" : true; // Use trim only if it's a string
};

// Validate that a category is selected
export const validateCategory = (category) => {
  if (!category) return false; // If category is empty or falsy, it's invalid
  return typeof category === "string" ? category.trim() !== "" : true; // Use trim only if it's a string
};

// Function to validate product variation form
export const validateAddProductVariationForm = ({
  product_id,
  variations,
}) => {
  const errors = {};

  // Validate that a product is selected
  if (!validateName(product_id)) errors.product_id = "Product must be selected";

  // Iterate through each variation for validation
  const variationErrors = variations.map((variation, index) => {
    const error = {};
    if (!validateType(variation.type)) error.type = `Variation ${index + 1}: Type is required`;
    if (!validateValue(variation.value)) error.value = `Variation ${index + 1}: Value is required`;
    if (!validateSku(variation.sku)) error.sku = `Variation ${index + 1}: SKU is invalid`;
    if (!validateUnitPrice(variation.unit_price)) error.unit_price = `Variation ${index + 1}: Unit price must be positive`;
    if (variation.image && !validateImage(variation.image)) error.image = `Variation ${index + 1}: Invalid image format`;
    return error;
  });

  errors.variations = variationErrors;

  return errors;
};

export const validateEditProductVariationForm = ({
  unit_price,
  product_status_id,
}) => {
    console.log('Validating Form:', { unit_price, product_status_id }); // Log the values

  return {    
    unit_price: validateUnitPrice(unit_price) ? "" : "HELP",
    product_status_id: validateStatus(product_status_id) ? "" : "Status is required",
  };
};

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

  if (!validateName(firstName)) errors.firstName = "First name is required";
  if (!validateName(lastName)) errors.lastName = "Last name is required";
  if (!validateEmail(email)) errors.email = "Enter a valid email address";
  if (!validateContactNumber(contactNumber)) errors.contactNumber = "Enter a valid 11-digit phone number";
  if (!validateRole(roleId)) errors.roleId = "Role is required";
  if (!isEdit && !validateUsername(username)) errors.username = "Username is required";
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

// Function to validate product form data
export const validateProductForm = ({
  product_name,
  product_description,
  product_status,
  product_category,
}) => {
  return {
    product_name: validateName(product_name) ? "" : "Product name is required",
    product_description: validateDescription(product_description) ? "" : "Product description is required",
    product_status: validateStatus(product_status) ? "" : "Status is required",
    product_category: validateCategory(product_category) ? "" : "Category is required",
  };
};