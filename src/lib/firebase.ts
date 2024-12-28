import {
  type Analytics,
  getAnalytics,
  isSupported,
  setUserProperties,
} from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Database, getDatabase } from "firebase/database";
import { firebaseInstanceMap as firebaseConfigs } from "./firebase.instances";

export type FirebaseConfig = keyof typeof firebaseConfigs;

/**
 * Initializes the Firebase app with the provided environment configuration.
 *
 * @param env - The environment configuration for Firebase.
 * @returns An object containing the initialized Firebase services:
 * - analytics
 * - auth
 * - realtime database
 */
export function initFirebase(env: FirebaseConfig): {
  analytics: Analytics | null;
  auth: Auth;
  db: Database;
} {
  const config = firebaseConfigs[env];
  const app = getApps().length ? getApp() : initializeApp(config);

  let analytics: Analytics | null = null;
  isSupported().then((val) => {
    if (val) {
      analytics = getAnalytics(app);
      setupGoogleAnalytics(analytics);
    }
    else {
      analytics = null;
    }
  });

  const auth = getAuth(app);
  const db = getDatabase(app);

  return { analytics, auth, db };
}

// Set the client IP address as a user property for Google Analytics
function setupGoogleAnalytics(analytics: Analytics) {
  // Getting an annoying CORS error when in local dev
  // Reference: https://vitejs.dev/guide/env-and-mode
  if (import.meta.env.DEV) {
    return;
  }

  fetch("https://api.ipify.org?format=json")
    .then((response): Promise<{ ip: string }> => response.json())
    .then((response) => {
      setUserProperties(analytics, { clientIp: response.ip });
    });
}
