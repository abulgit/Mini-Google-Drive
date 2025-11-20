import csrf from "csrf";

// Create CSRF instance
const tokens = new csrf();

// Generate a secret for CSRF tokens
const secret = process.env.CSRF_SECRET || "default_secret_key";

export function generateCSRFToken(): string {
  return tokens.create(secret);
}

export function verifyCSRFToken(token: string): boolean {
  return tokens.verify(secret, token);
}

export { tokens };
