/* =========================================================
   SUN SHINE CLUB
   EVENT DETAILS
   Language + JSON + Share
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadEvent();

    setupLanguageSwitcher();

    setupShareButton();

    setupYear();

});


/* =========================================================
   CONFIG
========================================================= */

const EVENT_JSON_PATH = "../../data/events.json";

let currentEvent = null;

let currentLanguage =
    localStorage.getItem("siteLanguage") || "en";


/* =========================================================
   LOAD EVENT
========================================================= */

async function loadEvent() {

    try {

        const response =
            await fetch(EVENT_JSON_PATH);

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const events =
            await response.json();


        if (!Array.isArray(events)) {

            throw new Error(
                "events.json must contain an array"
            );

        }


        /*
         * Get event ID from filename.
         *
         * Example:
         *
         * ganesh-puja-2026.html
         *
         * becomes:
         *
         * ganesh-puja-2026
         */

        const filename =
            window.location.pathname
                .split("/")
                .pop()
                .replace(".html", "");


        currentEvent =
            events.find(
                event => event.id === filename
            );


        if (!currentEvent) {

            throw new Error(
                `Event "${filename}" was not found in events.json`
            );

        }


        renderEvent();

    } catch (error) {

        console.error(
            "Event details error:",
            error
        );

    }

}


/* =========================================================
   RENDER EVENT
========================================================= */

function renderEvent() {

    if (!currentEvent) return;


    const lang =
        currentLanguage;


    /* -----------------------------------------
       BASIC INFORMATION
    ----------------------------------------- */

    setText(
        "eventCategory",
        getLanguage(
            currentEvent.category,
            lang
        )
    );


    setText(
        "eventTitle",
        getLanguage(
            currentEvent.title,
            lang
        )
    );


    setText(
        "eventTime",
        getLanguage(
            currentEvent.time,
            lang
        )
    );


    setText(
        "eventLocation",
        getLanguage(
            currentEvent.location,
            lang
        )
    );


    setText(
        "eventIntroduction",
        getLanguage(
            currentEvent.introduction,
            lang
        )
    );


    /* -----------------------------------------
       DATE
    ----------------------------------------- */

    const formattedDate =
        formatEventDate(
            currentEvent.date,
            lang
        );


    setText(
        "eventDate",
        formattedDate
    );


    /* -----------------------------------------
       FEATURED IMAGE
    ----------------------------------------- */

    const featuredImage =
        document.getElementById(
            "eventFeaturedImage"
        );


    if (featuredImage) {

        featuredImage.src =
            currentEvent.image;

        featuredImage.alt =
            `${getLanguage(currentEvent.title, lang)} - Sun Shine Club Kendupalli`;

    }


    setText(
        "eventImageCaption",
        lang === "or"
            ? "ସନ୍ ସାଇନ୍ କ୍ଲବ୍, କେନ୍ଦୁପଲ୍ଲୀ ପକ୍ଷରୁ ଗଣେଶ ପୂଜା ପାଳନ।"
            : "Ganesh Puja celebration organized by Sun Shine Club, Kendupalli."
    );


    /* -----------------------------------------
       SECTIONS
    ----------------------------------------- */

    renderSections(
        currentEvent.sections,
        lang
    );


    /* -----------------------------------------
       ODIA INTRODUCTION
    ----------------------------------------- */

    setText(
        "odiaIntroduction",
        getLanguage(
            currentEvent.introduction,
            "or"
        )
    );


    /* -----------------------------------------
       HIGHLIGHTS
    ----------------------------------------- */

    setText(
        "highlightEvent",
        getLanguage(
            currentEvent.title,
            lang
        )
    );


    setText(
        "highlightDate",
        formattedDate
    );


    setText(
        "highlightTime",
        getLanguage(
            currentEvent.time,
            lang
        )
    );


    setText(
        "highlightLocation",
        getLanguage(
            currentEvent.location,
            lang
        )
    );


    setText(
        "highlightOrganizer",
        getLanguage(
            currentEvent.organizer,
            lang
        )
    );


    /* -----------------------------------------
       GALLERY
    ----------------------------------------- */

    renderGallery(
        currentEvent.gallery,
        lang
    );


    /* -----------------------------------------
       HTML LANGUAGE
    ----------------------------------------- */

    document.documentElement.lang =
        lang === "or"
            ? "or"
            : "en";


    /* -----------------------------------------
       BODY ODIA FONT
    ----------------------------------------- */

    if (lang === "or") {

        document.body.classList.add(
            "odia-active"
        );

    } else {

        document.body.classList.remove(
            "odia-active"
        );

    }


    updateLanguageButtons();

}


/* =========================================================
   RENDER CONTENT SECTIONS
========================================================= */

