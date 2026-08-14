const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const icon = musicButton?.querySelector("i");


/* =========================================
   TRY AUTOPLAY
========================================= */

window.addEventListener("load", async () => {

    try {

        await music.play();

        // Music successfully started

        if (musicButton) {

            musicButton.classList.add("playing");

            if (icon) {
                icon.className =
                    "fa-solid fa-volume-high";
            }

        }

    } catch (error) {

        /*
         * Browser blocked autoplay.
         * Music will start after the first interaction.
         */

        console.log(
            "Autoplay blocked. Waiting for user interaction."
        );

    }

});


/* =========================================
   START MUSIC AFTER USER INTERACTION
========================================= */

function startMusic() {

    if (music.paused) {

        music.play()
            .then(() => {

                if (musicButton) {

                    musicButton.classList.add(
                        "playing"
                    );

                }

                if (icon) {

                    icon.className =
                        "fa-solid fa-volume-high";

                }

            })
            .catch(error => {

                console.log(
                    "Unable to start music:",
                    error
                );

            });

    }

}


/* =========================================
   FIRST USER INTERACTION
========================================= */

document.addEventListener(
    "click",
    startMusic,
    { once: true }
);

document.addEventListener(
    "touchstart",
    startMusic,
    { once: true }
);


/* =========================================
   MUSIC BUTTON
========================================= */

if (musicButton) {

    musicButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            if (music.paused) {

                music.play();

                musicButton.classList.add(
                    "playing"
                );

                if (icon) {

                    icon.className =
                        "fa-solid fa-volume-high";

                }

            } else {

                music.pause();

                musicButton.classList.remove(
                    "playing"
                );

                if (icon) {

                    icon.className =
                        "fa-solid fa-volume-xmark";

                }

            }

        }
    );

}




/* =========================================
   PATRIOTIC PARTICLES
========================================= */

const particleContainer =
    document.getElementById("patrioticParticles");


/* =========================================
   CREATE PARTICLE
========================================= */

function createPatrioticParticle() {

    if (!particleContainer) return;


    const particle =
        document.createElement("div");


    particle.classList.add(
        "particle-item"
    );


    /* -------------------------------------
       Random particle type
    ------------------------------------- */

    const random =
        Math.random();


    /* FLAG */

    if (random < 0.25) {

        const flag =
            document.createElement("img");

        flag.src =
            "assets/independence/flag.gif";

        flag.alt = "";

        flag.classList.add(
            "flag-particle"
        );

        particle.appendChild(flag);

    }


    /* SAFFRON PETAL */

    else if (random < 0.55) {

        particle.classList.add(
            "saffron-petal"
        );

    }


    /* GREEN PETAL */

    else if (random < 0.80) {

        particle.classList.add(
            "green-petal"
        );

    }


    /* GLOW */

    else {

        particle.classList.add(
            "glow-particle"
        );

    }


    /* -------------------------------------
       Random horizontal position
    ------------------------------------- */

    particle.style.left =
        Math.random() * 100 + "%";


    /* -------------------------------------
       Random size for flags
    ------------------------------------- */

    if (
        particle.classList.contains(
            "flag-particle"
        )
    ) {

        const size =
            Math.floor(
                Math.random() * 15
            ) + 22;

        particle.style.width =
            size + "px";

    }


    /* -------------------------------------
       Random animation duration
    ------------------------------------- */

    const duration =
        Math.random() * 5 + 6;

    particle.style.animationDuration =
        duration + "s";


    /* -------------------------------------
       Random delay
    ------------------------------------- */

    particle.style.animationDelay =
        Math.random() * 1.5 + "s";


    /* -------------------------------------
       Slight random rotation
    ------------------------------------- */

    particle.style.transform =
        `rotate(${Math.random() * 40 - 20}deg)`;


    /* -------------------------------------
       Add to container
    ------------------------------------- */

    particleContainer.appendChild(
        particle
    );


    /* -------------------------------------
       Remove after animation
    ------------------------------------- */

    setTimeout(() => {

        particle.remove();

    }, (duration + 2) * 1000);

}


/* =========================================
   INITIAL PARTICLES
========================================= */

for (let i = 0; i < 15; i++) {

    setTimeout(
        createPatrioticParticle,
        i * 250
    );

}


/* =========================================
   CONTINUOUS PARTICLES
========================================= */

setInterval(
    createPatrioticParticle,
    600
);




/* =========================================
   PREVIOUS YEARS CAROUSEL
========================================= */

const yearTrack =
    document.getElementById("yearTrack");

const prevYear =
    document.getElementById("prevYear");

const nextYear =
    document.getElementById("nextYear");

const carouselDots =
    document.getElementById("carouselDots");

if (
    yearTrack &&
    prevYear &&
    nextYear &&
    carouselDots
) {

    const slides =
        yearTrack.querySelectorAll(
            ".year-slide"
        );

    let currentSlide = 0;

    const totalSlides =
        slides.length;


    /* Create dots */

    slides.forEach((slide, index) => {

        const dot =
            document.createElement("button");

        dot.className =
            "carousel-dot";

        dot.setAttribute(
            "aria-label",
            `Go to image ${index + 1}`
        );

        dot.addEventListener(
            "click",
            () => {

                currentSlide = index;

                updateCarousel();

            }
        );

        carouselDots.appendChild(dot);

    });


    const dots =
        carouselDots.querySelectorAll(
            ".carousel-dot"
        );


    /* Update */

    function updateCarousel() {

        yearTrack.style.transform =
            `translateX(-${currentSlide * 100}%)`;


        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        });

    }


    /* Previous */

    prevYear.addEventListener(
        "click",
        () => {

            currentSlide--;

            if (currentSlide < 0) {

                currentSlide =
                    totalSlides - 1;

            }

            updateCarousel();

        }
    );


    /* Next */

    nextYear.addEventListener(
        "click",
        () => {

            currentSlide++;

            if (
                currentSlide >= totalSlides
            ) {

                currentSlide = 0;

            }

            updateCarousel();

        }
    );


    /* Initial */

    updateCarousel();


    /* Auto slide */

    let autoSlide =
        setInterval(() => {

            currentSlide++;

            if (
                currentSlide >= totalSlides
            ) {

                currentSlide = 0;

            }

            updateCarousel();

        }, 4000);


    /* Pause when mouse is over */

    yearTrack.addEventListener(
        "mouseenter",
        () => {

            clearInterval(autoSlide);

        }
    );


    yearTrack.addEventListener(
        "mouseleave",
        () => {

            autoSlide =
                setInterval(() => {

                    currentSlide++;

                    if (
                        currentSlide >= totalSlides
                    ) {

                        currentSlide = 0;

                    }

                    updateCarousel();

                }, 4000);

        }
    );

}