/**
 * Auth service. DEMO implementation: accepts any valid email + password.
 * Replace each function body with a call to your auth API (keep the signatures).
 * Never trust these checks — the server must validate everything.
 */

export type AuthResult = { ok: true } | { ok: false; error: string };

const delay = () => new Promise((r) => setTimeout(r, 400)); // simulates network latency for pending states

export async function signIn(email: string, password: string): Promise<AuthResult> {
  void email;
  void password;
  await delay();
  return { ok: true };
}

export async function signUp(input: { salon: string; name: string; email: string; password: string; plan?: string }): Promise<AuthResult> {
  void input;
  await delay();
  return { ok: true };
}

/** Always succeeds from the user's point of view (never reveals whether an account exists). */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  void email;
  await delay();
  return { ok: true };
}

export async function resetPassword(token: string, password: string): Promise<AuthResult> {
  void password;
  await delay();
  return token ? { ok: true } : { ok: false, error: "This reset link is invalid or has expired. Request a new one." };
}
