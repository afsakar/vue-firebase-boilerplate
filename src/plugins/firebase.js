import {initializeApp} from "firebase/app";
import { getAuth }from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebase = initializeApp({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
});

const db = getFirestore(firebase);
const auth = getAuth(firebase);
const storage = getStorage(firebase);

export {db, auth, storage}