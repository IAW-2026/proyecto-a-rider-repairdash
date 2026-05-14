"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * Singleton del cliente Supabase para el browser.
 * En el browser, el bundler garantiza que este módulo se evalúa una sola vez.
 */
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
