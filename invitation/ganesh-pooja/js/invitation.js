/* =========================================
   GANESH PUJA INVITATION
========================================= */


/* =========================================
   PARTICLES
========================================= */

const particleContainer =
    document.getElementById("particles");

const particleSymbols = [
    "🌸",
    "🌼",
    "🌺",
    "✨",
    "🪔"
];

for(let i = 0; i < 25; i++){

    const particle =
        document.createElement("span");

    particle.className = "particle";

    particle.textContent =
        particleSymbols[
            Math.floor(
                Math.random() *
                particleSymbols.length
            )
        ];

    particle.style.left =
        Math.random() * 100 + "%";

    particle.style.fontSize =
        (10 + Math.random() * 14) + "px";

    particle.style.animationDuration =
        (6 + Math.random() * 8) + "s";

    particle.style.animationDelay =
        Math.random() * 8 + "s";

    particleContainer.appendChild(particle);

}


/* =========================================
   BACKGROUND MUSIC
========================================= */

const music =
    document.getElementById("backgroundMusic");

const musicButton =
    document.getElementById("musicButton");

const musicIcon =
    musicButton.querySelector("i");


/* =========================================
   PLAY MUSIC
========================================= */

async function playMusic(){

    try{

        await music.play();

        musicButton.classList.add("playing");

        musicIcon.className =
            "fa-solid fa-volume-high";

    }

    catch(error){

        console.log(
            "Music autoplay blocked by browser."
        );

    }

}


/* =========================================
   PAUSE MUSIC
========================================= */

function pauseMusic(){

    music.pause();

    musicButton.classList.remove("playing");

    musicIcon.className =
        "fa-solid fa-volume-xmark";

}


/* =========================================
   MUSIC BUTTON
========================================= */

musicButton.addEventListener(
    "click",
    () => {

        if(music.paused){

            playMusic();

        }else{

            pauseMusic();

        }

    }
);


/* =========================================
   START MUSIC AFTER USER INTERACTION
========================================= */

document.addEventListener(
    "click",
    () => {

        if(music.paused){

            playMusic();

        }

    },
    {
        once:true
    }
);


/* =========================================
   KEYBOARD INTERACTION
========================================= */

document.addEventListener(
    "keydown",
    () => {

        if(music.paused){

            playMusic();

        }

    },
    {
        once:true
    }
);


/* =========================================
   VISIBILITY CONTROL
========================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if(document.hidden){

            music.pause();

        }

    }
);