import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import * as firebase from "firebase";
// import "firebase/firestore";
//import {...} from "firebase/database";
//import {...} from "firebase/auth";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
// Client Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_gKJyiI8oSPeeJ9V3jL8pSqsGRK41smU",
  authDomain: "happimynd-eef42.firebaseapp.com",
  projectId: "happimynd-eef42",
  storageBucket: "happimynd-eef42.appspot.com",
  messagingSenderId: "1017982237328",
  appId: "1:1017982237328:web:af1428e7fa8e26d7457615",
};

// Ashish Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDBan3ka2_rEEEvkMD7ahWcA7DCP__lM9E",
//   authDomain: "happymynd-cd2a5.firebaseapp.com",
//   projectId: "happymynd-cd2a5",
//   storageBucket: "happymynd-cd2a5.appspot.com",
//   messagingSenderId: "169628224865",
//   appId: "1:169628224865:web:e35ac3b06c29a3847cc920",
// };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
console.log("The app res - ", app);
// initializeApp(firebaseConfig);

// Creating database instance
const db = getFirestore();

export { db };
