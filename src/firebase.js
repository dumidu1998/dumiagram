import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA3u1zP8sFZFGh7lTwDBsp9le7pEWG7Qtk",
    authDomain: "dumiagram.firebaseapp.com",
    projectId: "dumiagram",
    storageBucket: "dumiagram.appspot.com",
    messagingSenderId: "54582906229",
    appId: "1:54582906229:web:035d000b07fc67b21f173c"
});


const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };