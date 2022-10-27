import {
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
} from "firebase/firestore";
import { app, firestore } from "./init";

// const docRef = await addDoc(collection(firestore, "test"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815,
// });

export const setUserData = (uid: string, data) => {
    setDoc(doc(firestore, `userData/${uid}`), data, { merge: true });
};
