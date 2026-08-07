/**
 * HMAC-signed session cookie helpers.
 *
 * The session cookie is NOT a JWT and must not be trusted from its base64
 * payload alone. We sign the payload with HMAC-SHA256 using SESSION_SECRET so
 * that a forged cookie (e.g. `{ "role": "admin" }`) is rejected at the edge
 * (middleware) and on the server before any authorization is granted.
 *
 * Cookie format:  <base64(payload)>.<base64url(hmac_sha256)>
 *
 * Uses the Web Crypto API so it runs in both the Edge runtime (middleware)
 * and Node.js (server actions / layouts).
 */

const encoder = new TextEncoder();

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Dev-only fallback. Production deployments MUST set SESSION_SECRET.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET is not set. Refusing to sign sessions in production.');
    }
    return 'topclues-dev-insecure-secret-do-not-use-in-production';
  }
  return secret;
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64Encode(value: string): string {
  return btoa(value);
}

function base64Decode(value: string): string {
  return atob(value);
}

function bufToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToBuf(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Sign a session payload -> `<base64(payload)>.<base64(hmac)>`.
 */
export async function signSession<T extends object>(payload: T): Promise<string> {
  const payloadB64 = base64Encode(JSON.stringify(payload));
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  return `${payloadB64}.${bufToBase64(signature)}`;
}

/**
 * Verify a session cookie value. Returns the decoded payload only if the HMAC
 * signature is valid; otherwise returns null. Never trusts the payload alone.
 */
export async function verifySession<T extends object>(
  cookieValue: string | null | undefined
): Promise<T | null> {
  if (!cookieValue || typeof cookieValue !== 'string') return null;

  const dotIndex = cookieValue.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const payloadB64 = cookieValue.slice(0, dotIndex);
  const signatureB64 = cookieValue.slice(dotIndex + 1);

  try {
    const key = await getHmacKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64ToBuf(signatureB64),
      encoder.encode(payloadB64)
    );
    if (!valid) return null;

    const payload = JSON.parse(base64Decode(payloadB64)) as T;
    if (!payload || typeof payload !== 'object' || !('userId' in payload) || !('role' in payload)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
