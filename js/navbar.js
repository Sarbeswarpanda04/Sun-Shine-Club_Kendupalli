// Navbar toggle functionality
// Author: Sarbeswar Panda


// Navbar toggle functionality
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuBtn.innerHTML = navLinks.classList.contains("active") ? "✖" : "☰";
});


// Highlight current page
document.addEventListener("DOMContentLoaded", () => {

    const currentURL = window.location.pathname;

    document.querySelectorAll(".nav-links a").forEach(link => {

        const linkURL = new URL(link.href).pathname;

        if (
            currentURL === linkURL ||
            (currentURL === "/" && linkURL.endsWith("/index.html"))
        ) {
            link.parentElement.classList.add("is-active");
        }

    });

});