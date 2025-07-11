// utils/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // use service role for upload
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
