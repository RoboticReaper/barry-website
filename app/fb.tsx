'use client'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from "firebase/analytics";
import { User } from "firebase/auth";
import { getMessaging, getToken } from 'firebase/messaging';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAedN_oS4-8m7k6xET-IolX06mTETF6Qeo",
  authDomain: "barry-s-tennis-website.firebaseapp.com",
  projectId: "barry-s-tennis-website",
  storageBucket: "barry-s-tennis-website.appspot.com",
  messagingSenderId: "99372135257",
  appId: "1:99372135257:web:8567fbb2f317cbd8f89248",
  measurementId: "G-VWN6D50QDC"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);

// export const messaging = getMessaging(app)
// getToken(messaging, {vapidKey: "BPQfqW2WyqX3PRhZh-i0Ssfim7SIgE0b4_Q40H7CVnkBvn_6sCPkLIHdZsdYnYjbnfTKH5JnX7HK1_QGpjOiiVU"}).then((currentToken)=>{
//   console.log("current token:")
//   console.log(currentToken)
// })

const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  // @ts-ignore
  setUser(user);
});

export const db = getFirestore(app);

export var user: User;

export function setUser(u: User) {
  user = u;
  var event = new CustomEvent("userChanged", {
    detail: {
      newUser: u,
    }
  })
  console.log("User has been updated");
  console.log(user)
  document.dispatchEvent(event);
}