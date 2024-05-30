// supabase.js
import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL1 = "https://uvydxjjrkynswzvgpggm.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY1 =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eWR4ampya3luc3d6dmdwZ2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3ODgwOTksImV4cCI6MjAzMTM2NDA5OX0.IqeTvmqCf_cve3vJqbbugxaUbEmpKIKOqSF0P95C5l8";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL1;
const supabaseAnonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY1;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
