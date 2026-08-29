/* =========================================================
   SUN SHINE CLUB - EVENTS CALENDAR
   events-calendar.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const calendar = document.getElementById("eventCalendar");
    const monthYear = document.getElementById("calendarMonthYear");

    const previousBtn = document.getElementById("calendarPrevious");
    const nextBtn = document.getElementById("calendarNext");
    const todayBtn = document.getElementById("calendarToday");

    const modal = document.getElementById("eventModal");
    const modalClose = document.getElementById("eventModalClose");

    const modalImage = document.getElementById("eventModalImage");
    const modalImageWrapper = document.getElementById(
        "eventModalImageWrapper"
    );

    const modalTitle = document.getElementById("eventModalTitle");
    const modalDate = document.getElementById("eventModalDate");
    const modalTime = document.getElementById("eventModalTime");
    const modalLocation = document.getElementById(
        "eventModalLocation"
    );
    const modalDescription = document.getElementById(
        "eventModalDescription"
    );

    const modalCategory = document.getElementById(
        "eventModalCategory"
    );

    const modalPage = document.getElementById(
        "eventModalPage"
    );

    const modalGallery = document.getElementById(
        "eventModalGallery"
    );


    /* =====================================================
       CHECK CALENDAR
    ====================================================== */

    if (!calendar) {
        return;
    }


    /* =====================================================
       STATE
    ====================================================== */

    let events = [];

    const today = new Date();

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let lastFocusedElement = null;


    /* =====================================================
       MONTH NAMES
    ====================================================== */

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /* =====================================================
       DAY NAMES
    ====================================================== */

    const dayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    /* =====================================================
       LOAD EVENTS
    ====================================================== */

    async function loadEvents() {

        try {

            const response = await fetch(
                "../data/events.json",
                {
                    cache: "no-cache"
                }
            );


            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }


            const data = await response.json();


            if (!Array.isArray(data)) {

                throw new Error(
                    "events.json must contain an array"
                );

            }


            events = data.filter(
                event =>
                    event &&
                    event.date &&
                    event.title
            );


            renderCalendar();


        } catch (error) {

            console.error(
                "Events calendar error:",
                error
            );


            renderCalendarError();

        }

    }


    /* =====================================================
       RENDER CALENDAR
    ====================================================== */

    function renderCalendar() {

        calendar.innerHTML = "";


        /* ---------------------------------------------
           WEEK DAYS
        --------------------------------------------- */

        const weekdays = document.createElement(
            "div"
        );

        weekdays.className = "calendar-weekdays";


        dayNames.forEach(day => {

            const weekday = document.createElement(
                "div"
            );

            weekday.className =
                "calendar-weekday";

            weekday.textContent = day;

            weekdays.appendChild(
                weekday
            );

        });


        calendar.appendChild(
            weekdays
        );


        /* ---------------------------------------------
           DAYS
        --------------------------------------------- */

        const daysContainer =
            document.createElement("div");

        daysContainer.className =
            "calendar-days";


        const firstDay = new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();


        const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();


        /* ---------------------------------------------
           EMPTY DAYS
        --------------------------------------------- */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const emptyDay =
                document.createElement("div");

            emptyDay.className =
                "calendar-day empty";

            emptyDay.setAttribute(
                "aria-hidden",
                "true"
            );

            daysContainer.appendChild(
                emptyDay
            );

        }


        /* ---------------------------------------------
           ACTUAL DAYS
        --------------------------------------------- */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const dateString =
                createDateString(
                    currentYear,
                    currentMonth,
                    day
                );


            const dayEvents =
                getEventsForDate(
                    dateString
                );


            const dayElement =
                document.createElement("div");

            dayElement.className =
                "calendar-day";


            /* -----------------------------------------
               TODAY
            ----------------------------------------- */

            if (
                isToday(
                    currentYear,
                    currentMonth,
                    day
                )
            ) {

                dayElement.classList.add(
                    "today"
                );

                dayElement.setAttribute(
                    "aria-current",
                    "date"
                );

            }


            /* -----------------------------------------
               EVENT DAY
            ----------------------------------------- */

            if (dayEvents.length > 0) {

                dayElement.classList.add(
                    "has-event"
                );

                dayElement.setAttribute(
                    "role",
                    "button"
                );

                dayElement.setAttribute(
                    "tabindex",
                    "0"
                );

                dayElement.setAttribute(
                    "aria-label",
                    buildDayAriaLabel(
                        day,
                        dayEvents
                    )
                );


                dayElement.addEventListener(
                    "click",
                    () => {

                        if (
                            dayEvents.length === 1
                        ) {

                            openEventModal(
                                dayEvents[0],
                                dayElement
                            );

                        } else {

                            openMultipleEvents(
                                dayEvents,
                                dayElement
                            );

                        }

                    }
                );


                dayElement.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            if (
                                dayEvents.length === 1
                            ) {

                                openEventModal(
                                    dayEvents[0],
                                    dayElement
                                );

                            } else {

                                openMultipleEvents(
                                    dayEvents,
                                    dayElement
                                );

                            }

                        }

                    }
                );

            }


            /* -----------------------------------------
               DAY NUMBER
            ----------------------------------------- */

            const number =
                document.createElement("div");

            number.className =
                "calendar-day-number";

            number.textContent = day;


            dayElement.appendChild(
                number
            );


            /* -----------------------------------------
               EVENTS
            ----------------------------------------- */

            if (dayEvents.length > 0) {

                const eventIndicator =
                    document.createElement("div");

                eventIndicator.className =
                    "calendar-event-indicator";


                const eventName =
                    document.createElement("span");

                eventName.className =
                    "calendar-event-name";

                eventName.textContent =
                    getEventTitle(
                        dayEvents[0]
                    );


                eventIndicator.appendChild(
                    eventName
                );


                dayElement.appendChild(
                    eventIndicator
                );


                /* -------------------------------------
                   MORE EVENTS
                ------------------------------------- */

                if (
                    dayEvents.length > 1
                ) {

                    const more =
                        document.createElement("div");

                    more.className =
                        "calendar-more-events";

                    more.textContent =
                        `+${dayEvents.length - 1} more`;

                    dayElement.appendChild(
                        more
                    );

                }

            }


            daysContainer.appendChild(
                dayElement
            );

        }


        calendar.appendChild(
            daysContainer
        );


        /* ---------------------------------------------
           HEADER
        --------------------------------------------- */

        updateMonthHeading();

    }


    /* =====================================================
       UPDATE MONTH HEADING
    ====================================================== */

    function updateMonthHeading() {

        if (!monthYear) {
            return;
        }


        monthYear.textContent =
            `${monthNames[currentMonth]} ${currentYear}`;

    }


    /* =====================================================
       CREATE DATE STRING
    ====================================================== */

    function createDateString(
        year,
        month,
        day
    ) {

        const monthNumber =
            String(month + 1).padStart(
                2,
                "0"
            );


        const dayNumber =
            String(day).padStart(
                2,
                "0"
            );


        return `${year}-${monthNumber}-${dayNumber}`;

    }


    /* =====================================================
       GET EVENTS FOR DATE
    ====================================================== */

    function getEventsForDate(
        dateString
    ) {

        return events.filter(
            event => {

                return normalizeDate(
                    event.date
                ) === dateString;

            }
        );

    }


    /* =====================================================
       NORMALIZE DATE
    ====================================================== */

    function normalizeDate(
        date
    ) {

        if (!date) {
            return "";
        }


        /*
         * Handles:
         *
         * 2026-08-15
         * 2026-08-15T08:00:00
         */

        return String(date)
            .split("T")[0];

    }


    /* =====================================================
       GET EVENT TITLE
    ====================================================== */

    function getEventTitle(
        event
    ) {

        if (
            typeof event.title ===
            "string"
        ) {

            return event.title;

        }


        if (
            event.title &&
            typeof event.title.en ===
            "string"
        ) {

            return event.title.en;

        }


        return "Club Event";

    }


    /* =====================================================
       GET DESCRIPTION
    ====================================================== */

    function getEventDescription(
        event
    ) {

        if (
            typeof event.description ===
            "string"
        ) {

            return event.description;

        }


        if (
            event.description &&
            typeof event.description.en ===
            "string"
        ) {

            return event.description.en;

        }


        return "Sun Shine Club, Kendupalli event.";

    }


    /* =====================================================
       GET LOCATION
    ====================================================== */

    function getEventLocation(
        event
    ) {

        if (
            typeof event.location ===
            "string"
        ) {

            return event.location;

        }


        if (
            event.location &&
            typeof event.location.en ===
            "string"
        ) {

            return event.location.en;

        }


        return "Sun Shine Club, Kendupalli";

    }


    /* =====================================================
       GET CATEGORY
    ====================================================== */

    function getEventCategory(
        event
    ) {

        if (
            typeof event.category ===
            "string"
        ) {

            return event.category;

        }


        return "Club Event";

    }


    /* =====================================================
       FORMAT DATE
    ====================================================== */

    function formatEventDate(
        date
    ) {

        if (!date) {
            return "";
        }


        const normalized =
            normalizeDate(date);


        const parts =
            normalized.split("-");


        if (parts.length !== 3) {
            return date;
        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]) - 1;

        const day =
            Number(parts[2]);


        const dateObject =
            new Date(
                year,
                month,
                day
            );


        return dateObject.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* =====================================================
       CHECK TODAY
    ====================================================== */

    function isToday(
        year,
        month,
        day
    ) {

        return (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        );

    }


    /* =====================================================
       BUILD ARIA LABEL
    ====================================================== */

    function buildDayAriaLabel(
        day,
        dayEvents
    ) {

        const date = new Date(
            currentYear,
            currentMonth,
            day
        );


        const readableDate =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        const titles =
            dayEvents.map(
                event =>
                    getEventTitle(event)
            );


        return `${readableDate}. Events: ${titles.join(
            ", "
        )}`;

    }


    /* =====================================================
       OPEN EVENT MODAL
    ====================================================== */

    function openEventModal(
        event,
        triggerElement = null
    ) {

        if (!modal) {
            return;
        }


        lastFocusedElement =
            triggerElement ||
            document.activeElement;


        /* ---------------------------------------------
           TITLE
        --------------------------------------------- */

        if (modalTitle) {

            modalTitle.textContent =
                getEventTitle(event);

        }


        /* ---------------------------------------------
           DATE
        --------------------------------------------- */

        if (modalDate) {

            modalDate.textContent =
                formatEventDate(
                    event.date
                );

        }


        /* ---------------------------------------------
           TIME
        --------------------------------------------- */

        if (modalTime) {

            modalTime.textContent =
                event.time ||
                "Time to be announced";

        }


        /* ---------------------------------------------
           LOCATION
        --------------------------------------------- */

        if (modalLocation) {

            modalLocation.textContent =
                getEventLocation(event);

        }


        /* ---------------------------------------------
           DESCRIPTION
        --------------------------------------------- */

        if (modalDescription) {

            modalDescription.textContent =
                getEventDescription(event);

        }


        /* ---------------------------------------------
           CATEGORY
        --------------------------------------------- */

        if (modalCategory) {

            modalCategory.textContent =
                getEventCategory(event);

        }


        /* ---------------------------------------------
           IMAGE
        --------------------------------------------- */

        if (
            modalImage &&
            modalImageWrapper
        ) {

            if (event.image) {

                modalImage.src =
                    event.image;

                modalImage.alt =
                    `${getEventTitle(event)} - Sun Shine Club Kendupalli`;

                modalImageWrapper.style.display =
                    "block";

            } else {

                modalImage.removeAttribute(
                    "src"
                );

                modalImage.alt = "";

                modalImageWrapper.style.display =
                    "none";

            }

        }


        /* ---------------------------------------------
           EVENT PAGE
        --------------------------------------------- */

        if (modalPage) {

            if (event.eventPage) {

                modalPage.href =
                    event.eventPage;

                modalPage.style.display =
                    "inline-flex";

            } else {

                modalPage.removeAttribute(
                    "href"
                );

                modalPage.style.display =
                    "none";

            }

        }


        /* ---------------------------------------------
           GALLERY
        --------------------------------------------- */

        if (modalGallery) {

            if (event.gallery) {

                modalGallery.href =
                    event.gallery;

                modalGallery.style.display =
                    "inline-flex";

            } else {

                modalGallery.removeAttribute(
                    "href"
                );

                modalGallery.style.display =
                    "none";

            }

        }


        /* ---------------------------------------------
           SHOW
        --------------------------------------------- */

        modal.classList.add(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        /* ---------------------------------------------
           FOCUS
        --------------------------------------------- */

        requestAnimationFrame(() => {

            modalClose?.focus();

        });

    }


    /* =====================================================
       MULTIPLE EVENTS
    ====================================================== */

    function openMultipleEvents(
        dayEvents,
        triggerElement
    ) {

        /*
         * Currently open the first event.
         *
         * If multiple events exist on the same
         * date, the first event is displayed.
         *
         * The calendar also shows "+X more".
         */

        openEventModal(
            dayEvents[0],
            triggerElement
        );

    }


    /* =====================================================
       CLOSE EVENT MODAL
    ====================================================== */

    function closeEventModal() {

        if (!modal) {
            return;
        }


        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";


        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus ===
            "function"
        ) {

            lastFocusedElement.focus();

        }

    }


    /* =====================================================
       PREVIOUS MONTH
    ====================================================== */

    function showPreviousMonth() {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

        }


        renderCalendar();

    }


    /* =====================================================
       NEXT MONTH
    ====================================================== */

    function showNextMonth() {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

        }


        renderCalendar();

    }


    /* =====================================================
       GO TO TODAY
    ====================================================== */

    function goToToday() {

        currentMonth =
            today.getMonth();

        currentYear =
            today.getFullYear();


        renderCalendar();

    }


    /* =====================================================
       CALENDAR ERROR
    ====================================================== */

    function renderCalendarError() {

        calendar.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    padding:50px 20px;
                    text-align:center;
                    color:#777;
                "
            >

                <i
                    class="fa-solid fa-calendar-xmark"
                    style="
                        font-size:35px;
                        margin-bottom:15px;
                        display:block;
                    "
                ></i>

                <strong>
                    Events could not be loaded.
                </strong>

                <p
                    style="
                        margin:8px 0 0;
                        font-size:13px;
                    "
                >
                    Please try refreshing the page.
                </p>

            </div>

        `;

    }


    /* =====================================================
       EVENT LISTENERS
    ====================================================== */

    previousBtn?.addEventListener(
        "click",
        showPreviousMonth
    );


    nextBtn?.addEventListener(
        "click",
        showNextMonth
    );


    todayBtn?.addEventListener(
        "click",
        goToToday
    );


    modalClose?.addEventListener(
        "click",
        closeEventModal
    );


    /* =====================================================
       CLOSE MODAL BY OVERLAY
    ====================================================== */

    document.querySelectorAll(
        "[data-close-event-modal]"
    ).forEach(element => {

        element.addEventListener(
            "click",
            closeEventModal
        );

    });


    /* =====================================================
       ESC KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal &&
                modal.classList.contains("show")
            ) {

                closeEventModal();

            }

        }
    );


    /* =====================================================
       PREVENT CLICK INSIDE MODAL FROM CLOSING
    ====================================================== */

    document.querySelector(
        ".event-modal-content"
    )?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    /* =====================================================
       INITIALIZE
    ====================================================== */

    loadEvents();

});