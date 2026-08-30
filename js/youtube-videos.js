/* =========================================================
   SUN SHINE CLUB KENDUPALLI
   YOUTUBE VIDEOS + IN-PAGE PLAYER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadYouTubeVideos();

    createYouTubePlayerModal();

});


/* =========================================================
   CONFIGURATION
========================================================= */

const YOUTUBE_VIDEOS_API =
    "https://sunshine-youtube-videos.still-mouse-2d92.workers.dev/youtube-videos";


/* =========================================================
   LOAD VIDEOS
========================================================= */

async function loadYouTubeVideos() {

    const loading =
        document.getElementById("youtubeLoading");

    const wrapper =
        document.getElementById("youtubeVideoWrapper");

    const list =
        document.getElementById("youtubeVideoList");

    const error =
        document.getElementById("youtubeError");


    if (!list) return;


    try {

        loading?.removeAttribute("hidden");

        wrapper?.setAttribute("hidden", "");

        error?.setAttribute("hidden", "");


        const response =
            await fetch(YOUTUBE_VIDEOS_API);


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            data.success !== true ||
            !Array.isArray(data.videos)
        ) {

            throw new Error(
                "Invalid YouTube API response"
            );

        }


        if (data.videos.length === 0) {

            throw new Error(
                "No YouTube videos found"
            );

        }


        list.innerHTML =
            data.videos
                .map(createYouTubeCard)
                .join("");


        loading?.setAttribute(
            "hidden",
            ""
        );

        wrapper?.removeAttribute(
            "hidden"
        );


        initializeYouTubeScroll();


    } catch (errorMessage) {

        console.error(
            "YouTube videos error:",
            errorMessage
        );


        loading?.setAttribute(
            "hidden",
            ""
        );

        wrapper?.setAttribute(
            "hidden",
            ""
        );

        error?.removeAttribute(
            "hidden"
        );

    }

}


/* =========================================================
   CREATE VIDEO CARD
========================================================= */

function createYouTubeCard(video) {

    const videoId =
        escapeHTML(
            video.videoId || ""
        );


    const title =
        escapeHTML(
            video.title ||
            "YouTube Video"
        );


    const thumbnail =
        escapeHTML(
            video.thumbnail ||
            `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        );


    const channelName =
        escapeHTML(
            video.channelTitle ||
            "Sunshine Club Kendupalli"
        );


    const channelLogo =
        escapeHTML(
            video.channelLogo ||
            ""
        );


    const publishedDate =
        formatYouTubeDate(
            video.publishedAt
        );


    return `

        <article
            class="youtube-video-card"
        >

            <!-- VIDEO THUMBNAIL -->

            <button
                type="button"
                class="youtube-thumbnail youtube-play-trigger"
                data-video-id="${videoId}"
                data-video-title="${title}"
                aria-label="Play ${title}"
            >

                <img
                    src="${thumbnail}"
                    alt="${title}"
                    loading="lazy"
                    width="640"
                    height="360"
                >

                <span
                    class="youtube-play"
                    aria-hidden="true"
                >

                    <i class="fa-solid fa-play"></i>

                </span>

            </button>


            <!-- VIDEO INFORMATION -->

            <div
                class="youtube-video-info"
            >

                <div
                    class="youtube-video-channel"
                >

                    ${
                        channelLogo

                            ? `

                                <img
                                    src="${channelLogo}"
                                    alt=""
                                    loading="lazy"
                                >

                            `

                            : `

                                <i
                                    class="fa-brands fa-youtube"
                                    aria-hidden="true"
                                ></i>

                            `
                    }

                    <span>
                        ${channelName}
                    </span>

                </div>


                <button
                    type="button"
                    class="youtube-video-title youtube-play-trigger"
                    data-video-id="${videoId}"
                    data-video-title="${title}"
                >
                    ${title}
                </button>


                <time
                    class="youtube-video-date"
                    datetime="${escapeHTML(
                        video.publishedAt || ""
                    )}"
                >
                    ${publishedDate}
                </time>

            </div>

        </article>

    `;

}


/* =========================================================
   CREATE PLAYER MODAL
========================================================= */

function createYouTubePlayerModal() {

    if (
        document.getElementById(
            "youtubePlayerModal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement("div");


    modal.id =
        "youtubePlayerModal";


    modal.className =
        "youtube-player-modal";


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    modal.innerHTML = `

        <div
            class="youtube-player-overlay"
            data-youtube-close
        ></div>


        <div
            class="youtube-player-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="youtubePlayerTitle"
        >

            <button
                type="button"
                class="youtube-player-close"
                id="youtubePlayerClose"
                aria-label="Close video"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div
                class="youtube-player-container"
            >

                <iframe
                    id="youtubePlayerIframe"
                    title="YouTube video player"
                    src=""
                    allow="
                        accelerometer;
                        autoplay;
                        clipboard-write;
                        encrypted-media;
                        gyroscope;
                        picture-in-picture;
                        web-share
                    "
                    allowfullscreen
                ></iframe>

            </div>


            <div
                class="youtube-player-information"
            >

                <h2
                    id="youtubePlayerTitle"
                >
                    YouTube Video
                </h2>

                <span>
                    Sunshine Club Kendupalli
                </span>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    /* -----------------------------------------
       Close button
    ----------------------------------------- */

    document
        .getElementById("youtubePlayerClose")
        ?.addEventListener(
            "click",
            closeYouTubePlayer
        );


    /* -----------------------------------------
       Overlay
    ----------------------------------------- */

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target.hasAttribute(
                    "data-youtube-close"
                )
            ) {

                closeYouTubePlayer();

            }

        }
    );


    /* -----------------------------------------
       ESC key
    ----------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeYouTubePlayer();

            }

        }
    );

}


/* =========================================================
   OPEN PLAYER
========================================================= */

