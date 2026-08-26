// =========================================
// SUN SHINE CLUB
// DYNAMIC GALLERY SYSTEM
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // ELEMENTS
    // =========================================

    const festivalBtns =
        document.querySelectorAll(".festival-option, [data-festival]");

    const mediaBtns =
        document.querySelectorAll(".media-option, [data-media]");

    const yearBtns =
        document.querySelectorAll(".year-option, .year-btn, [data-year]");

    const imageGallery =
        document.getElementById("imageGallery");

    const videoGallery =
        document.getElementById("videoGallery");

    const emptyGallery =
        document.getElementById("emptyGallery");

    const galleryCount =
        document.getElementById("galleryCount");

    const galleryDescription =
        document.getElementById("galleryDescription");

    const galleryTitle =
        document.getElementById("gallery-results-title");

    const resetBtn =
        document.getElementById("resetGalleryFilters");

    const selectionSummary =
        document.getElementById("selectionSummary");


    // =========================================
    // DEFAULT VALUES
    // =========================================

    const DEFAULT_FESTIVAL = "ganesh";
    const DEFAULT_YEAR = "2026";
    const DEFAULT_MEDIA = "images";


    // =========================================
    // READ URL
    // =========================================

    const params =
        new URLSearchParams(window.location.search);


    let selectedFestival =
        params.get("festival") || DEFAULT_FESTIVAL;

    let selectedYear =
        params.get("year") || DEFAULT_YEAR;

    let selectedMedia =
        params.get("media") || DEFAULT_MEDIA;


    // =========================================
    // LIGHTBOX VARIABLES
    // =========================================

    let currentImages = [];
    let currentIndex = 0;


    // =========================================
    // CHECK DATA
    // =========================================

    function getFestivalData() {

        if (
            !window.GALLERY_DATA ||
            !window.GALLERY_DATA[selectedFestival]
        ) {
            return null;
        }

        return window.GALLERY_DATA[selectedFestival];

    }


    function getAlbum() {

        const festival =
            getFestivalData();

        if (!festival) {
            return null;
        }

        return festival[selectedYear] || null;

    }


    // =========================================
    // FESTIVAL NAME
    // =========================================

    function getFestivalName() {

        const names = {
            ganesh: "Ganesh",
            saraswati: "Saraswati",
            durga: "Durga",
            holi: "Holi",
            diwali: "Diwali",
            raksha: "Raksha Bandhan"
        };

        return names[selectedFestival]
            || selectedFestival
                .charAt(0)
                .toUpperCase()
            + selectedFestival.slice(1);

    }


    // =========================================
    // MEDIA NAME
    // =========================================

    function getMediaName() {

        return selectedMedia === "videos"
            ? "Videos"
            : "Images";

    }


    // =========================================
    // UPDATE URL
    // =========================================

    function updateURL() {

        const url =
            new URL(window.location.href);

        url.searchParams.set(
            "festival",
            selectedFestival
        );

        url.searchParams.set(
            "year",
            selectedYear
        );

        url.searchParams.set(
            "media",
            selectedMedia
        );

        window.history.replaceState(
            {},
            "",
            url
        );

    }


    // =========================================
    // UPDATE ACTIVE BUTTONS
    // =========================================

    function updateActiveButtons() {

        festivalBtns.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.festival === selectedFestival
            );

        });


        yearBtns.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.year === selectedYear
            );

        });


        mediaBtns.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.media === selectedMedia
            );

        });

    }


    // =========================================
    // UPDATE SUMMARY
    // =========================================

    function updateSelectionSummary() {

        if (!selectionSummary) {
            return;
        }

        selectionSummary.textContent =
            `${getFestivalName()} • ${selectedYear} • ${getMediaName()}`;

    }


    // =========================================
    // UPDATE GALLERY HEADING
    // =========================================

    function updateAlbumHeading(album) {

        if (galleryTitle) {

            galleryTitle.textContent =
                album?.title || "Gallery";

        }

        if (galleryDescription) {

            galleryDescription.textContent =
                album?.description || "";

        }

    }


    // =========================================
    // EMPTY STATE
    // =========================================

    function showEmpty(message = "No media available") {

        if (imageGallery) {

            imageGallery.innerHTML = "";

            imageGallery.hidden = true;

        }


        if (videoGallery) {

            videoGallery.innerHTML = "";

            videoGallery.hidden = true;

        }


        if (galleryCount) {

            galleryCount.textContent = "0 items";

        }


        if (emptyGallery) {

            emptyGallery.hidden = false;

            const title =
                emptyGallery.querySelector("h3");

            if (title) {

                title.textContent = message;

            }

        }

    }


    // =========================================
    // HIDE EMPTY STATE
    // =========================================

    function hideEmpty() {

        if (emptyGallery) {

            emptyGallery.hidden = true;

        }

    }


    // =========================================
    // RENDER IMAGES
    // =========================================

    function renderImages(album) {

        if (!imageGallery) {
            return;
        }


        imageGallery.innerHTML = "";

        imageGallery.hidden = false;


        if (videoGallery) {

            videoGallery.innerHTML = "";

            videoGallery.hidden = true;

        }


        currentImages =
            Array.isArray(album.images)
                ? album.images
                : [];


        if (currentImages.length === 0) {

            showEmpty(
                "No images available for this selection"
            );

            return;

        }


        if (galleryCount) {

            galleryCount.textContent =
                `${currentImages.length} ${
                    currentImages.length === 1
                        ? "photo"
                        : "photos"
                }`;

        }


        currentImages.forEach(
            (image, index) => {

                const card =
                    document.createElement("article");

                card.className =
                    "gallery-card";

                card.dataset.index =
                    index;


                const figure =
                    document.createElement("figure");


                const img =
                    document.createElement("img");


                img.src =
                    image.src;

                img.alt =
                    image.alt ||
                    `${album.title || "Sun Shine Club"} photo ${index + 1}`;

                img.loading =
                    index < 3
                        ? "eager"
                        : "lazy";

                img.decoding =
                    "async";

                if (index === 0) {

                    img.fetchPriority =
                        "high";

                }


                // Do not force incorrect dimensions.
                // Browser will use the actual image ratio.

                figure.appendChild(img);

                card.appendChild(figure);

                imageGallery.appendChild(card);

            }
        );


        hideEmpty();

    }


    // =========================================
    // YOUTUBE THUMBNAIL
    // =========================================

    function getYouTubeThumbnail(videoId) {

        return (
            `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        );

    }


    // =========================================
    // RENDER VIDEOS
    // =========================================

    function renderVideos(album) {

        if (!videoGallery) {
            return;
        }


        videoGallery.innerHTML = "";

        videoGallery.hidden = false;


        if (imageGallery) {

            imageGallery.innerHTML = "";

            imageGallery.hidden = true;

        }


        const videos =
            Array.isArray(album.videos)
                ? album.videos
                : [];


        if (videos.length === 0) {

            showEmpty(
                "No videos available for this selection"
            );

            return;

        }


        if (galleryCount) {

            galleryCount.textContent =
                `${videos.length} ${
                    videos.length === 1
                        ? "video"
                        : "videos"
                }`;

        }


        videos.forEach(
            (videoId, index) => {

                const card =
                    document.createElement("article");

                card.className =
                    "video-card";


                const button =
                    document.createElement("button");

                button.type =
                    "button";

                button.className =
                    "video-thumbnail";

                button.dataset.videoId =
                    videoId;


                const img =
                    document.createElement("img");

                img.src =
                    getYouTubeThumbnail(videoId);

                img.alt =
                    `${album.title || "Sun Shine Club"} video ${index + 1}`;

                img.loading =
                    index < 2
                        ? "eager"
                        : "lazy";

                img.decoding =
                    "async";


                const play =
                    document.createElement("span");

                play.className =
                    "video-play";

                play.innerHTML =
                    '<i class="fa-solid fa-play"></i>';


                const label =
                    document.createElement("span");

                label.className =
                    "video-label";

                label.textContent =
                    `Watch ${album.title || "Sun Shine Club"}`;


                button.appendChild(img);

                button.appendChild(play);

                button.appendChild(label);

                card.appendChild(button);

                videoGallery.appendChild(card);

            }
        );


        hideEmpty();

    }


    // =========================================
    // LOAD GALLERY
    // =========================================

    function loadGallery() {

        console.log(
            "Gallery:",
            selectedFestival,
            selectedYear,
            selectedMedia
        );


        updateActiveButtons();

        updateSelectionSummary();

        updateURL();


        // -----------------------------------------
        // Check data
        // -----------------------------------------

        if (!window.GALLERY_DATA) {

            console.error(
                "GALLERY_DATA is not loaded."
            );

            showEmpty(
                "Gallery data is unavailable"
            );

            return;

        }


        // -----------------------------------------
        // Get album
        // -----------------------------------------

        const album =
            getAlbum();


        // -----------------------------------------
        // Album doesn't exist
        // -----------------------------------------

        if (!album) {

            console.warn(
                `No album found for ${selectedFestival} ${selectedYear}`
            );

            showEmpty(
                `No gallery available for ${getFestivalName()} ${selectedYear}`
            );

            return;

        }


        // -----------------------------------------
        // Heading
        // -----------------------------------------

        updateAlbumHeading(album);


        // -----------------------------------------
        // Render selected media
        // -----------------------------------------

        if (selectedMedia === "videos") {

            renderVideos(album);

        } else {

            renderImages(album);

        }

    }


    // =========================================
    // FESTIVAL FILTER
    // =========================================

    festivalBtns.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedFestival =
                    button.dataset.festival;


                // Automatically select the newest
                // available year for this festival.

                const festivalData =
                    getFestivalData();


                if (
                    festivalData &&
                    !festivalData[selectedYear]
                ) {

                    const availableYears =
                        Object.keys(festivalData)
                            .sort(
                                (a, b) =>
                                    Number(b) - Number(a)
                            );


                    if (availableYears.length) {

                        selectedYear =
                            availableYears[0];

                    }

                }


                updateActiveButtons();

                updateSelectionSummary();

                closeMobileFilter(button);

                loadGallery();

            }
        );

    });


    // =========================================
    // YEAR FILTER
    // =========================================

    yearBtns.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedYear =
                    button.dataset.year;


                updateActiveButtons();

                updateSelectionSummary();

                closeMobileFilter(button);

                loadGallery();

            }
        );

    });


    // =========================================
    // MEDIA FILTER
    // =========================================

    mediaBtns.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedMedia =
                    button.dataset.media;


                updateActiveButtons();

                updateSelectionSummary();

                closeMobileFilter(button);

                loadGallery();

            }
        );

    });


    // =========================================
    // RESET
    // =========================================

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            () => {

                selectedFestival =
                    DEFAULT_FESTIVAL;

                selectedYear =
                    DEFAULT_YEAR;

                selectedMedia =
                    DEFAULT_MEDIA;


                updateActiveButtons();

                updateSelectionSummary();

                closeAllMobileFilters();

                loadGallery();

            }
        );

    }


    // =========================================
    // MOBILE FILTER ACCORDION
    // =========================================

    const filterHeadings =
        document.querySelectorAll(
            "[data-filter-toggle]"
        );


    filterHeadings.forEach(heading => {

        heading.addEventListener(
            "click",
            () => {

                if (window.innerWidth > 768) {
                    return;
                }


                const block =
                    heading.closest(".filter-block");


                if (!block) {
                    return;
                }


                const wasOpen =
                    block.classList.contains("open");


                closeAllMobileFilters();


                if (!wasOpen) {

                    block.classList.add("open");

                }

            }
        );

    });


    // =========================================
    // CLOSE MOBILE FILTER
    // =========================================

    function closeMobileFilter(button) {

        if (window.innerWidth > 768) {
            return;
        }


        const block =
            button.closest(".filter-block");


        if (block) {

            block.classList.remove("open");

        }

    }


    function closeAllMobileFilters() {

        document
            .querySelectorAll(".filter-block.open")
            .forEach(block => {

                block.classList.remove("open");

            });

    }


    // =========================================
    // LIGHTBOX
    // =========================================

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const closeBtn =
        document.querySelector(".close-lightbox");

    const prevBtn =
        document.querySelector(".prev-btn");

    const nextBtn =
        document.querySelector(".next-btn");


    function openLightbox(index) {

        if (!currentImages.length) {
            return;
        }


        currentIndex =
            Number(index);


        if (lightbox) {

            lightbox.classList.add("open");

        }


        document.body.classList.add(
            "lightbox-open"
        );


        showLightboxImage();

    }


    function closeLightbox() {

        if (lightbox) {

            lightbox.classList.remove("open");

        }


        document.body.classList.remove(
            "lightbox-open"
        );

    }


    function showLightboxImage() {

        if (!currentImages.length) {
            return;
        }


        const image =
            currentImages[currentIndex];


        if (!image || !lightboxImage) {
            return;
        }


        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt || "";


        const counter =
            document.getElementById(
                "lightboxCounter"
            );


        if (counter) {

            counter.textContent =
                `${currentIndex + 1} / ${currentImages.length}`;

        }


        preloadAdjacentImages();

    }


    function nextImage() {

        if (!currentImages.length) {
            return;
        }


        currentIndex =
            (
                currentIndex + 1
            ) %
            currentImages.length;


        showLightboxImage();

    }


    function previousImage() {

        if (!currentImages.length) {
            return;
        }


        currentIndex =
            (
                currentIndex -
                1 +
                currentImages.length
            ) %
            currentImages.length;


        showLightboxImage();

    }


    function preloadAdjacentImages() {

        if (!currentImages.length) {
            return;
        }


        const nextIndex =
            (
                currentIndex + 1
            ) %
            currentImages.length;


        const previousIndex =
            (
                currentIndex -
                1 +
                currentImages.length
            ) %
            currentImages.length;


        const next =
            new Image();

        next.src =
            currentImages[nextIndex].src;


        const previous =
            new Image();

        previous.src =
            currentImages[previousIndex].src;

    }


    // =========================================
    // IMAGE CLICK
    // =========================================

    if (imageGallery) {

        imageGallery.addEventListener(
            "click",
            event => {

                const card =
                    event.target.closest(
                        ".gallery-card"
                    );


                if (!card) {
                    return;
                }


                openLightbox(
                    card.dataset.index
                );

            }
        );

    }


    // =========================================
    // LIGHTBOX BUTTONS
    // =========================================

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextImage
        );

    }


    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            previousImage
        );

    }


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeLightbox
        );

    }


    if (lightbox) {

        lightbox.addEventListener(
            "click",
            event => {

                if (
                    event.target === lightbox
                ) {

                    closeLightbox();

                }

            }
        );

    }


    // =========================================
    // KEYBOARD
    // =========================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox ||
                !lightbox.classList.contains("open")
            ) {
                return;
            }


            if (event.key === "Escape") {

                closeLightbox();

            }


            if (event.key === "ArrowRight") {

                nextImage();

            }


            if (event.key === "ArrowLeft") {

                previousImage();

            }

        }
    );


    // =========================================
    // TOUCH SWIPE
    // =========================================

    let touchStartX = 0;


    if (lightbox) {

        lightbox.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            {
                passive: true
            }
        );


        lightbox.addEventListener(
            "touchend",
            event => {

                const touchEndX =
                    event.changedTouches[0].screenX;


                const difference =
                    touchStartX -
                    touchEndX;


                if (
                    Math.abs(difference) < 50
                ) {
                    return;
                }


                if (difference > 0) {

                    nextImage();

                } else {

                    previousImage();

                }

            },
            {
                passive: true
            }
        );

    }


    // =========================================
    // VIDEO LAZY LOAD
    // =========================================

    if (videoGallery) {

        videoGallery.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".video-thumbnail"
                    );


                if (!button) {
                    return;
                }


                const videoId =
                    button.dataset.videoId;


                if (!videoId) {
                    return;
                }


                const iframe =
                    document.createElement(
                        "iframe"
                    );


                iframe.src =
                    `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;


                iframe.title =
                    "Sun Shine Club video";


                iframe.loading =
                    "lazy";


                iframe.allow =
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


                iframe.allowFullscreen =
                    true;


                button.replaceWith(
                    iframe
                );

            }
        );

    }


    // =========================================
    // MOBILE: OPEN FIRST FILTER
    // =========================================

    if (window.innerWidth <= 768) {

        const firstBlock =
            document.querySelector(
                ".filter-block"
            );


        if (firstBlock) {

            firstBlock.classList.add(
                "open"
            );

        }

    }


    // =========================================
    // INITIAL LOAD
    // =========================================

    updateActiveButtons();

    updateSelectionSummary();

    loadGallery();

});