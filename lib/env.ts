export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    // During build or in development, return a placeholder
    return '';
  }
  return value;
}

export function validateSupabaseEnv() {
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
