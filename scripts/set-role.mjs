// Bootstrap and manage staff roles. Run this on your own machine or a trusted server, never from the browser.
// Usage: node --env-file=.env.local scripts/set-role.mjs <email> <customer|manager|admin>
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const ROLES = ['customer', 'manager', 'admin'];
const [email, role] = process.argv.slice(2);

if (!email || !ROLES.includes(role)) {
  console.error('Usage: node --env-file=.env.local scripts/set-role.mjs <email> <customer|manager|admin>');
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const auth = getAuth(app);
const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { role });
// Revoking refresh tokens forces existing sessions to sign in again, so the new role takes effect.
await auth.revokeRefreshTokens(user.uid);
console.log(`Set ${email} to ${role}. They must sign in again.`);
