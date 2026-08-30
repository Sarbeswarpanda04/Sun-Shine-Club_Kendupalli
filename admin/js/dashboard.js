import {
    adminLogout
} from "./admin-auth.js";


/* =========================================================
   ELEMENTS
========================================================= */

const welcomeName =
    document.getElementById("welcomeName");

const topbarName =
    document.getElementById("topbarName");

const sidebarName =
    document.getElementById("sidebarName");

const sidebarEmail =
    document.getElementById("sidebarEmail");

const topbarAvatar =
    document.getElementById("topbarAvatar");

const sidebarAvatar =
    document.getElementById("sidebarAvatar");


/* =========================================================
   ADMIN AUTHENTICATED
========================================================= */

document.addEventListener(
    "adminAuthenticated",
    event => {

        const user =
            event.detail.user;

        const admin =
            event.detail.admin;


        const name =
            admin.name ||
            user.displayName ||
            "Administrator";


        const email =
            admin.email ||
            user.email ||
            "";


        /* -----------------------------------------
           NAMES
        ----------------------------------------- */

        if (welcomeName) {

            welcomeName.textContent =
                name;

        }


        if (topbarName) {

            topbarName.textContent =
                name;

        }


        if (sidebarName) {

            sidebarName.textContent =
                name;

        }


        /* -----------------------------------------
           EMAIL
        ----------------------------------------- */

        if (sidebarEmail) {

            sidebarEmail.textContent =
                email;

        }


        /* -----------------------------------------
           AVATAR
        ----------------------------------------- */

        const firstLetter =
            name
                .trim()
                .charAt(0)
                .toUpperCase();


        if (topbarAvatar) {

            topbarAvatar.textContent =
                firstLetter;

        }


        if (sidebarAvatar) {

            sidebarAvatar.textContent =
                firstLetter;

        }

    }
);


/* =========================================================
   LOGOUT
========================================================= */

document
    .getElementById("sidebarLogout")
    ?.addEventListener(
        "click",
        adminLogout
    );


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const sidebar =
    document.getElementById(
        "adminSidebar"
    );

const overlay =
    document.getElementById(
        "sidebarOverlay"
    );

const menuButton =
    document.getElementById(
        "mobileMenuButton"
    );


function openSidebar() {

    sidebar?.classList.add(
        "open"
    );

    overlay?.classList.add(
        "show"
    );

    document.body.classList.add(
        "menu-open"
    );

}


function closeSidebar() {

    sidebar?.classList.remove(
        "open"
    );

    overlay?.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "menu-open"
    );

}


menuButton?.addEventListener(
    "click",
    openSidebar
);


overlay?.addEventListener(
    "click",
    closeSidebar
);


/* =========================================================
   CLOSE MENU AFTER NAVIGATION
========================================================= */

document
    .querySelectorAll(".admin-nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeSidebar
        );

    });