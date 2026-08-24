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