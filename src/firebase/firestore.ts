import {
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { app, firestore } from "./init";

// const docRef = await addDoc(collection(firestore, "test"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815,
// });

export const createUserData = async (
    uid: string,
    username: string,
    photo: null | string
) => {
    let data = {
        username,
        rooms: [],
    };
    if (photo != null) {
        data["photo"] = photo;
    }
    await setUserData(uid, data);
};

export const setUserData = async (uid: string, data) => {
    if (uid != null)
        await setDoc(doc(firestore, `userData/${uid}`), data, { merge: true });
};
export const userExists = async (uid: string) =>
    (await getDoc(doc(firestore, `userData/${uid}`))).exists();

export const createRoom = (name: string) => {
    const batch = writeBatch(firestore);
    let newDataDoc = doc(collection(firestore, "roomData"));
    batch.set(newDataDoc, { name });
    batch.set(doc(firestore, `roomIDs/${newDataDoc.id.substring(0, 8)}`), {
        id: newDataDoc.id,
    });
    batch.commit();
};
