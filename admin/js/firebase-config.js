import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIGURATION
========================================================= */
const firebaseConfig = {

    apiKey: "AIzaSyBMBD3UTkZ68RUn5OEQoDv2pW3vxA597PY",

    authDomain:
        "sun-shine-club-537fe.firebaseapp.com",

    projectId:
        "sun-shine-club-537fe",

    storageBucket:
        "sun-shine-club-537fe.firebasestorage.app",

    messagingSenderId:
        "956993375783",

    appId:
        "1:956993375783:web:65825571a8355650a44802"

};

/* =========================================================
   INITIALIZE FIREBASE
========================================================= */
const app =
    initializeApp(firebaseConfig);

/* =========================================================
   SERVICES
========================================================= */
const auth =
    getAuth(app);


const db =
    getFirestore(app);

/* =========================================================
   EXPORT
========================================================= */
export {
    app,
    auth,
    db
};