import { createClient } from "@supabase/supabase-js";

const projectUrl = "https://dfndrbymaiiovdlgdjmn.supabase.co";
const publishableKey = "sb_publishable_kWeaA1fs55HozNuvm4Zx_w_V2-D11GV";

const url = import.meta.env.VITE_SUPABASE_URL || projectUrl;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || publishableKey;

export const supabase = createClient(url, key);
export const isSupabaseReady = true;
