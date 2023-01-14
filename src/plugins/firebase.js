import {initializeApp} from "firebase/app";
import { getAuth }from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebase = initializeApp({
    apiKey: "AIzaSyApmNbf6I2JtjvXcgMeOntuwzY1eB2Gp74",
    authDomain: "vuebase-724e6.firebaseapp.com",
    projectId: "vuebase-724e6",
    storageBucket: "vuebase-724e6.appspot.com",
    messagingSenderId: "97512455113",
    appId: "1:97512455113:web:25bac76fc4d404a8650618",
});

const db = getFirestore(firebase);
const auth = getAuth(firebase);
const storage = getStorage(firebase);

export {db, auth, storage}