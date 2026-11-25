import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { publicEnv, isFirebaseConfigured } from '@/lib/env';

let app: FirebaseApp | null = null;

/** Returns null when Firebase is not configured, so the UI can show an honest state. */
export function getClientApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) {
    app =
      getApps()[0] ??
      initializeApp({
        apiKey: publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: publicEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: publicEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
  }
  return app;
}

export function getClientAuth() {
  const a = getClientApp();
  return a ? getAuth(a) : null;
}

export function getClientDb() {
  const a = getClientApp();
  return a ? getFirestore(a) : null;
}
