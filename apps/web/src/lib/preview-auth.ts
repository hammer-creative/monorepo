// lib/preview-auth.ts
// Login gate for the `preview` branch deploy (see src/middleware.preview.ts). Runs in both the edge
// middleware and the Node route handlers, so it uses Web Crypto only.
//
// Two ways in:
// - People: signed in with Clerk and listed in PREVIEW_ALLOWED_EMAILS.
// - Studio Presentation: the iframe can't carry a Clerk session (third-party cookie, and the Clerk
//   sign-in page refuses to be framed). `/api/enable-draft` already validates Sanity's one-time
//   preview secret, so on success it also sets STUDIO_COOKIE, an HMAC-signed expiry. The cookie is
//   `SameSite=None; Secure; Partitioned`, so the browser only sends it inside the Studio's iframe.

export const STUDIO_COOKIE = '__hc_studio_preview';
export const STUDIO_COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function cookieSecret(): string | undefined {
  const secret = process.env.PREVIEW_COOKIE_SECRET;
  return secret && secret.length >= 32 ? secret : undefined;
}

/** Value for STUDIO_COOKIE, or undefined when PREVIEW_COOKIE_SECRET is missing or too short. */
export async function signStudioCookie(): Promise<string | undefined> {
  const secret = cookieSecret();
  if (!secret) return undefined;
  const expires = String(Math.floor(Date.now() / 1000) + STUDIO_COOKIE_MAX_AGE);
  return `${expires}.${await hmac(expires, secret)}`;
}

export async function verifyStudioCookie(value: string | undefined): Promise<boolean> {
  const secret = cookieSecret();
  if (!secret || !value) return false;
  const [expires, sig] = value.split('.');
  if (!expires || !sig || Number(expires) < Date.now() / 1000) return false;
  const expected = await hmac(expires, secret);
  // Constant-time compare
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

/**
 * PREVIEW_ALLOWED_EMAILS: comma-separated emails and/or `@domain` entries, e.g.
 * `jason@example.com, @hammercreative.com`. Empty or unset lets nobody in.
 */
export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const address = email.trim().toLowerCase();
  const domain = address.slice(address.lastIndexOf('@'));
  return (process.env.PREVIEW_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .some((entry) => (entry.startsWith('@') ? entry === domain : entry === address));
}
