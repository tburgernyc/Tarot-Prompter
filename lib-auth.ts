// lib/auth.ts
// HTTP-only cookie authentication with password gate

import { cookies } from 'next/headers';
import { WebCrypto } from 'crypto';

const crypto = new WebCrypto();

export interface CookiePayload {
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

/**
 * Generate HMAC-SHA256 signature for a cookie value.
 * Uses constant-time comparison to prevent timing attacks.
 */
export async function signCookie(
  payload: CookiePayload,
  secret: string
): Promise<string> {
  const secretKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const payloadStr = JSON.stringify(payload);
  const signature = await crypto.subtle.sign('HMAC', secretKey, new TextEncoder().encode(payloadStr));
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${payloadStr}.${signatureHex}`;
}

/**
 * Verify HMAC-SHA256 signature and return payload if valid.
 */
export async function verifyCookie(
  signedCookie: string,
  secret: string
): Promise<CookiePayload | null> {
  const [payloadStr, sig] = signedCookie.split('.');
  if (!payloadStr || !sig) return null;

  try {
    const secretKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const expected = await crypto.subtle.sign('HMAC', secretKey, new TextEncoder().encode(payloadStr));
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison
    if (!constantTimeEqual(sig, expectedHex)) return null;

    const payload = JSON.parse(payloadStr) as CookiePayload;
    if (payload.expiresAt < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Verify password with constant-time comparison.
 */
export function verifyPassword(input: string, expected: string): boolean {
  return constantTimeEqual(input, expected);
}

/**
 * Check if request is authenticated via cookie.
 */
export async function isAuthenticated(
  cookieSecret: string,
  ttlDays: number
): Promise<{ authenticated: boolean; actorId?: string }> {
  try {
    const cookieStore = await cookies();
    const tlpAuth = cookieStore.get('tlp_auth')?.value;

    if (!tlpAuth) {
      return { authenticated: false };
    }

    const payload = await verifyCookie(tlpAuth, cookieSecret);
    if (!payload) {
      return { authenticated: false };
    }

    // Optionally: refresh cookie if close to expiry
    const timeUntilExpiry = payload.expiresAt - Date.now();
    const refreshThreshold = 1 * 24 * 60 * 60 * 1000; // 1 day

    if (timeUntilExpiry < refreshThreshold) {
      const newPayload: CookiePayload = {
        issuedAt: Date.now(),
        expiresAt: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
        nonce: payload.nonce,
      };
      const signed = await signCookie(newPayload, cookieSecret);
      (await cookies()).set('tlp_auth', signed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ttlDays * 24 * 60 * 60,
      });
    }

    return {
      authenticated: true,
      actorId: payload.nonce,
    };
  } catch (err) {
    console.error('[auth] Error checking authentication:', err);
    return { authenticated: false };
  }
}

/**
 * Set authentication cookie after password verification.
 */
export async function setAuthCookie(
  cookieSecret: string,
  ttlDays: number,
  actorId: string
): Promise<void> {
  const payload: CookiePayload = {
    issuedAt: Date.now(),
    expiresAt: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
    nonce: actorId,
  };

  const signed = await signCookie(payload, cookieSecret);
  (await cookies()).set('tlp_auth', signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ttlDays * 24 * 60 * 60,
  });
}

/**
 * Clear authentication cookie.
 */
export async function clearAuthCookie(): Promise<void> {
  (await cookies()).delete('tlp_auth');
}
