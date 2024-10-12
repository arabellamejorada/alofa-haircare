// Validate that a name is not empty
export const validateName = (name) => name.trim() !== "";

// Validate email format using regex
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate that contact number is a 11-digit number
export const validateContactNumber = (number) => /^\d{11}$/.test(number);

// Validate that a role is not empty
export const validateRole = (role) => {
  return role && role.toString().trim() !== "";
};

// Validate that a username is not empty
export const validateUsername = (username) => username.trim() !== "";

// Validate that a password is at least 6 characters long
export const validatePassword = (password) => password.length >= 6;

// Function to validate the entire form data
export const validateForm = ({
  firstName,
  lastName,
  email,
  contactNumber,
  roleId,
  username,
  password,
  isEdit = false,
}) => {
  return {
    firstName: validateName(firstName) ? "" : "First name is required",
    lastName: validateName(lastName) ? "" : "Last name is required",
    email: validateEmail(email) ? "" : "Enter a valid email address",
    contactNumber: validateContactNumber(contactNumber)
      ? ""
      : "Enter a valid 11-digit phone number",
    roleId: validateRole(roleId) ? "" : "Role is required",
    username: !isEdit && !validateUsername(username) ? "Username is required" : "",
    password: !isEdit && !validatePassword(password) ? "Password must be at least 6 characters" : "",
  };
};
