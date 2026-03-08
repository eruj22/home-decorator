// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBHsQqF41KbIhBllzN45dJBthEgqWq8ETE',
  authDomain: 'homedecorator-e7755.firebaseapp.com',
  projectId: 'homedecorator-e7755',
  storageBucket: 'homedecorator-e7755.firebasestorage.app',
  messagingSenderId: '780079153787',
  appId: '1:780079153787:web:5fb23020feadc41e6998de',
  measurementId: 'G-3SRL4EKSDF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);

export { app, auth };
