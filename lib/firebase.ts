import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let firebaseConfig: any = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (typeof window !== 'undefined') {
  const storedSettings = localStorage.getItem('leadgenius_settings');
  if (storedSettings) {
    try {
      const parsed = JSON.parse(storedSettings);
      if (parsed.firebaseConfig) {
        const customConfig = JSON.parse(parsed.firebaseConfig);
        if (customConfig.apiKey) {
          firebaseConfig = customConfig;
        }
      }
    } catch (e) {
      console.error('Failed to parse custom firebase config', e);
    }
  }
}

// Initialize only if API key is present to prevent build errors
const app = firebaseConfig.apiKey 
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

const auth = app ? getAuth(app) : null as any;

export { app, auth };
