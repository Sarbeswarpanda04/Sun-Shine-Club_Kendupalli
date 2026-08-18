document.addEventListener("DOMContentLoaded", () => {

    const todayLabel =
        document.getElementById("todayLabel");

    const todayDate =
        document.getElementById("todayDate");

    const todayDay =
        document.getElementById("todayDay");

    const nitibaniLabel =
        document.getElementById("nitibaniLabel");

    const nitibaniTrack =
        document.getElementById("nitibaniTrack");

    const marquee =
        document.querySelector(".news-marquee");


    if (
        !todayLabel ||
        !todayDate ||
        !todayDay ||
        !nitibaniLabel ||
        !nitibaniTrack ||
        !marquee
    ) {
        return;
    }


    /* =========================================
       DATE
    ========================================= */

    const now = new Date();

    const dayNumber = now.getDate();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    const dayIndex = now.getDay();


    /* =========================================
       LANGUAGES
    ========================================= */

    const odiaDays = [
        "ରବିବାର",
        "ସୋମବାର",
        "ମଙ୍ଗଳବାର",
        "ବୁଧବାର",
        "ଗୁରୁବାର",
        "ଶୁକ୍ରବାର",
        "ଶନିବାର"
    ];


    const englishDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];


    const odiaMonths = [
        "ଜାନୁଆରୀ",
        "ଫେବୃଆରୀ",
        "ମାର୍ଚ୍ଚ",
        "ଏପ୍ରିଲ",
        "ମେ",
        "ଜୁନ",
        "ଜୁଲାଇ",
        "ଅଗଷ୍ଟ",
        "ସେପ୍ଟେମ୍ବର",
        "ଅକ୍ଟୋବର",
        "ନଭେମ୍ବର",
        "ଡିସେମ୍ବର"
    ];


    const englishMonths = [
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


    function toOdiaNumber(number) {

        const digits = [
            "୦",
            "୧",
            "୨",
            "୩",
            "୪",
            "୫",
            "୬",
            "୭",
            "୮",
            "୯"
        ];

        return String(number)
            .split("")
            .map(digit => digits[digit] || digit)
            .join("");

    }


    /* =========================================
       DATE STRINGS
    ========================================= */

    const odiaDate =
        `${toOdiaNumber(dayNumber)} ${odiaMonths[monthIndex]} ${toOdiaNumber(year)}`;


    const englishDate =
        `${dayNumber} ${englishMonths[monthIndex]} ${year}`;


    /* =========================================
       NITIBANI
    ========================================= */

    const nitibani = [

        {
            or: "ପରିଶ୍ରମ ହେଉଛି ସଫଳତାର ଚାବି।",
            en: "Hard work is the key to success."
        },

        {
            or: "ସତ୍ୟର ପଥ ସର୍ବଦା ଆମକୁ ସଫଳତା ଆଡ଼କୁ ନେଇଯାଏ।",
            en: "The path of truth always leads us towards success."
        },

        {
            or: "ଏକତା ହେଉଛି ଆମର ଶକ୍ତି।",
            en: "Unity is our strength."
        },

        {
            or: "ଅନ୍ୟକୁ ସାହାଯ୍ୟ କରିବା ହେଉଛି ମାନବିକତାର ସର୍ବୋତ୍ତମ ପରିଚୟ।",
            en: "Helping others is the greatest expression of humanity."
        },

        {
            or: "ସମୟର ସଦୁପଯୋଗ କରନ୍ତୁ, ସମୟ କେବେ ଫେରି ଆସେ ନାହିଁ।",
            en: "Use your time wisely, because time never comes back."
        },

        {
            or: "ଭଲ ଚିନ୍ତା ଭଲ କାର୍ଯ୍ୟର ଜନ୍ମ ଦିଏ।",
            en: "Good thoughts lead to good actions."
        },

        {
            or: "ଶିକ୍ଷା ହେଉଛି ଜୀବନର ସବୁଠାରୁ ମୂଲ୍ୟବାନ ସମ୍ପଦ।",
            en: "Education is one of life's most valuable treasures."
        },

        {
            or: "ନିଜ ଉପରେ ବିଶ୍ୱାସ ରଖନ୍ତୁ, ସଫଳତା ନିଶ୍ଚିତ।",
            en: "Believe in yourself and success will follow."
        },

        {
            or: "ବିନମ୍ରତା ମଣିଷର ସବୁଠାରୁ ବଡ଼ ଅଳଙ୍କାର।",
            en: "Humility is the greatest ornament of a person."
        },

        {
            or: "ପ୍ରକୃତିକୁ ସୁରକ୍ଷା କରିବା ଆମ ସମସ୍ତଙ୍କ ଦାୟିତ୍ୱ।",
            en: "Protecting nature is everyone's responsibility."
        }

    ];


    /* =========================================
       DATE-BASED DAILY QUOTE
    ========================================= */

    const startDate =
        new Date(2026, 0, 1);


    const difference =
        Math.floor(
            (now - startDate) /
            (1000 * 60 * 60 * 24)
        );


    let quoteIndex =
        ((difference % nitibani.length) +
        nitibani.length) %
        nitibani.length;


    /* =========================================
       LANGUAGE
    ========================================= */

    let isOdia = true;


    /* =========================================
       DISPLAY + MARQUEE
    ========================================= */

    function showLanguage() {

        const quote =
            nitibani[quoteIndex];


        /* -------------------------------------
           LANGUAGE TEXT
        ------------------------------------- */

        if (isOdia) {

            todayLabel.textContent = "ଆଜି";

            todayDate.textContent =
                odiaDate;

            todayDay.textContent =
                odiaDays[dayIndex];

            nitibaniLabel.textContent =
                "ଦୈନିକ ନୀତିବାଣୀ";

        } else {

            todayLabel.textContent =
                "Today";

            todayDate.textContent =
                englishDate;

            todayDay.textContent =
                englishDays[dayIndex];

            nitibaniLabel.textContent =
                "Daily Thought";

        }


        /* -------------------------------------
           QUOTE
        ------------------------------------- */

        const message =
            isOdia
                ? quote.or
                : quote.en;


        nitibaniTrack.innerHTML = `
            <div class="news-item">
                <span class="news-symbol">🪷</span>
                ${message}
            </div>
        `;


        const item =
            nitibaniTrack.querySelector(
                ".news-item"
            );


        /*
           Start from the right side.
        */

        const containerWidth =
            marquee.offsetWidth;


        const textWidth =
            item.offsetWidth;


        nitibaniTrack.style.transition =
            "none";


        nitibaniTrack.style.transform =
            `translateX(${containerWidth}px)`;


        /*
           Force browser layout calculation.
        */

        item.offsetWidth;


        /*
           Speed in pixels per second.
           Increase this number for faster movement.
        */

        const speed = 45;


        const distance =
            containerWidth + textWidth;


        const duration =
            distance / speed;


        requestAnimationFrame(() => {

            nitibaniTrack.style.transition =
                `transform ${duration}s linear`;

            nitibaniTrack.style.transform =
                `translateX(-${textWidth}px)`;

        });


        /*
           IMPORTANT:
           When the marquee COMPLETELY finishes,
           change language.
        */

        nitibaniTrack.ontransitionend =
            () => {

                changeLanguage();

            };

    }


    /* =========================================
       CHANGE LANGUAGE
    ========================================= */

    function changeLanguage() {

        /*
           Fade everything very slightly
           before changing language.
        */

        todayLabel.classList.add("language-fade");

        todayDate.classList.add("language-fade");

        todayDay.classList.add("language-fade");

        nitibaniLabel.classList.add("language-fade");

        nitibaniTrack.classList.add("language-fade");


        setTimeout(() => {

            /*
               Odia → English
               English → Odia
            */

            isOdia = !isOdia;


            /*
               Move to next quote ONLY
               after English has completed
               and we're returning to Odia.
            */

            if (isOdia) {

                quoteIndex =
                    (quoteIndex + 1) %
                    nitibani.length;

            }


            showLanguage();


            setTimeout(() => {

                todayLabel.classList.remove(
                    "language-fade"
                );

                todayDate.classList.remove(
                    "language-fade"
                );

                todayDay.classList.remove(
                    "language-fade"
                );

                nitibaniLabel.classList.remove(
                    "language-fade"
                );

                nitibaniTrack.classList.remove(
                    "language-fade"
                );

            }, 50);

        }, 350);

    }


    /* =========================================
       START
    ========================================= */

    showLanguage();

});