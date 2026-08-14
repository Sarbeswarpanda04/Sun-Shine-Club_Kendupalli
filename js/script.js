/* =========================================
   RECENT EVENTS CAROUSEL
========================================= */

const eventsTrack =
    document.getElementById("eventsTrack");

const eventPrev =
    document.getElementById("eventPrev");

const eventNext =
    document.getElementById("eventNext");

const eventDots =
    document.getElementById("eventDots");


if (
    eventsTrack &&
    eventPrev &&
    eventNext &&
    eventDots
) {

    const slides =
        eventsTrack.querySelectorAll(
            ".event-slide"
        );

    let currentEvent = 0;

    const totalEvents =
        slides.length;


    /* -------------------------------------
       CREATE DOTS
    ------------------------------------- */

    slides.forEach((slide, index) => {

        const dot =
            document.createElement("button");

        dot.className =
            "event-dot";

        dot.setAttribute(
            "aria-label",
            `View event ${index + 1}`
        );

        dot.addEventListener(
            "click",
            () => {

                currentEvent = index;

                updateEventCarousel();

                restartEventAutoPlay();

            }
        );

        eventDots.appendChild(dot);

    });


    const dots =
        eventDots.querySelectorAll(
            ".event-dot"
        );


    /* -------------------------------------
       UPDATE CAROUSEL
    ------------------------------------- */

    function updateEventCarousel() {

        eventsTrack.style.transform =
            `translateX(-${currentEvent * 100}%)`;


        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentEvent
            );

        });

    }


    /* -------------------------------------
       NEXT
    ------------------------------------- */

    function nextEvent() {

        currentEvent++;

        if (
            currentEvent >= totalEvents
        ) {

            currentEvent = 0;

        }

        updateEventCarousel();

    }


    /* -------------------------------------
       PREVIOUS
    ------------------------------------- */

    function previousEvent() {

        currentEvent--;

        if (currentEvent < 0) {

            currentEvent =
                totalEvents - 1;

        }

        updateEventCarousel();

    }


    eventNext.addEventListener(
        "click",
        () => {

            nextEvent();

            restartEventAutoPlay();

        }
    );


    eventPrev.addEventListener(
        "click",
        () => {

            previousEvent();

            restartEventAutoPlay();

        }
    );


    /* -------------------------------------
       AUTO PLAY
    ------------------------------------- */

    let eventAutoPlay =
        setInterval(
            nextEvent,
            5000
        );


    function restartEventAutoPlay() {

        clearInterval(eventAutoPlay);

        eventAutoPlay =
            setInterval(
                nextEvent,
                5000
            );

    }


    /* -------------------------------------
       PAUSE ON HOVER
    ------------------------------------- */

    eventsTrack.addEventListener(
        "mouseenter",
        () => {

            clearInterval(eventAutoPlay);

        }
    );


    eventsTrack.addEventListener(
        "mouseleave",
        () => {

            restartEventAutoPlay();

        }
    );


    /* -------------------------------------
       INITIAL STATE
    ------------------------------------- */

    updateEventCarousel();

}