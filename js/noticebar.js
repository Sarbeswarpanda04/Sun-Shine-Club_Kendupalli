import { db } from "../admin/js/firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =====================================================
   NOTICE / ANNOUNCEMENT SYSTEM
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const noticeBar =
        document.getElementById("noticeBar");

    const noticeClose =
        document.getElementById("noticeClose");

    const noticeTitle =
        document.getElementById("noticeTitle");

    const noticeMeta =
        document.getElementById("noticeMeta");

    const noticeView =
        document.getElementById("noticeView");

    const noticePinned =
        document.getElementById("noticePinned");

    const noticeLabel =
        document.getElementById("noticeLabel");

    const noticeProgress =
        document.getElementById("noticeProgress");


    if (!noticeBar) return;


    let noticeTimer = null;


    /* =================================================
       LANGUAGE
    ================================================= */

    /*
        Change to "or" if you want Odia by default.
    */

    const language = "en";


    /* =================================================
       FIRESTORE DATE HELPER
    ================================================= */

    function convertFirestoreDate(value) {

        if (!value) {
            return null;
        }


        /*
            Firestore Timestamp
        */

        if (
            typeof value === "object" &&
            typeof value.toDate === "function"
        ) {
            return value.toDate();
        }


        /*
            JavaScript Date
        */

        if (value instanceof Date) {
            return value;
        }


        /*
            Firestore timestamp object
            { seconds, nanoseconds }
        */

        if (
            typeof value === "object" &&
            typeof value.seconds === "number"
        ) {
            return new Date(
                value.seconds * 1000
            );
        }


        /*
            String / number
        */

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return null;
        }


        return date;
    }


    /* =================================================
       DATE ONLY HELPER
    ================================================= */

    function dateOnly(value) {

        if (!value) {
            return null;
        }


        /*
            If Firebase Timestamp
        */

        if (
            typeof value === "object" &&
            typeof value.toDate === "function"
        ) {
            const date = value.toDate();

            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
        }


        /*
            If string like:
            2026-09-01
        */

        if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(value)
        ) {

            const [year, month, day] =
                value.split("-").map(Number);

            return new Date(
                year,
                month - 1,
                day
            );
        }


        return convertFirestoreDate(value);
    }


    /* =================================================
       LOAD NOTICES FROM FIREBASE
    ================================================= */

    async function loadNotices() {

        try {

            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "notices"
                    )
                );


            const notices = [];


            snapshot.forEach((docSnap) => {

                notices.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });

            });


            if (
                !Array.isArray(notices) ||
                notices.length === 0
            ) {

                hideNotice();

                return;
            }


            const activeNotice =
                getActiveNotice(notices);


            if (!activeNotice) {

                hideNotice();

                return;
            }


            displayNotice(
                activeNotice
            );


        } catch (error) {

            console.error(
                "Firebase notice loading error:",
                error
            );


            /*
                Hide announcement if
                Firebase cannot be loaded.
            */

            hideNotice();

        }

    }


    /* =================================================
       FIND ACTIVE NOTICE
    ================================================= */

    function getActiveNotice(notices) {

    const now = new Date();

    const active = notices.filter(notice => {

        // publishedAt is required
        if (!notice.publishedAt) {
            return false;
        }

        const published = dateOnly(notice.publishedAt);

        if (!published) {
            return false;
        }

        // Not published yet
        if (now < published) {
            return false;
        }

        // expiresAt is optional
        if (notice.expiresAt) {

            const expires = dateOnly(notice.expiresAt);

            if (expires) {

                // Active through the entire expiry date
                expires.setHours(
                    23,
                    59,
                    59,
                    999
                );

                if (now > expires) {
                    return false;
                }
            }
        }

        return true;
    });


    if (active.length === 0) {
        return null;
    }


    // Pinned notices first
    active.sort((a, b) => {

        if (
            Boolean(b.pinned) !==
            Boolean(a.pinned)
        ) {
            return b.pinned ? 1 : -1;
        }


        const dateA =
            dateOnly(a.publishedAt);

        const dateB =
            dateOnly(b.publishedAt);


        if (dateA && dateB) {
            return (
                dateB.getTime() -
                dateA.getTime()
            );
        }


        return 0;
    });


    return active[0];
}


    /* =================================================
       DISPLAY NOTICE
    ================================================= */

    function displayNotice(notice) {

        /*
            Title
        */

        const title =
            notice.title?.[language] ||
            notice.title?.en ||
            notice.title?.or ||
            notice.title ||
            "Announcement";


        /*
            Venue
        */

        const venue =
            notice.venue?.[language] ||
            notice.venue?.en ||
            notice.venue?.or ||
            notice.venue ||
            "";


        noticeTitle.textContent =
            title;


        /* =============================================
           PINNED
        ============================================== */

        if (
            notice.pinned
        ) {

            noticePinned.style.display =
                "inline-flex";

        } else {

            noticePinned.style.display =
                "none";

        }


        /* =============================================
           IMPORTANT LABEL
        ============================================== */

        if (
            notice.important
        ) {

            noticeLabel.textContent =
                language === "or"
                    ? "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସୂଚନା"
                    : "IMPORTANT NOTICE";

        } else {

            noticeLabel.textContent =
                language === "or"
                    ? "ଘୋଷଣା"
                    : "ANNOUNCEMENT";

        }


        /* =============================================
           META
        ============================================== */

        noticeMeta.innerHTML = "";


        /*
            Date
        */

        if (
            notice.date
        ) {

            const date =
                formatDate(
                    notice.date
                );


            if (date) {

                noticeMeta.appendChild(
                    createMetaItem(
                        "fa-regular fa-calendar",
                        date
                    )
                );

            }

        }


        /*
            Time
        */

        if (
            notice.time
        ) {

            noticeMeta.appendChild(
                createMetaItem(
                    "fa-regular fa-clock",
                    notice.time
                )
            );

        }


        /*
            Venue
        */

        if (
            venue
        ) {

            noticeMeta.appendChild(
                createMetaItem(
                    "fa-solid fa-location-dot",
                    venue
                )
            );

        }


        /* =============================================
           VIEW LINK
        ============================================== */

        if (
            notice.link
        ) {

            noticeView.href =
                notice.link;

            noticeView.style.display =
                "inline-flex";

        } else {

            noticeView.style.display =
                "none";

            noticeView.removeAttribute(
                "href"
            );

        }


        /* =============================================
           PROGRESS BAR
        ============================================== */

        noticeProgress.style.animation =
            "none";


        /*
            Force browser reflow so
            countdown restarts correctly.
        */

        void noticeProgress.offsetWidth;


        noticeProgress.style.animation =
            "noticeCountdown 15s linear forwards";


        /* =============================================
           SHOW NOTICE
        ============================================== */

        noticeBar.classList.add(
            "show"
        );


        clearTimeout(
            noticeTimer
        );


        noticeTimer =
            setTimeout(() => {

                hideNotice();

            }, 15000);

    }


    /* =================================================
       CREATE META ITEM
    ================================================= */

    function createMetaItem(
        iconClass,
        text
    ) {

        const span =
            document.createElement(
                "span"
            );


        const icon =
            document.createElement(
                "i"
            );


        icon.className =
            iconClass;


        icon.setAttribute(
            "aria-hidden",
            "true"
        );


        span.appendChild(
            icon
        );


        span.appendChild(
            document.createTextNode(
                text
            )
        );


        return span;

    }


    /* =================================================
       DATE FORMAT
    ================================================= */

    function formatDate(
        value
    ) {

        const date =
            dateOnly(
                value
            );


        if (!date) {

            return (
                typeof value === "string"
                    ? value
                    : ""
            );

        }


        return date.toLocaleDateString(

            language === "or"
                ? "or-IN"
                : "en-IN",

            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }

        );

    }


    /* =================================================
       HIDE NOTICE
    ================================================= */

    function hideNotice() {

        clearTimeout(
            noticeTimer
        );


        noticeBar.classList.remove(
            "show"
        );

    }


    /* =================================================
       CLOSE BUTTON
    ================================================= */

    noticeClose?.addEventListener(
        "click",
        hideNotice
    );


    /* =================================================
       LOAD
    ================================================= */

    loadNotices();

});