// Navbar toggle functionality
// Author: Sarbeswar Panda


// Toggle the navigation menu on small screens
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    menuBtn.innerHTML = navLinks.classList.contains("active")
        ? "✖"
        : "☰";
});



// Highlight the current page in the navigation bar
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();

    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
        link.parentElement.classList.add("active");
    }
});