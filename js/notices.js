/* =====================================================
   NOTICE / ANNOUNCEMENT PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const noticeList =
        document.getElementById("noticeList");

    const pinnedNotices =
        document.getElementById("pinnedNotices");

    const pinnedSection =
        document.getElementById("pinnedSection");

    const noticeCount =
        document.getElementById("noticeCount");

    const noticeEmpty =
        document.getElementById("noticeEmpty");

    const noticeLoading =
        document.getElementById("noticeLoading");

    const noticeSearch =
        document.getElementById("noticeSearch");

    const languageButtons =
        document.querySelectorAll(
            ".language-btn"
        );

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    let notices = [];

    let currentLanguage = "en";

    let currentFilter = "all";


    /* =================================================
       LOAD JSON
    ================================================= */

    async function loadNotices() {

        try {

            const response =
                await fetch(
                    "../data/notices.json",
                    {
                        cache: "no-cache"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            notices =
                await response.json();


            if (
                !Array.isArray(notices)
            ) {

                throw new Error(
                    "Invalid notices.json format"
                );

            }


            noticeLoading.style.display =
                "none";


            renderNotices();


        } catch (error) {

            console.error(
                "Notice loading error:",
                error
            );


            noticeLoading.innerHTML = `

                <p>
                    Unable to load notices.
                </p>

            `;

        }

    }


    /* =================================================
       DATE HELPERS
    ================================================= */

    function getDate(
        dateString,
        endOfDay = false
    ) {

        if (!dateString) {
            return null;
        }


        return new Date(
            `${dateString}T${
                endOfDay
                    ? "23:59:59"
                    : "00:00:00"
            }`
        );

    }


    function formatDate(
        dateString
    ) {

        const date =
            getDate(dateString);


        if (
            !date ||
            Number.isNaN(date.getTime())
        ) {

            return dateString || "";

        }


        return date.toLocaleDateString(
            currentLanguage === "or"
                ? "or-IN"
                : "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* =================================================
       ACTIVE NOTICE
    ================================================= */

    function isActive(notice) {

        const now =
            new Date();


        const published =
            getDate(
                notice.publishedAt
            );


        const expires =
            getDate(
                notice.expiresAt,
                true
            );


        if (
            published &&
            now < published
        ) {

            return false;

        }


        if (
            expires &&
            now > expires
        ) {

            return false;

        }


        return true;

    }


    /* =================================================
       UPCOMING
    ================================================= */

    function isUpcoming(notice) {

        const eventDate =
            getDate(
                notice.date
            );


        if (!eventDate) {
            return false;
        }


        return eventDate >= new Date();

    }


    /* =================================================
       FILTER
    ================================================= */

    function getFilteredNotices() {

        const search =
            noticeSearch.value
                .trim()
                .toLowerCase();


        let result =
            notices.filter(notice => {

                /*
                 * Search across both languages.
                 */

                const titleEn =
                    notice.title?.en || "";

                const titleOr =
                    notice.title?.or || "";

                const descriptionEn =
                    notice.description?.en || "";

                const descriptionOr =
                    notice.description?.or || "";


                const searchable =
                    `
                    ${titleEn}
                    ${titleOr}
                    ${descriptionEn}
                    ${descriptionOr}
                    `.toLowerCase();


                return (
                    !search ||
                    searchable.includes(search)
                );

            });


        /* =============================================
           CURRENT FILTER
        ============================================== */

        if (
            currentFilter === "important"
        ) {

            result =
                result.filter(
                    notice =>
                        notice.important === true
                );

        }


        if (
            currentFilter === "upcoming"
        ) {

            result =
                result.filter(
                    notice =>
                        isActive(notice) &&
                        isUpcoming(notice)
                );

        }


        if (
            currentFilter === "archive"
        ) {

            result =
                result.filter(
                    notice =>
                        !isActive(notice)
                );

        }


        return result;

    }


    /* =================================================
       SORT
    ================================================= */

    function sortNotices(list) {

        return [...list].sort(
            (a, b) => {

                /*
                 * Pinned first
                 */

                if (
                    Boolean(a.pinned) !==
                    Boolean(b.pinned)
                ) {

                    return b.pinned
                        ? 1
                        : -1;

                }


                /*
                 * Latest publication first
                 */

                const dateA =
                    getDate(
                        a.publishedAt
                    ) || 0;

                const dateB =
                    getDate(
                        b.publishedAt
                    ) || 0;


                return dateB - dateA;

            }
        );

    }


    /* =================================================
       RENDER
    ================================================= */

    function renderNotices() {

        const filtered =
            sortNotices(
                getFilteredNotices()
            );


        /*
         * Active notices for pinned section
         */

        const pinned =
            sortNotices(
                notices.filter(
                    notice =>
                        notice.pinned === true &&
                        isActive(notice)
                )
            );


        renderPinned(
            pinned
        );


        renderNoticeList(
            filtered
        );


        noticeCount.textContent =
            filtered.length;


        if (
            filtered.length === 0
        ) {

            noticeEmpty.hidden =
                false;

        } else {

            noticeEmpty.hidden =
                true;

        }

    }


    /* =================================================
       PINNED
    ================================================= */

    function renderPinned(list) {

        pinnedNotices.innerHTML =
            "";


        if (
            list.length === 0
        ) {

            pinnedSection.style.display =
                "none";

            return;

        }


        pinnedSection.style.display =
            "";


        /*
         * Show maximum 3 pinned notices.
         */

        list
            .slice(0, 3)
            .forEach(notice => {

                pinnedNotices.appendChild(
                    createNoticeCard(
                        notice
                    )
                );

            });

    }


    /* =================================================
       NORMAL LIST
    ================================================= */

    function renderNoticeList(list) {

        noticeList.innerHTML =
            "";


        list.forEach(notice => {

            noticeList.appendChild(
                createNoticeCard(
                    notice
                )
            );

        });

    }


    /* =================================================
       CREATE CARD
    ================================================= */

    function createNoticeCard(
        notice
    ) {

        const card =
            document.createElement("article");


        card.className =
            "notice-card";


        if (notice.pinned) {

            card.classList.add(
                "pinned"
            );

        }


        const title =
            notice.title?.[
                currentLanguage
            ] ||
            notice.title?.en ||
            "Announcement";


        const description =
            notice.description?.[
                currentLanguage
            ] ||
            notice.description?.en ||
            "";


        const venue =
            notice.venue?.[
                currentLanguage
            ] ||
            notice.venue?.en ||
            "";


        const eventDate =
            notice.date
                ? formatDate(
                    notice.date
                )
                : "";


        const published =
            notice.publishedAt
                ? formatDate(
                    notice.publishedAt
                )
                : "";


        card.innerHTML = `

            <div class="notice-card-top">

                <span class="notice-type">

                    <i
                        class="fa-solid fa-bullhorn"
                        aria-hidden="true"
                    ></i>

                    ${
                        notice.important
                            ? (
                                currentLanguage === "or"
                                    ? "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ"
                                    : "IMPORTANT"
                            )
                            : (
                                currentLanguage === "or"
                                    ? "ଘୋଷଣା"
                                    : "ANNOUNCEMENT"
                            )
                    }

                </span>


                ${
                    notice.pinned
                        ? `
                            <span class="notice-pinned-badge">

                                <i
                                    class="fa-solid fa-thumbtack"
                                    aria-hidden="true"
                                ></i>

                                ${
                                    currentLanguage === "or"
                                        ? "ପିନ୍"
                                        : "Pinned"
                                }

                            </span>
                        `
                        : ""
                }

            </div>


            <h3>
                ${escapeHTML(title)}
            </h3>


            ${
                description
                    ? `
                        <p class="notice-description">
                            ${escapeHTML(description)}
                        </p>
                    `
                    : ""
            }


            <div class="notice-details">


                ${
                    eventDate
                        ? `
                            <div class="notice-detail">

                                <i
                                    class="fa-regular fa-calendar"
                                    aria-hidden="true"
                                ></i>

                                <span>
                                    ${escapeHTML(eventDate)}
                                </span>

                            </div>
                        `
                        : ""
                }


                ${
                    notice.time
                        ? `
                            <div class="notice-detail">

                                <i
                                    class="fa-regular fa-clock"
                                    aria-hidden="true"
                                ></i>

                                <span>
                                    ${escapeHTML(
                                        notice.time
                                    )}
                                </span>

                            </div>
                        `
                        : ""
                }


                ${
                    venue
                        ? `
                            <div class="notice-detail">

                                <i
                                    class="fa-solid fa-location-dot"
                                    aria-hidden="true"
                                ></i>

                                <span>
                                    ${escapeHTML(venue)}
                                </span>

                            </div>
                        `
                        : ""
                }

            </div>


            <div class="notice-card-bottom">

                <span class="notice-published">

                    ${
                        currentLanguage === "or"
                            ? "ପ୍ରକାଶିତ"
                            : "Published"
                    }

                    ${escapeHTML(published)}

                </span>


                <div class="notice-actions">

                    ${
                        notice.link
                            ? `
                                <a
                                    href="${escapeAttribute(
                                        notice.link
                                    )}"
                                    class="notice-view"
                                >

                                    ${
                                        currentLanguage === "or"
                                            ? "ବିବରଣୀ"
                                            : "View Details"
                                    }

                                    <i
                                        class="fa-solid fa-arrow-right"
                                        aria-hidden="true"
                                    ></i>

                                </a>
                            `
                            : ""
                    }


                    <button
                        type="button"
                        class="notice-action notice-share"
                        aria-label="Share notice"
                    >

                        <i
                            class="fa-solid fa-share-nodes"
                            aria-hidden="true"
                        ></i>

                    </button>

                </div>

            </div>

        `;


        /*
         * Share button
         */

        const shareButton =
            card.querySelector(
                ".notice-share"
            );


        shareButton?.addEventListener(
            "click",
            () => {

                shareNotice(
                    notice,
                    title
                );

            }
        );


        return card;

    }


    /* =================================================
       SHARE
    ================================================= */

    async function shareNotice(
        notice,
        title
    ) {

        const shareData = {

            title:
                `${title} | Sun Shine Club Kendupalli`,

            text:
                notice.description?.[
                    currentLanguage
                ] ||
                title,

            url:
                new URL(
                    "notices.html",
                    window.location.href
                ).href

        };


        try {

            if (
                navigator.share
            ) {

                await navigator.share(
                    shareData
                );

            } else {

                await navigator.clipboard.writeText(
                    shareData.url
                );


                alert(
                    currentLanguage === "or"
                        ? "ଲିଙ୍କ କପି ହୋଇଛି।"
                        : "Notice link copied."
                );

            }

        } catch (error) {

            /*
             * User cancelled share.
             */

            if (
                error.name !==
                "AbortError"
            ) {

                console.error(
                    "Share error:",
                    error
                );

            }

        }

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    function escapeAttribute(value) {

        return escapeHTML(value);

    }


    /* =================================================
       LANGUAGE SWITCH
    ================================================= */

    languageButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    currentLanguage =
                        button.dataset.language;


                    languageButtons
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    /*
                     * Update page language.
                     */

                    document.documentElement.lang =
                        currentLanguage === "or"
                            ? "or"
                            : "en";


                    /*
                     * Update search placeholder.
                     */

                    noticeSearch.placeholder =
                        currentLanguage === "or"
                            ? "ସୂଚନା ଖୋଜନ୍ତୁ..."
                            : "Search notices...";


                    renderNotices();

                }
            );

        }
    );


    /* =================================================
       FILTER
    ================================================= */

    filterButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    currentFilter =
                        button.dataset.filter;


                    filterButtons
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    renderNotices();

                }
            );

        }
    );


    /* =================================================
       SEARCH
    ================================================= */

    noticeSearch.addEventListener(
        "input",
        renderNotices
    );


    /* =================================================
       START
    ================================================= */

    loadNotices();

});