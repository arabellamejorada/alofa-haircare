// for backend Admin privileges
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_REST_URL; // Add your Supabase URL to environment variables
const supabaseServiceKey = process.env.REACT_APP_SUPERADMIN_SECRET_KEY; // Add your service role key to environment variables

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
