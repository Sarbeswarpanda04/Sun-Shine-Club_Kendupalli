/* =========================================================
   SUN SHINE CLUB
   NOTICE DETAIL - COMMON JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const shareButton =
        document.getElementById("noticeShare");

    const languageButtons =
        document.querySelectorAll(
            ".detail-language-btn"
        );

    let currentLanguage = "en";


    /* =====================================================
       LANGUAGE SWITCH
    ===================================================== */

    languageButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const language =
                    button.dataset.language;


                if (!language) {
                    return;
                }


                currentLanguage =
                    language;


                /*
                 * Update active button
                 */

                languageButtons.forEach(
                    item => {

                        item.classList.toggle(
                            "active",
                            item === button
                        );

                    }
                );


                /*
                 * Update document language
                 */

                document.documentElement.lang =
                    language === "or"
                        ? "or"
                        : "en";


                /*
                 * Toggle elements that have
                 * English/Odia content.
                 *
                 * Example:
                 *
                 * <span
                 *   data-en="Event Information"
                 *   data-or="ଇଭେଣ୍ଟ ସୂଚନା"
                 * ></span>
                 */

                document
                    .querySelectorAll(
                        "[data-en][data-or]"
                    )
                    .forEach(element => {

                        element.textContent =
                            language === "or"
                                ? element.dataset.or
                                : element.dataset.en;

                    });

            }
        );

    });


    /* =====================================================
       SHARE
    ===================================================== */

    shareButton?.addEventListener(
        "click",
        async () => {

            const title =
                document.title;


            const description =
                document
                    .querySelector(
                        ".notice-detail-description"
                    )
                    ?.textContent
                    ?.trim() ||
                "";


            const url =
                window.location.href;


            const shareData = {

                title: title,

                text: description,

                url: url

            };


            try {

                /*
                 * Native mobile / supported browser sharing
                 */

                if (
                    navigator.share
                ) {

                    await navigator.share(
                        shareData
                    );

                    return;

                }


                /*
                 * Desktop fallback:
                 * copy URL.
                 */

                if (
                    navigator.clipboard
                ) {

                    await navigator
                        .clipboard
                        .writeText(
                            url
                        );


                    showShareMessage(
                        currentLanguage === "or"
                            ? "ଲିଙ୍କ କପି ହୋଇଛି"
                            : "Link copied"
                    );

                    return;

                }


                /*
                 * Older browser fallback
                 */

                window.prompt(
                    currentLanguage === "or"
                        ? "ଲିଙ୍କ କପି କରନ୍ତୁ:"
                        : "Copy this link:",
                    url
                );

            } catch (error) {

                /*
                 * User cancelling native
                 * share is not an error.
                 */

                if (
                    error.name !==
                    "AbortError"
                ) {

                    console.error(
                        "Share failed:",
                        error
                    );

                }

            }

        }
    );


    /* =====================================================
       SHARE MESSAGE
    ===================================================== */

    function showShareMessage(
        message
    ) {

        const existing =
            document.querySelector(
                ".notice-share-message"
            );


        if (existing) {
            existing.remove();
        }


        const notification =
            document.createElement(
                "div"
            );


        notification.className =
            "notice-share-message";


        notification.textContent =
            message;


        Object.assign(
            notification.style,
            {
                position: "fixed",
                left: "50%",
                bottom: "25px",
                transform: "translateX(-50%)",
                zIndex: "99999",
                padding: "10px 16px",
                borderRadius: "9px",
                background: "#222",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow:
                    "0 8px 25px rgba(0,0,0,.2)"
            }
        );


        document.body.appendChild(
            notification
        );


        setTimeout(
            () => {

                notification.remove();

            },
            2200
        );

    }

});