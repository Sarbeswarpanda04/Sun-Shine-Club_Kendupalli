/* =========================================
   YOUTUBE SUBSCRIBE POPUP
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const popup = document.getElementById("youtubePopup");
    const closeBtn = document.getElementById("youtubePopupClose");
    const laterBtn = document.getElementById("youtubePopupLater");

    if (!popup) return;


    /*
     * Check whether popup has already been
     * closed during this browser session.
     */

    const popupClosed =
        sessionStorage.getItem("youtubePopupClosed");


    /*
     * If already closed, don't show it.
     */

    if (popupClosed === "true") {
        return;
    }


    /*
     * Show popup after 5 seconds.
     */

    const popupTimer = setTimeout(() => {

        popup.classList.add("show");

        popup.setAttribute(
            "aria-hidden",
            "false"
        );

    }, 5000);


    /*
     * Close popup
     */

    function closeYoutubePopup() {

        popup.classList.remove("show");

        popup.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
         * Remember that user closed it
         * for this browser session.
         */

        sessionStorage.setItem(
            "youtubePopupClosed",
            "true"
        );
    }


    /*
     * Close button
     */

    closeBtn?.addEventListener(
        "click",
        closeYoutubePopup
    );


    /*
     * Maybe Later
     */

    laterBtn?.addEventListener(
        "click",
        closeYoutubePopup
    );


    /*
     * Close when clicking outside
     */

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


    /*
     * ESC key
     */

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



async function loadYouTubeSubscribers() {

    const subscriberElement =
        document.getElementById("subscriberCount");

    if (!subscriberElement) return;

    try {

        const response = await fetch(
            "https://sunshine-youtube-subscribers.still-mouse-2d92.workers.dev/youtube-subscribers"
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        if (
            !data ||
            typeof data.subscriberCount === "undefined"
        ) {
            throw new Error(
                "Subscriber count not available"
            );
        }

        subscriberElement.textContent =
            formatSubscriberCount(
                data.subscriberCount
            );

    } catch (error) {

        console.error(
            "YouTube subscriber count error:",
            error
        );

        subscriberElement.textContent =
            "YouTube subscribers";
    }
}


function formatSubscriberCount(count) {

    count = Number(count);

    if (!Number.isFinite(count)) {
        return "YouTube subscribers";
    }

    if (count >= 1000000) {
        return (
            (count / 1000000)
                .toFixed(1)
                .replace(".0", "") +
            "M Subscribers"
        );
    }

    if (count >= 1000) {
        return (
            (count / 1000)
                .toFixed(1)
                .replace(".0", "") +
            "K Subscribers"
        );
    }

    return (
        count.toLocaleString("en-IN") +
        " Subscribers"
    );
}


// Load when page is ready
document.addEventListener(
    "DOMContentLoaded",
    loadYouTubeSubscribers
);