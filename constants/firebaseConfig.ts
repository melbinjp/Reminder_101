// constants/firebaseConfig.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCPCykdDTxD3g3Eietihhyu4bPF2oQ9X8I",
  authDomain: "reminder-demo-83587.firebaseapp.com",
  projectId: "reminder-demo-83587",
  storageBucket: "reminder-demo-83587.firebasestorage.app",
  messagingSenderId: "84469383761",
  appId: "1:84469383761:web:18f03712d3581d09fbee70",
  measurementId: "G-9RK08MHQZB"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export { firebaseConfig }; // Exported for use in Recaptcha
