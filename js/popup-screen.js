/* =========================================
   YOUTUBE SUBSCRIBE POPUP
   ========================================= */


document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------
       ELEMENTS
    ----------------------------------------- */

    const popup =
        document.getElementById("youtubePopup");

    const closeBtn =
        document.getElementById("youtubePopupClose");

    const laterBtn =
        document.getElementById("youtubePopupLater");


    /* -----------------------------------------
       STOP IF POPUP DOES NOT EXIST
    ----------------------------------------- */

    if (!popup) {
        return;
    }


    /* -----------------------------------------
       SESSION CHECK
       
       If the user has already closed the popup
       during this browser session, don't show it.
    ----------------------------------------- */

    const popupClosed =
        sessionStorage.getItem(
            "youtubePopupClosed"
        );


    if (popupClosed === "true") {
        return;
    }


    /* -----------------------------------------
       SHOW POPUP AFTER 5 SECONDS
    ----------------------------------------- */

    const popupTimer = setTimeout(() => {

        popup.classList.add("show");

        popup.setAttribute(
            "aria-hidden",
            "false"
        );


        /* -----------------------------------------
           LOAD YOUTUBE STATISTICS
           Only load when popup opens.
        ----------------------------------------- */

        loadYouTubeStats();

    }, 5000);


    /* -----------------------------------------
       CLOSE POPUP
    ----------------------------------------- */

    function closeYoutubePopup() {

        popup.classList.remove("show");

        popup.setAttribute(
            "aria-hidden",
            "true"
        );


        /* -----------------------------------------
           REMEMBER CLOSED STATE
        ----------------------------------------- */

        sessionStorage.setItem(
            "youtubePopupClosed",
            "true"
        );


        /* -----------------------------------------
           CLEAR TIMER IF STILL ACTIVE
        ----------------------------------------- */

        clearTimeout(popupTimer);

    }


    /* -----------------------------------------
       CLOSE BUTTON
    ----------------------------------------- */

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeYoutubePopup
        );

    }


    /* -----------------------------------------
       MAYBE LATER BUTTON
    ----------------------------------------- */

    if (laterBtn) {

        laterBtn.addEventListener(
            "click",
            closeYoutubePopup
        );

    }


    /* -----------------------------------------
       CLOSE WHEN CLICKING OUTSIDE POPUP
    ----------------------------------------- */

    popup.addEventListener(
        "click",
        (event) => {

            if (
                event.target === popup
            ) {

                closeYoutubePopup();

            }

        }
    );


    /* -----------------------------------------
       ESCAPE KEY
    ----------------------------------------- */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                popup.classList.contains("show")
            ) {

                closeYoutubePopup();

            }

        }
    );

});



/* =========================================
   YOUTUBE API WORKER
========================================= */

const YOUTUBE_API_URL =
    "https://sunshine-youtube-subscribers.still-mouse-2d92.workers.dev/youtube-subscribers";



/* =========================================
   PREVENT MULTIPLE REQUESTS
========================================= */

let youtubeStatsLoaded = false;

let youtubeStatsLoading = false;



/* =========================================
   LOAD YOUTUBE STATISTICS
========================================= */

async function loadYouTubeStats() {


    /* -----------------------------------------
       PREVENT DUPLICATE REQUEST
    ----------------------------------------- */

    if (
        youtubeStatsLoaded ||
        youtubeStatsLoading
    ) {

        return;

    }


    /* -----------------------------------------
       ELEMENTS
    ----------------------------------------- */

    const subscriberElement =
        document.getElementById(
            "subscriberCount"
        );

    const viewsElement =
        document.getElementById(
            "totalViews"
        );


    /* -----------------------------------------
       CHECK ELEMENTS
    ----------------------------------------- */

    if (
        !subscriberElement ||
        !viewsElement
    ) {

        console.warn(
            "YouTube statistic elements not found."
        );

        return;

    }


    /* -----------------------------------------
       LOADING STATE
    ----------------------------------------- */

    youtubeStatsLoading = true;


    subscriberElement.textContent =
        "Loading...";

    viewsElement.textContent =
        "Loading...";


    try {


        /* -----------------------------------------
           FETCH WORKER
        ----------------------------------------- */

        const response =
            await fetch(
                YOUTUBE_API_URL,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store"
                }
            );


        /* -----------------------------------------
           HTTP ERROR
        ----------------------------------------- */

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        /* -----------------------------------------
           JSON RESPONSE
        ----------------------------------------- */

        const data =
            await response.json();


        /* -----------------------------------------
           VALIDATE SUBSCRIBERS
        ----------------------------------------- */

        if (
            typeof data.subscriberCount !==
            "number"
        ) {

            throw new Error(
                "Subscriber count not available"
            );

        }


        /* -----------------------------------------
           UPDATE SUBSCRIBERS
        ----------------------------------------- */

        subscriberElement.textContent =
            formatYouTubeNumber(
                data.subscriberCount
            );


        /* -----------------------------------------
           UPDATE TOTAL VIEWS
        ----------------------------------------- */

        if (
            typeof data.totalViews ===
            "number"
        ) {

            viewsElement.textContent =
                formatYouTubeNumber(
                    data.totalViews
                );

        } else {

            viewsElement.textContent =
                "--";

        }


        /* -----------------------------------------
           MARK AS LOADED
        ----------------------------------------- */

        youtubeStatsLoaded = true;


    } catch (error) {


        /* -----------------------------------------
           ERROR
        ----------------------------------------- */

        console.error(
            "YouTube statistics error:",
            error
        );


        subscriberElement.textContent =
            "--";

        viewsElement.textContent =
            "--";


    } finally {

        youtubeStatsLoading = false;

    }

}



/* =========================================
   FORMAT YOUTUBE NUMBERS
========================================= */

function formatYouTubeNumber(number) {


    number = Number(number);


    /* -----------------------------------------
       INVALID NUMBER
    ----------------------------------------- */

    if (
        !Number.isFinite(number)
    ) {

        return "--";

    }


    /* -----------------------------------------
       MILLIONS
    ----------------------------------------- */

    if (
        number >= 1000000
    ) {

        return (
            (number / 1000000)
                .toFixed(1)
                .replace(".0", "") +
            "M"
        );

    }


    /* -----------------------------------------
       THOUSANDS
    ----------------------------------------- */

    if (
        number >= 1000
    ) {

        return (
            (number / 1000)
                .toFixed(1)
                .replace(".0", "") +
            "K"
        );

    }


    /* -----------------------------------------
       NORMAL NUMBER
    ----------------------------------------- */

    return number.toLocaleString(
        "en-IN"
    );

}