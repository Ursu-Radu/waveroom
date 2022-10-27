import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDQXlt1BUSacqBE4mH5Hx2Bsubm8lqoQAc",
    authDomain: "waveroom-48548.firebaseapp.com",
    projectId: "waveroom-48548",
    storageBucket: "waveroom-48548.appspot.com",
    messagingSenderId: "151444960547",
    appId: "1:151444960547:web:5f5630f4bf2e4be31a4896",
    measurementId: "G-ZCK51WKRGB",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
// const analytics = getAnalytics(app);
