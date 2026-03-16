import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHZuMEpy69SHE7VsEv0bhBl7Fz_okZJJE",
  authDomain: "gomeria-cyc-pwa-bd2.firebaseapp.com",
  projectId: "gomeria-cyc-pwa-bd2",
  storageBucket: "gomeria-cyc-pwa-bd2.firebasestorage.app",
  messagingSenderId: "535048948402",
  appId: "1:535048948402:web:6c1a8bb723bdf31a7397ab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
