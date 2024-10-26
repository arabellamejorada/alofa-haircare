import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hqzdxvlsgjkhtavvkmus.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxemR4dmxzZ2praHRhdnZrbXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5NzY2NjAsImV4cCI6MjA0NDU1MjY2MH0.ESYMd3zegYxLhvyqaK7V_L5UsANDnrcR4onnLcWJJpA";

export const supabase = createClient(supabaseUrl, supabaseKey);
