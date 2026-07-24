'use server';

export async function verifyTurnstileToken(token: string) {
  if (!token) {
    return { success: false };
  }

  // Bypass for local development dummy tokens
  if (token === "XXXX.DUMMY.TOKEN.XXXX") {
    return { success: true };
  }

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET as string,
        response: token,
      }),
    });
    
    const result = await r.json();
    return result;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return { success: false };
  }
}
