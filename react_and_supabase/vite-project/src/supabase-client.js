import {createClient} from "@supabase/supabase-js"
require('dotenv').config();


const supabaseUrl = 'https://wtjjtwictrguauiknlmt.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)