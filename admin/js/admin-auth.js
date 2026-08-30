import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


console.log("Admin authentication system loaded");


onAuthStateChanged(
    auth,
    async (user) => {

        console.log(
            "Auth state changed:",
            user
        );


        /* =========================================
           USER NOT LOGGED IN
        ========================================= */

        if (!user) {

            console.log(
                "No authenticated user"
            );

            redirectToLogin();

            return;

        }


        console.log(
            "Authenticated user:",
            user.email
        );

        console.log(
            "Firebase UID:",
            user.uid
        );


        try {

            /* =========================================
               ADMIN DOCUMENT
            ========================================= */

            const adminRef =
                doc(
                    db,
                    "admins",
                    user.uid
                );


            console.log(
                "Checking Firestore document:",
                `admins/${user.uid}`
            );


            const adminSnapshot =
                await getDoc(adminRef);


            console.log(
                "Firestore document exists:",
                adminSnapshot.exists()
            );

            document.dispatchEvent(
    new CustomEvent("adminAuthenticated", {
        detail: {
            user: user,
            admin: adminSnapshot.data()
        }
    })
);


            /* =========================================
               DOCUMENT NOT FOUND
            ========================================= */

            if (
                !adminSnapshot.exists()
            ) {

                console.error(
                    "ADMIN DOCUMENT NOT FOUND"
                );


                showAuthorizationError(
                    "Your Google account is authenticated, but it has not been authorized as an administrator."
                );


                await signOut(auth);

                return;

            }


            const adminData =
                adminSnapshot.data();


            console.log(
                "Admin data:",
                adminData
            );


            /* =========================================
               CHECK ACTIVE
            ========================================= */

            if (
                adminData.active !== true
            ) {

                console.error(
                    "ADMIN ACCOUNT IS NOT ACTIVE"
                );


                showAuthorizationError(
                    "Your administrator account is currently inactive."
                );


                await signOut(auth);

                return;

            }


            /* =========================================
               CHECK ROLE
            ========================================= */

            if (
                adminData.role !== "admin"
            ) {

                console.error(
                    "INVALID ADMIN ROLE:",
                    adminData.role
                );


                showAuthorizationError(
                    "Your account does not have administrator privileges."
                );


                await signOut(auth);

                return;

            }


            /* =========================================
               SUCCESS
            ========================================= */

            console.log(
                "================================"
            );

            console.log(
                "ADMIN AUTHORIZATION SUCCESS"
            );

            console.log(
                "================================"
            );


            document.dispatchEvent(
                new CustomEvent(
                    "adminAuthenticated",
                    {
                        detail: {
                            user: user,
                            admin: adminData
                        }
                    }
                )
            );

        } catch (error) {

            console.error(
                "================================"
            );

            console.error(
                "FIRESTORE ADMIN CHECK FAILED"
            );

            console.error(
                "Error code:",
                error.code
            );

            console.error(
                "Error message:",
                error.message
            );

            console.error(
                error
            );

            console.error(
                "================================"
            );


            showAuthorizationError(
                `Authorization error: ${error.code || error.message}`
            );

        }

    }
);


/* =========================================================
   SHOW ERROR WITHOUT REDIRECTING
========================================================= */

function showAuthorizationError(
    message
) {

    const element =
        document.getElementById(
            "adminWelcome"
        );


    if (element) {

        element.textContent =
            message;

        element.style.color =
            "#d93025";

    }

}


/* =========================================================
   REDIRECT
========================================================= */

function redirectToLogin() {

    window.location.href =
        "index.html";

}


/* =========================================================
   LOGOUT
========================================================= */

export async function adminLogout() {

    try {

        await signOut(auth);

        window.location.href =
            "index.html";

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


/* =========================================================
   CURRENT ADMIN
========================================================= */

export function getCurrentAdmin() {

    return auth.currentUser;

}