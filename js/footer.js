/*==================================================
                FOOTER JAVASCRIPT
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*====================================
            AUTO COPYRIGHT YEAR
    ====================================*/

    const year = document.getElementById("year");

    if(year){

        year.textContent = new Date().getFullYear();

    }



    /*====================================
            BACK TO TOP
    ====================================*/

    const backToTop = document.querySelector(".back-to-top");

    if(backToTop){

        backToTop.addEventListener("click", () => {

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

    }



    /*====================================
        SHOW / HIDE BACK TO TOP
    ====================================*/

    window.addEventListener("scroll", () => {

        if(!backToTop) return;

        if(window.scrollY > 500){

            backToTop.style.opacity = "1";

            backToTop.style.visibility = "visible";

            backToTop.style.pointerEvents = "auto";

        }

        else{

            backToTop.style.opacity = "0";

            backToTop.style.visibility = "hidden";

            backToTop.style.pointerEvents = "none";

        }

    });



    /*====================================
            FOOTER REVEAL
    ====================================*/

    const footer = document.querySelector(".footer");

    if(footer){

        const footerObserver = new IntersectionObserver((entries)=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    footer.classList.add("reveal");

                }

            });

        },{

            threshold:0.2

        });

        footerObserver.observe(footer);

    }



    /*====================================
        SOCIAL ICON ANIMATION
    ====================================*/

    const socialIcons = document.querySelectorAll(".footer-social a");

    socialIcons.forEach(icon=>{

        icon.addEventListener("mouseenter",()=>{

            icon.style.transform =

                "translateY(-8px) rotate(10deg)";

        });

        icon.addEventListener("mouseleave",()=>{

            icon.style.transform =

                "translateY(0) rotate(0deg)";

        });

    });



    /*====================================
        QUICK LINKS EFFECT
    ====================================*/

    const links = document.querySelectorAll(".footer-links a");

    links.forEach(link=>{

        link.addEventListener("mouseenter",()=>{

            link.style.paddingLeft = "8px";

        });

        link.addEventListener("mouseleave",()=>{

            link.style.paddingLeft = "0";

        });

    });



    /*====================================
            MAP ANIMATION
    ====================================*/

    const map = document.querySelector(".footer-map iframe");

    if(map){

        map.addEventListener("mouseenter",()=>{

            map.style.transform =

                "scale(1.02)";

        });

        map.addEventListener("mouseleave",()=>{

            map.style.transform =

                "scale(1)";

        });

    }



    /*====================================
            CARD REVEAL
    ====================================*/

    const cards = document.querySelectorAll(

        ".footer-about, .footer-map, .footer-links, .footer-contact"

    );



    const cardObserver = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity = "1";

                entry.target.style.transform = "translateY(0)";

            }

        });

    },{

        threshold:.2

    });



    cards.forEach(card=>{

        card.style.opacity = "0";

        card.style.transform = "translateY(40px)";

        card.style.transition =

            "all .8s ease";

        cardObserver.observe(card);

    });



    /*====================================
        KEYBOARD SUPPORT
    ====================================*/

    document.addEventListener("keydown",(event)=>{

        if(event.key === "Home"){

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

    });



    /*====================================
        EXTERNAL LINKS
    ====================================*/

    document.querySelectorAll(

        '.footer a[target="_blank"]'

    ).forEach(link=>{

        link.setAttribute(

            "rel",

            "noopener noreferrer"

        );

    });



    /*====================================
            PAGE LOADED
    ====================================*/

    console.log(

        "✓ Premium Footer Loaded Successfully"

    );

});