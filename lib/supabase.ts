import { createClient } from "@supabase/supabase-js";

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co").trim();
const supabaseUrl = rawUrl.replace(/;$/, "").replace(/^['"]|['"]$/g, "").trim() || "https://placeholder.supabase.co";

const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key").trim();
const supabaseAnonKey = rawKey.replace(/;$/, "").replace(/^['"]|['"]$/g, "").trim() || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
