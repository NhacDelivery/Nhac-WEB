import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configurações extraídas do projeto Flutter (firebase_options.dart)
const firebaseConfig = {
  apiKey: "AIzaSyB9edB-cEsuCSYRDgCICvAWR2X-gfwnSm8",
  authDomain: "nhac-backend.firebaseapp.com",
  projectId: "nhac-backend",
  storageBucket: "nhac-backend.firebasestorage.app",
  messagingSenderId: "261563193700",
  appId: "1:261563193700:web:bc77d37e46a0a3e7eec271",
  measurementId: "G-NMK7N0DG3W"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Instâncias para os serviços que usaremos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