function openYouTubePlayer(
    videoId,
    title
) {

    const modal =
        document.getElementById(
            "youtubePlayerModal"
        );


    const iframe =
        document.getElementById(
            "youtubePlayerIframe"
        );


    const titleElement =
        document.getElementById(
            "youtubePlayerTitle"
        );


    if (
        !modal ||
        !iframe
    ) {

        return;

    }


    /*
     * YouTube embed URL
     *
     * autoplay=1
     * playsinline=1
     */

    iframe.src =
        `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&playsinline=1&rel=0`;


    if (titleElement) {

        titleElement.textContent =
            title ||
            "YouTube Video";

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "youtube-modal-open"
    );


    /*
     * Prevent background scrolling
     */

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE PLAYER
========================================================= */

function closeYouTubePlayer() {

    const modal =
        document.getElementById(
            "youtubePlayerModal"
        );


    const iframe =
        document.getElementById(
            "youtubePlayerIframe"
        );


    if (!modal) return;


    /*
     * IMPORTANT:
     * Remove iframe src so the video stops
     */

    if (iframe) {

        iframe.src = "";

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "youtube-modal-open"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   VIDEO CLICK HANDLER
========================================================= */

document.addEventListener(
    "click",
    event => {

        const trigger =
            event.target.closest(
                ".youtube-play-trigger"
            );


        if (!trigger) return;


        const videoId =
            trigger.dataset.videoId;


        const title =
            trigger.dataset.videoTitle ||
            "YouTube Video";


        if (!videoId) {

            console.error(
                "YouTube video ID missing"
            );

            return;

        }


        openYouTubePlayer(
            videoId,
            title
        );

    }
);


/* =========================================================
   HORIZONTAL SCROLL
========================================================= */

function initializeYouTubeScroll() {

    const list =
        document.getElementById(
            "youtubeVideoList"
        );


    const left =
        document.getElementById(
            "youtubeScrollLeft"
        );


    const right =
        document.getElementById(
            "youtubeScrollRight"
        );


    if (!list) return;


    left?.addEventListener(
        "click",
        () => {

            list.scrollBy({

                left: -350,

                behavior: "smooth"

            });

        }
    );


    right?.addEventListener(
        "click",
        () => {

            list.scrollBy({

                left: 350,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   RETRY
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#youtubeRetry"
            )
        ) {

            loadYouTubeVideos();

        }

    }
);


/* =========================================================
   DATE FORMAT
========================================================= */

function formatYouTubeDate(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}