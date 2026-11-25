const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/user-not-found': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/weak-password': 'Choose a password of at least 8 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'Network problem. Check your connection and try again.',
};

export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  return (code && MESSAGES[code]) ?? 'Something went wrong. Please try again.';
}

/** Only allow same-site relative redirects after sign-in. */
export function safeNext(p: string | null | undefined): string {
  // Same-site paths only: reject protocol-relative ("//x") and backslash ("/\x") forms browsers treat as other hosts.
  return p && p.startsWith('/') && !p.startsWith('//') && !p.includes('\\') ? p : '/account';
}
