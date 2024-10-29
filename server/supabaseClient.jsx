// for backend Admin privileges
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hqzdxvlsgjkhtavvkmus.supabase.co"; // Add your Supabase URL to environment variables
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxemR4dmxzZ2praHRhdnZrbXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODk3NjY2MCwiZXhwIjoyMDQ0NTUyNjYwfQ.gI5brcM4vYefoUlpzfYVvuP3AOaxTcu_AFaW1lisbHA"; // Add your service role key to environment variables

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
