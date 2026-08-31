/* =========================================================
   DASHBOARD
   Sun Shine Club Kendupalli
========================================================= */

import {
    db
} from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

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
   DASHBOARD STAT ELEMENTS
========================================================= */

const membersCount =
    document.getElementById("membersCount");

const noticesCount =
    document.getElementById("noticesCount");

const eventsCount =
    document.getElementById("eventsCount");

const galleryCount =
    document.getElementById("galleryCount");


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


        /* -----------------------------------------
           LOAD DASHBOARD DATA
        ----------------------------------------- */

        loadDashboardData();
    }
);


/* =========================================================
   LOAD DASHBOARD DATA
========================================================= */

async function loadDashboardData() {

    console.log(
        "Loading dashboard data..."
    );


    try {

        const [
            membersSnapshot,
            noticesSnapshot,
            eventsSnapshot,
            gallerySnapshot
        ] = await Promise.all([

            getDocs(
                collection(
                    db,
                    "members"
                )
            ),

            getDocs(
                collection(
                    db,
                    "notices"
                )
            ),

            getDocs(
                collection(
                    db,
                    "events"
                )
            ),

            getDocs(
                collection(
                    db,
                    "gallery"
                )
            )

        ]);


        /* -----------------------------------------
           COUNTS
        ----------------------------------------- */

        const members =
            membersSnapshot.size;

        const notices =
            noticesSnapshot.size;

        const events =
            eventsSnapshot.size;

        const gallery =
            gallerySnapshot.size;


        console.log(
            "Dashboard counts:",
            {
                members,
                notices,
                events,
                gallery
            }
        );


        /* -----------------------------------------
           UPDATE UI
        ----------------------------------------- */

        if (membersCount) {
            membersCount.textContent =
                members;
        }

        if (noticesCount) {
            noticesCount.textContent =
                notices;
        }

        if (eventsCount) {
            eventsCount.textContent =
                events;
        }

        if (galleryCount) {
            galleryCount.textContent =
                gallery;
        }


    } catch (error) {

        console.error(
            "Unable to load dashboard data:",
            error
        );


        /*
         * Don't leave the dashboard showing
         * an empty em dash when loading fails.
         */

        if (membersCount) {
            membersCount.textContent = "!";
        }

        if (noticesCount) {
            noticesCount.textContent = "!";
        }

        if (eventsCount) {
            eventsCount.textContent = "!";
        }

        if (galleryCount) {
            galleryCount.textContent = "!";
        }

    }

}


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