/**
 * Whether cloud sync is configured — a pure env check with NO dependency on
 * @supabase/supabase-js. Import this (not `supabase.ts`) wherever you only need
 * to know if sync exists, so the heavy Supabase client stays out of the bundle
 * until it's actually used.
 */
export const syncConfigured = (): boolean =>
  !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
