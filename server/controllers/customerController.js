const pool = require("../db.js");
const supabase = require("../supabaseClient.jsx");

// Create a new customer with profile
const createCustomer = async (req, res) => {
  const { first_name, last_name, email, contact_number, role_id } = req.body;

  try {
    // Insert into profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert([{ first_name, last_name, email, contact_number, role_id }])
      .select();

    if (profileError) {
      console.error("Error creating profile:", profileError);
      return res
        .status(400)
        .json({
          message: "Error creating profile",
          error: profileError.message,
        });
    }

    // Insert into customer table with the new profile ID
    const { data: customer, error: customerError } = await supabase
      .from("customer")
      .insert([{ profile_id: profile[0].id }])
      .select();

    if (customerError) {
      console.error("Error creating customer:", customerError);
      return res
        .status(400)
        .json({
          message: "Error creating customer",
          error: customerError.message,
        });
    }

    res
      .status(201)
      .json({ ...profile[0], customer_id: customer[0].customer_id });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customer")
      .select(
        `
                customer_id,
                profiles (
                    id,
                    first_name,
                    last_name,
                    email,
                    contact_number,
                    role_id,
                    created_at,
                    updated_at
                )
            `,
      )
      .order("customer_id", { ascending: true });

    if (error) {
      console.error("Error fetching customers:", error);
      return res
        .status(500)
        .json({ message: "Error fetching customers", error: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
  const customer_id = parseInt(req.params.id);

  try {
    const { data, error } = await supabase
      .from("customer")
      .select(
        `
                customer_id,
                profiles (
                    id,
                    first_name,
                    last_name,
                    email,
                    contact_number,
                    role_id,
                    created_at,
                    updated_at
                )
            `,
      )
      .eq("customer_id", customer_id)
      .single();

    if (error || !data) {
      console.error("Error fetching customer:", error);
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update customer profile
const updateCustomer = async (req, res) => {
  const customer_id = parseInt(req.params.id);
  const { first_name, last_name, email, contact_number, role_id } = req.body;

  try {
    // Get the profile ID linked to the customer
    const { data: customerData, error: customerError } = await supabase
      .from("customer")
      .select("profile_id")
      .eq("customer_id", customer_id)
      .single();

    if (customerError || !customerData) {
      console.error("Customer not found:", customerError);
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update the linked profile
    const { data, error } = await supabase
      .from("profiles")
      .update({ first_name, last_name, email, contact_number, role_id })
      .eq("id", customerData.profile_id);

    if (error) {
      console.error("Error updating profile:", error);
      return res
        .status(400)
        .json({ message: "Error updating profile", error: error.message });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a customer and its associated profile
const deleteCustomer = async (req, res) => {
  const customer_id = parseInt(req.params.id);

  try {
    // Get the profile ID linked to the customer
    const { data: customerData, error: customerError } = await supabase
      .from("customer")
      .select("profile_id")
      .eq("customer_id", customer_id)
      .single();

    if (customerError || !customerData) {
      console.error("Customer not found:", customerError);
      return res.status(404).json({ message: "Customer not found" });
    }

    // Delete the customer
    const { error: deleteCustomerError } = await supabase
      .from("customer")
      .delete()
      .eq("customer_id", customer_id);

    if (deleteCustomerError) {
      console.error("Error deleting customer:", deleteCustomerError);
      return res
        .status(500)
        .json({
          message: "Error deleting customer",
          error: deleteCustomerError.message,
        });
    }

    // Delete the associated profile
    const { error: deleteProfileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", customerData.profile_id);

    if (deleteProfileError) {
      console.error("Error deleting profile:", deleteProfileError);
      return res
        .status(500)
        .json({
          message: "Error deleting profile",
          error: deleteProfileError.message,
        });
    }

    res
      .status(200)
      .json({ message: `Customer deleted with ID: ${customer_id}` });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
