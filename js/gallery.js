// =========================================
// GALLERY FILTERS
// =========================================

const festivalBtns = document.querySelectorAll("[data-festival]");
const mediaBtns = document.querySelectorAll("[data-media]");
const yearBtns = document.querySelectorAll(".year-btn");

const galleryCards = document.querySelectorAll(".gallery-card");
const videoCards = document.querySelectorAll(".video-card");

const imageGallery = document.getElementById("imageGallery");
const videoGallery = document.getElementById("videoGallery");
const emptyGallery = document.querySelector(".empty-gallery");

// =========================================
// DEFAULT
// =========================================

let selectedFestival = "ganesh";
let selectedMedia = "images";
let selectedYear = "2026";

// =========================================
// FILTER FUNCTION
// =========================================

function filterGallery() {

    let visibleItems = 0;

    if (selectedMedia === "images") {

        imageGallery.style.display = "grid";
        videoGallery.style.display = "none";

        galleryCards.forEach(card => {

            const festival = card.dataset.festival;
            const year = card.dataset.year;

            if (
                festival === selectedFestival &&
                year === selectedYear
            ) {

                card.style.display = "block";
                visibleItems++;

            } else {

                card.style.display = "none";

            }

        });

    } else {

        imageGallery.style.display = "none";
        videoGallery.style.display = "grid";

        videoCards.forEach(card => {

            const festival = card.dataset.festival;
            const year = card.dataset.year;

            if (
                festival === selectedFestival &&
                year === selectedYear
            ) {

                card.style.display = "block";
                visibleItems++;

            } else {

                card.style.display = "none";

            }

        });

    }

    emptyGallery.style.display =
        visibleItems === 0 ? "block" : "none";

}

filterGallery();

// =========================================
// FESTIVAL BUTTONS
// =========================================

festivalBtns.forEach(button => {

    button.addEventListener("click", () => {

        festivalBtns.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedFestival = button.dataset.festival;

        filterGallery();

    });

});

// =========================================
// MEDIA BUTTONS
// =========================================

mediaBtns.forEach(button => {

    button.addEventListener("click", () => {

        mediaBtns.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedMedia = button.dataset.media;

        filterGallery();

    });

});

// =========================================
// YEAR BUTTONS
// =========================================

yearBtns.forEach(button => {

    button.addEventListener("click", () => {

        yearBtns.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedYear = button.dataset.year;

        filterGallery();

    });

});

// =========================================
// LIGHTBOX
// =========================================

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const closeBtn = document.querySelector(".close-lightbox");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentImages = [];
let currentIndex = 0;

// Refresh image list whenever filters change
function updateCurrentImages() {

    currentImages = [...document.querySelectorAll(
        '.gallery-card:not([style*="display: none"]) img'
    )];

}

document.addEventListener("click", function (e) {

    if (!e.target.closest(".gallery-card img"))
        return;

    updateCurrentImages();

    currentIndex = currentImages.indexOf(e.target);

    lightbox.style.display = "flex";

    lightboxImage.src = e.target.src;

});

function showImage(index) {

    if (currentImages.length === 0)
        return;

    if (index < 0)
        index = currentImages.length - 1;

    if (index >= currentImages.length)
        index = 0;

    currentIndex = index;

    lightboxImage.src =
        currentImages[currentIndex].src;

}

nextBtn.addEventListener("click", () => {

    showImage(currentIndex + 1);

});

prevBtn.addEventListener("click", () => {

    showImage(currentIndex - 1);

});

closeBtn.addEventListener("click", () => {

    lightbox.style.display = "none";

});

lightbox.addEventListener("click", e => {

    if (e.target === lightbox)
        lightbox.style.display = "none";

});

// =========================================
// KEYBOARD SUPPORT
// =========================================

document.addEventListener("keydown", e => {

    if (lightbox.style.display !== "flex")
        return;

    if (e.key === "Escape") {

        lightbox.style.display = "none";

    }

    if (e.key === "ArrowRight") {

        showImage(currentIndex + 1);

    }

    if (e.key === "ArrowLeft") {

        showImage(currentIndex - 1);

    }

});

// =========================================
// TOUCH SWIPE SUPPORT
// =========================================

let startX = 0;

lightbox.addEventListener("touchstart", e => {

    startX = e.touches[0].clientX;

});

lightbox.addEventListener("touchend", e => {

    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {

        showImage(currentIndex + 1);

    }

    if (endX - startX > 50) {

        showImage(currentIndex - 1);

    }

});