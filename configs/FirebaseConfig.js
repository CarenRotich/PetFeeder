import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  getDatabase,
  ref,
  set,
  get,
  onValue,
  push,
  remove
} from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnN-fVm5zM9tZMHoLzCbpgNmEJL4uMfC8",
  authDomain: "petfeeder-c183a.firebaseapp.com",
  databaseURL: "https://petfeeder-c183a-default-rtdb.firebaseio.com",
  projectId: "petfeeder-c183a",
  storageBucket: "petfeeder-c183a.firebasestorage.app",
  messagingSenderId: "375530708732",
  appId: "1:375530708732:web:f6bc5b5eb23b76e2c64179",
  measurementId: "G-27D75EMLCB"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);

// Export Realtime Database functions
export { 
  ref,
  set,
  get,
  onValue,
  push,
  remove
};
