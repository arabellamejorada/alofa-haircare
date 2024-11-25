// Generalized validation for non-empty strings (for text inputs)
export const validateNonEmpty = (input) => input?.toString().trim() !== "";

// Generalized validation for dropdown selections (ensures a valid option is selected)
export const validateDropdown = (selection) =>
  selection !== null && selection !== "";

// Validation utilities
export const validateName = validateNonEmpty;
export const validateDescription = validateNonEmpty;
export const validateUsername = validateNonEmpty;
export const validateAddress = validateNonEmpty;
export const validateValue = validateNonEmpty;
export const validateReason = validateNonEmpty;

// Dropdown-specific validations
export const validateRole = validateDropdown;
export const validateType = validateDropdown;
export const validateStatus = validateDropdown;
export const validateCategory = validateDropdown;
export const validateProductStatusId = validateDropdown;

// Validate email format using regex
export const validateEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

// Validate contact number to be an 11-digit number
export const validateContactNumber = (contactNumber) => {
  const contactNumberRegex = /^09\d{9}$/; // Starts with 09 and has 11 digits
  return contactNumberRegex.test(contactNumber);
};

// Validate that a password is at least 6 characters long
export const validatePassword = (password) => password.length >= 6;

// Validate SKU format using regex (assuming alphanumeric and dashes are allowed)
export const validateSku = (sku) => /^[a-zA-Z0-9-]+$/.test(sku);

// Validate that the unit price is a positive number
export const validateUnitPrice = (unit_price) =>
  !isNaN(unit_price) && unit_price > 0;

// Validate image to be non-empty and an actual image file (if provided)
export const validateImage = (image) =>
  image ? image.type.startsWith("image/") : true; // If there's no image, it's valid (optional field)

export const validateQuantity = (quantity, stock) => {
  if (!quantity) return false;
  if (isNaN(quantity) || quantity <= 0) return false;
  return quantity <= stock; // Quantity should not exceed the available stock
};

// Function to validate product form data
export const validateProductForm = (productFormData) => {
  const errors = {};

  // Validate product name
  if (!validateName(productFormData.product_name)) {
    errors.product_name = "Product name is required";
  }

  // Validate product description
  if (!validateDescription(productFormData.product_description)) {
    errors.product_description = "Product description is required";
  }

  // Validate product status
  if (!validateStatus(productFormData.product_status)) {
    errors.product_status = "Please select a status";
  }

  // Validate product category
  if (!validateCategory(productFormData.product_category)) {
    errors.product_category = "Please select a category";
  }

  return errors;
};

export const validateAddProductVariationForm = (variations) => {
  const errors = [];
  variations.forEach((variation, index) => {
    const error = {};

    // Validate type
    if (!variation.type.trim()) {
      error.type = "Select a type";
    }

    // Validate value only if type is not "Default"
    if (variation.type !== "Default" && !variation.value.trim()) {
      error.value = "Variation value is required";
    }

    // Validate unit price (ensure it isn't undefined or null, but allow 0)
    if (
      variation.unit_price === undefined ||
      variation.unit_price === null ||
      variation.unit_price === ""
    ) {
      error.unit_price = "Price is required";
    }

    // Only add to errors array if there's actually an error
    if (Object.keys(error).length > 0) {
      errors[index] = error;
    } else {
      errors[index] = {}; // To maintain the structure but indicate no errors
    }
  });

  return errors;
};

export const validateEditProductVariationForm = ({
  unit_price,
  product_status_id,
}) => {
  console.log("Validating Form:", { unit_price, product_status_id }); // Log the values

  return {
    unit_price: validateUnitPrice(unit_price) ? "" : "HELP",
    product_status_id: validateStatus(product_status_id)
      ? ""
      : "Status is required",
  };
};

// Function to validate employee form data
export const validateEmployeeForm = ({
  firstName,
  lastName,
  email,
  contactNumber,
  roleId,
  isEdit = false, // Flag to differentiate between create and update
}) => {
  const errors = {};

  if (!validateName(firstName)) errors.firstName = "First name is required";
  if (!validateName(lastName)) errors.lastName = "Last name is required";
  if (!validateEmail(email)) errors.email = "Enter a valid email address";
  if (!validateContactNumber(contactNumber))
    errors.contactNumber = "Enter a valid 11-digit phone number";
  if (!validateRole(roleId)) errors.roleId = "Role is required";

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
    supplier_name: validateName(supplier_name)
      ? ""
      : "Supplier name is required",
    contact_person: validateName(contact_person)
      ? ""
      : "Contact person is required",
    contact_number: validateContactNumber(contact_number)
      ? ""
      : "Enter a valid 11-digit phone number",
    email: validateEmail(email) ? "" : "Enter a valid email address",
    address: validateAddress(address) ? "" : "Address is required",
    status: validateStatus(status) ? "" : "Status is required",
  };
};

export const validateStockInForm = ({ supplier_id, stockInProducts }) => {
  const errors = {};

  if (!validateDropdown(supplier_id))
    errors.supplier_id = "Supplier is required";

  const productErrors = stockInProducts.map((product, index) => {
    const error = {};
    if (!validateDropdown(product.product_id))
      error.product_id = `Product ${index + 1}: Product is required`;
    if (!validateQuantity(product.quantity))
      error.quantity = `Product ${index + 1}: Quantity must be a positive number`;
    return error;
  });

  errors.stockInProducts = productErrors;

  return errors;
};

export const validateStockOutForm = ({
  stockOutProducts,
  selectedEmployee,
}) => {
  const errors = {};

  if (!validateDropdown(selectedEmployee))
    errors.selectedEmployee = "Supplier is required";

  const productErrors = stockOutProducts.map((product, index) => {
    const error = {};
    if (!validateDropdown(product.variation_id))
      error.variation_id = `Product ${index + 1}: Product is required`;
    if (!validateQuantity(product.quantity))
      error.quantity = `Product ${index + 1}: Quantity must be a positive number`;
    if (!validateReason(product.reason))
      error.reason = `Product ${index + 1}: Reason is required`;
    return error;
  });

  errors.stockOutProducts = productErrors;

  return errors;
};
