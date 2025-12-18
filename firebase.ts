
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

/**
 * Robust environment variable resolver.
 * Handles both process.env and import.meta.env patterns safely.
 */
const getEnvVar = (key: string, fallback: string = ""): string => {
  let val: any = undefined;

  try {
    if (typeof process !== 'undefined' && process.env) {
      val = (process.env as any)[key];
    }
  } catch (e) {}

  if (val === undefined) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        val = import.meta.env[key];
      }
    } catch (e) {}
  }

  if (val === undefined) {
    try {
      val = (window as any).ENV?.[key] || (window as any)[key];
    } catch (e) {}
  }

  if (!val || typeof val !== 'string') return fallback;

  // Base64 decoding if applicable
  if (val.length > 10 && !val.startsWith('AIza')) {
    try {
      if (/^[A-Za-z0-9+/=]+$/.test(val)) {
        return atob(val);
      }
    } catch (e) {}
  }

  return val;
};

// Use provided hardcoded values as fallbacks if env vars are missing
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', "AIzaSyCF6KkcTBYBZNxRtmk1ESLjC6gD1-7cdyg"),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', "daiana-91326.firebaseapp.com"),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', "daiana-91326"),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', "daiana-91326.firebasestorage.app"),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', "299724449442"),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', "1:299724449442:web:87f9981e190e8ce1bb19fb"),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', "G-5VQFB2H3PX")
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
