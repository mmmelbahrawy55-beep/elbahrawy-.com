// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt6T-2e3ukDCNiQUBufSNjvXr0CuBxcAQ",
  authDomain: "elba7rawy-91214.firebaseapp.com",
  projectId: "elba7rawy-91214",
  storageBucket: "elba7rawy-91214.firebasestorage.app",
  messagingSenderId: "463849866258",
  appId: "1:463849866258:web:36d411c301f4aa006344cb",
  measurementId: "G-S3DGP71YPZ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore with offline persistence enabled
const db = initializeFirestore(app, {
  cacheSizeBytes: 40 * 1024 * 1024, // 40MB cache
})

export { db }
