import {
    auth
} from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


/* =========================================================
   ELEMENTS
========================================================= */

const googleLogin =
    document.getElementById("googleLogin");

const googleLoginText =
    document.getElementById("googleLoginText");

const loginSpinner =
    document.getElementById("loginSpinner");

const loginError =
    document.getElementById("loginError");


/* =========================================================
   GOOGLE PROVIDER
========================================================= */

const provider =
    new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
});


/* =========================================================
   GOOGLE LOGIN
========================================================= */

googleLogin?.addEventListener(
    "click",
    async () => {

        clearError();

        setLoading(true);

        try {

            const result =
                await signInWithPopup(
                    auth,
                    provider
                );


            const user =
                result.user;


            console.log(
                "Google login successful"
            );

            console.log(
                "Firebase UID:",
                user.uid
            );

            console.log(
                "Email:",
                user.email
            );


            /*
             * Authentication successful.
             *
             * dashboard.html will perform the
             * admin authorization check.
             */

            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Google login error:",
                error
            );


            showError(
                getGoogleErrorMessage(
                    error.code
                )
            );


            setLoading(false);

        }

    }
);


/* =========================================================
   LOADING
========================================================= */

function setLoading(
    loading
) {

    if (googleLogin) {

        googleLogin.disabled =
            loading;

    }


    if (loginSpinner) {

        loginSpinner.hidden =
            !loading;

    }


    if (googleLoginText) {

        googleLoginText.textContent =
            loading
                ? "Signing in..."
                : "Continue with Google";

    }

}


/* =========================================================
   ERROR
========================================================= */

function showError(
    message
) {

    if (!loginError) return;

    loginError.textContent =
        message;

    loginError.hidden =
        false;

}


function clearError() {

    if (!loginError) return;

    loginError.textContent =
        "";

    loginError.hidden =
        true;

}


/* =========================================================
   GOOGLE ERROR MESSAGES
========================================================= */

function getGoogleErrorMessage(
    code
) {

    switch (code) {

        case "auth/popup-closed-by-user":

            return "The Google sign-in window was closed.";


        case "auth/popup-blocked":

            return "Your browser blocked the Google sign-in popup.";


        case "auth/cancelled-popup-request":

            return "The sign-in request was cancelled.";


        case "auth/account-exists-with-different-credential":

            return "An account already exists with a different sign-in method.";


        case "auth/network-request-failed":

            return "Network error. Please check your connection.";


        case "auth/unauthorized-domain":

            return "This website domain is not authorized in Firebase.";


        default:

            return "Unable to sign in with Google. Please try again.";

    }

}