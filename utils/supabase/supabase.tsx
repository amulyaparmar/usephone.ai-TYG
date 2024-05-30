// supabase.js
import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL1 = "";
const NEXT_PUBLIC_SUPABASE_ANON_KEY1 = "";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL1;
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY1;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
