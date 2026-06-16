let cachedClient = null;

export async function createSupabaseClient(config = {}) {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    return null;
  }

  if (cachedClient) {
    return cachedClient;
  }

  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  cachedClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
  return cachedClient;
}
