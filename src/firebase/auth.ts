import { app, auth, firestore } from "./init";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut as logOut,
    sendEmailVerification,
    type User,
} from "firebase/auth";
import { writable, type Writable } from "svelte/store";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");

export const createEmailPassword = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);
export const signInEmailPassword = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
export const signInGoogle = () => signInWithPopup(auth, googleProvider);
export const signOut = () => logOut(auth);

export const verifyEmail = (user: User) => sendEmailVerification(user);

export const currentUser: Writable<string | null | User> = writable("loading");

let userDataListener = null;

export const currentUsername = writable("");
export const currentPhoto = writable("assets/default_user.png");

onAuthStateChanged(auth, async user => {
    console.log(user);
    if (user) {
        currentUser.set(user);

        if (userDataListener != null) {
            userDataListener();
        }
        userDataListener = onSnapshot(
            doc(firestore, `userData/${user.uid}`),
            snapshot => {
                let data = snapshot.data();
                currentUsername.set(data.username);
                currentPhoto.set(data.photo);
            }
        );
    } else {
        currentUser.set(null);
        if (userDataListener != null) {
            userDataListener();
        }
        currentUsername.set("");
        currentPhoto.set("assets/default_user.png");
    }
});
