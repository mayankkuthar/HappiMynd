import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_gKJyiI8oSPeeJ9V3jL8pSqsGRK41smU",
  authDomain: "happimynd-eef42.firebaseapp.com",
  projectId: "happimynd-eef42",
  storageBucket: "happimynd-eef42.appspot.com",
  messagingSenderId: "1017982237328",
  appId: "1:1017982237328:web:af1428e7fa8e26d7457615",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
console.log("The app res - ", app);

// Anonymous auth — satisfies Firebase Storage & Firestore security rules
// without requiring user credentials. Matches the web version's approach.
const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => console.log("Firebase: signed in anonymously"))
  .catch((err) => console.log("Firebase anonymous auth error:", err.message));

// Creating database instance
// experimentalForceLongPolling fixes the "Could not reach Cloud Firestore backend"
// error in React Native, where the Firebase Web SDK's default WebSocket/gRPC
// transport is not reliably supported. Long polling uses standard HTTP requests instead.
let db;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (e) {
  // initializeFirestore throws if already initialized (e.g. hot reload),
  // so fall back to the existing instance.
  db = getFirestore(app);
}

export { db, auth };