function renderSections(
    sections,
    lang
) {

    const container =
        document.getElementById(
            "eventSections"
        );


    if (!container) return;


    container.innerHTML = "";


    if (!Array.isArray(sections)) {
        return;
    }


    sections.forEach(section => {

        const sectionElement =
            document.createElement("section");

        sectionElement.className =
            "event-text-section";


        const heading =
            document.createElement("h2");

        heading.textContent =
            getLanguage(
                section.title,
                lang
            );


        sectionElement.appendChild(
            heading
        );


        const paragraphs =
            section.paragraphs?.[lang] || [];


        paragraphs.forEach(text => {

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                text;

            sectionElement.appendChild(
                paragraph
            );

        });


        container.appendChild(
            sectionElement
        );

    });

}


/* =========================================================
   RENDER GALLERY
========================================================= */

function renderGallery(
    gallery,
    lang
) {

    const grid =
        document.getElementById(
            "eventPhotoGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    if (!Array.isArray(gallery)) {
        return;
    }


    gallery.forEach(photo => {

        const figure =
            document.createElement("figure");


        const image =
            document.createElement("img");


        image.src =
            photo.src;


        image.alt =
            getLanguage(
                photo.alt,
                lang
            );


        image.loading =
            "lazy";


        figure.appendChild(
            image
        );


        grid.appendChild(
            figure
        );

    });

}


/* =========================================================
   LANGUAGE SWITCHER
========================================================= */

function setupLanguageSwitcher() {

    const buttons =
        document.querySelectorAll(
            ".language-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const language =
                    button.dataset.language;


                if (
                    language !== "en" &&
                    language !== "or"
                ) {
                    return;
                }


                currentLanguage =
                    language;


                localStorage.setItem(
                    "siteLanguage",
                    language
                );


                renderEvent();

            }
        );

    });

}


/* =========================================================
   UPDATE LANGUAGE BUTTON
========================================================= */

function updateLanguageButtons() {

    const buttons =
        document.querySelectorAll(
            ".language-btn"
        );


    buttons.forEach(button => {

        const active =
            button.dataset.language ===
            currentLanguage;


        button.classList.toggle(
            "active",
            active
        );


        button.setAttribute(
            "aria-pressed",
            active
                ? "true"
                : "false"
        );

    });

}


/* =========================================================
   GET LANGUAGE
========================================================= */

function getLanguage(
    value,
    language
) {

    if (
        value &&
        typeof value === "object"
    ) {

        return (
            value[language] ??
            value.en ??
            value.or ??
            ""
        );

    }


    return value ?? "";

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.textContent =
        value ?? "";

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatEventDate(
    date,
    language
) {

    const eventDate =
        new Date(`${date}T00:00:00`);


    if (
        Number.isNaN(
            eventDate.getTime()
        )
    ) {

        return date;

    }


    return eventDate.toLocaleDateString(
        language === "or"
            ? "or-IN"
            : "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   SHARE EVENT
========================================================= */

function setupShareButton() {

    const shareButton =
        document.getElementById(
            "shareEvent"
        );


    if (!shareButton) return;


    shareButton.addEventListener(
        "click",
        shareEvent
    );

}


async function shareEvent() {

    if (!currentEvent) return;


    const title =
        getLanguage(
            currentEvent.title,
            currentLanguage
        );


    const description =
        getLanguage(
            currentEvent.description,
            currentLanguage
        );


    const shareData = {

        title:
            `${title} | Sun Shine Club Kendupalli`,

        text:
            description,

        url:
            window.location.href

    };


    try {

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare(shareData)
        ) {

            await navigator.share(
                shareData
            );

            return;

        }


        if (
            navigator.clipboard
        ) {

            await navigator.clipboard.writeText(
                window.location.href
            );


            showShareMessage(
                currentLanguage === "or"
                    ? "ଇଭେଣ୍ଟ ଲିଙ୍କ କପି ହୋଇଛି!"
                    : "Event link copied!"
            );

            return;

        }


        prompt(
            currentLanguage === "or"
                ? "ଇଭେଣ୍ଟ ଲିଙ୍କ କପି କରନ୍ତୁ:"
                : "Copy event link:",
            window.location.href
        );


    } catch (error) {

        console.log(
            "Share cancelled:",
            error
        );

    }

}


/* =========================================================
   SHARE MESSAGE
========================================================= */

function showShareMessage(
    message
) {

    let notification =
        document.getElementById(
            "shareNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "shareNotification";

        notification.className =
            "share-notification";

        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 2200);

}


/* =========================================================
   FOOTER YEAR
========================================================= */

function setupYear() {

    const year =
        document.getElementById(
            "year"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}