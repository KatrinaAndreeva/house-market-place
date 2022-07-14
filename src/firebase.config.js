import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDqCCc34CDaiyQOMevIlm8xBMQ8VjDZNEc',
  authDomain: 'house-marketplace-app-15372.firebaseapp.com',
  projectId: 'house-marketplace-app-15372',
  storageBucket: 'house-marketplace-app-15372.appspot.com',
  messagingSenderId: '725506420490',
  appId: '1:725506420490:web:749c55e38b991f481594f3',
};

// Initialize Firebase

initializeApp(firebaseConfig);
export const db = getFirestore();
