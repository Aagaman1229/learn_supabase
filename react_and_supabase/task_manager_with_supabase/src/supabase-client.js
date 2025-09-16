import {createClient} from "@supabase/supabase-js"

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseUrl = import.meta.env.VITE_HTTP_PATH;

export const supabase = createClient(supabaseUrl, supabaseKey);