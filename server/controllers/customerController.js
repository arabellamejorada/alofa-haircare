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

// Get all customers with profile info
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


// Get customer by profile ID
const getCustomerByProfileId = async (req, res) => {
  const profile_id = req.params.profile_id;
console.log("profile_id", profile_id)
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
      `
      )
      .eq("profile_id", profile_id)
      .single();

    if (error || !data) {
      console.error("Error fetching customer by profile ID:", error);
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching customer by profile ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update customer profile
const updateCustomer = async (req, res) => {
  const customer_id = parseInt(req.params.id);
  const { first_name, last_name, email, contact_number, role_id } = req.body;

  try {
    // Step 1: Get the profile ID linked to the customer
    const { data: customerData, error: customerError } = await supabase
      .from("customer")
      .select("profile_id")
      .eq("customer_id", customer_id)
      .single();

    if (customerError || !customerData) {
      console.error("Customer not found:", customerError);
      return res.status(404).json({ message: "Customer not found" });
    }

    // Step 2: Update the linked profile
    const { data, error } = await supabase
      .from("profiles")
      .update({ first_name, last_name, email, contact_number, role_id })
      .eq("id", customerData.profile_id)
      .select();

    if (error) {
      console.error("Error updating profile:", error);
      return res
        .status(400)
        .json({ message: "Error updating profile", error: error.message });
    }

    // Step 3: Check if data is returned from the update query
    if (!data || data.length === 0) {
      return res.status(500).json({ message: "Failed to update profile" });
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


const createShippingAddress = async (req, res) => {
  const { customer_id, first_name, last_name, phone_number, address_line, barangay, city, province, region, zip_code } = req.body;

  try {
    // Insert into addresses table
    const { data, error } = await supabase
      .from("shipping_address")
      .insert([{ customer_id, first_name, last_name, phone_number, address_line, barangay, city, province, region, zip_code }])
      .select();

    if (error) {
      console.error("Error creating shipping address:", error);
      return res
        .status(400)
        .json({
          message: "Error creating address",
          error: error.message,
        });
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getShippingAddressByCustomerId = async (req, res) => {
  const customer_id = req.params.customer_id;

  console.log("customer_id", customer_id);
  try {
    const { data, error } = await supabase
      .from("shipping_address")
      .select()
      .eq("customer_id", customer_id)
      .order("shipping_address_id", { ascending: true });

    if (error) {
      console.error("Error fetching addresses:", error);
      return res
        .status(500)
        .json({
          message: "Error fetching addresses",
          error: error.message,
        });
    }

  

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateShippingAddress = async (req, res) => {
  const shipping_address_id = parseInt(req.params.id);
  const { first_name, last_name, phone_number, address_line, barangay, city, province, region, zip_code } = req.body;

  console.log("shipping_address_id", shipping_address_id);
  console.log("Received updated address: ",first_name, last_name, phone_number, address_line, barangay, city, province, region, zip_code
  );
  try {
    const { data, error } = await supabase
      .from("shipping_address")
      .update({ first_name, last_name, phone_number, address_line, barangay, city, province, region, zip_code })
      .eq("shipping_address_id", shipping_address_id)
      .select();

    if (error) {
      console.error("Error updating address:", error);
      return res
        .status(400)
        .json({ message: "Error updating address", error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ message: "Failed to update address" });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteShippingAddress = async (req, res) => {
  const shipping_address_id = parseInt(req.params.id);

  try {
    const { error } = await supabase
      .from("shipping_address")
      .delete()
      .eq("shipping_address_id", shipping_address_id);

    if (error) {
      console.error("Error deleting address:", error);
      return res
        .status(500)
        .json({
          message: "Error deleting address",
          error: error.message,
        });
    }

    res
      .status(200)
      .json({ message: `Address deleted with ID: ${shipping_address_id}` });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByProfileId,
  updateCustomer,
  deleteCustomer,
  createShippingAddress,
  getShippingAddressByCustomerId,
  updateShippingAddress,
  deleteShippingAddress,
};
