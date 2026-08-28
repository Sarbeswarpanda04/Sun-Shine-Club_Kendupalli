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
     * Change to "or" if you want Odia by default.
     *
     * Later this can be connected to your
     * website language selector.
     */

    const language = "en";


    /* =================================================
       LOAD NOTICES
    ================================================= */

    async function loadNotices() {

        try {

            const response =
                await fetch(
                    "data/notices.json",
                    {
                        cache: "no-cache"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const notices =
                await response.json();


            if (
                !Array.isArray(notices) ||
                notices.length === 0
            ) {

                return;

            }


            const activeNotice =
                getActiveNotice(notices);


            if (!activeNotice) {

                return;

            }


            displayNotice(activeNotice);


        } catch (error) {

            console.error(
                "Notice loading error:",
                error
            );

            /*
             * Hide the announcement if JSON
             * cannot be loaded.
             */

            noticeBar.classList.remove("show");

        }

    }


    /* =================================================
       FIND ACTIVE NOTICE
    ================================================= */

    function getActiveNotice(notices) {

        const now =
            new Date();


        const active =
            notices.filter(notice => {

                if (!notice.publishedAt) {
                    return false;
                }


                const published =
                    new Date(
                        `${notice.publishedAt}T00:00:00`
                    );


                /*
                 * Expiry is optional.
                 * If there is no expiry date,
                 * the notice remains active.
                 */

                let expires = null;


                if (notice.expiresAt) {

                    expires =
                        new Date(
                            `${notice.expiresAt}T23:59:59`
                        );

                }


                if (now < published) {
                    return false;
                }


                if (
                    expires &&
                    now > expires
                ) {

                    return false;

                }


                return true;

            });


        if (active.length === 0) {
            return null;
        }


        /*
         * Pinned notices first.
         */

        active.sort((a, b) => {

            if (
                Boolean(b.pinned) !==
                Boolean(a.pinned)
            ) {

                return b.pinned ? 1 : -1;

            }


            return (
                new Date(b.publishedAt) -
                new Date(a.publishedAt)
            );

        });


        return active[0];

    }


    /* =================================================
       DISPLAY NOTICE
    ================================================= */

    function displayNotice(notice) {

        const title =
            notice.title?.[language] ||
            notice.title?.en ||
            "Announcement";


        const venue =
            notice.venue?.[language] ||
            notice.venue?.en ||
            "";


        noticeTitle.textContent =
            title;


        /* =============================================
           PINNED
        ============================================== */

        if (notice.pinned) {

            noticePinned.style.display =
                "inline-flex";

        } else {

            noticePinned.style.display =
                "none";

        }


        /* =============================================
           IMPORTANT LABEL
        ============================================== */

        if (notice.important) {

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


        if (notice.date) {

            const date =
                formatDate(notice.date);


            noticeMeta.appendChild(
                createMetaItem(
                    "fa-regular fa-calendar",
                    date
                )
            );

        }


        if (notice.time) {

            noticeMeta.appendChild(
                createMetaItem(
                    "fa-regular fa-clock",
                    notice.time
                )
            );

        }


        if (venue) {

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

        if (notice.link) {

            noticeView.href =
                notice.link;

            noticeView.style.display =
                "inline-flex";

        } else {

            noticeView.style.display =
                "none";

        }


        /* =============================================
           SHOW
        ============================================== */

        noticeProgress.style.animation =
            "none";


        /*
         * Force browser reflow so the
         * countdown restarts correctly.
         */

        void noticeProgress.offsetWidth;


        noticeProgress.style.animation =
            "noticeCountdown 15s linear forwards";


        noticeBar.classList.add("show");


        clearTimeout(noticeTimer);


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
            document.createElement("span");


        const icon =
            document.createElement("i");


        icon.className =
            iconClass;


        icon.setAttribute(
            "aria-hidden",
            "true"
        );


        span.appendChild(icon);


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

    function formatDate(dateString) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return dateString;

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

        clearTimeout(noticeTimer);

        noticeBar.classList.remove("show");

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