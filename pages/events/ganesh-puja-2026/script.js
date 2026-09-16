document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;

  /* ================= LANGUAGE ================= */
  const languageToggle = document.getElementById("languageToggle");
  let currentLanguage = localStorage.getItem("ssc-ganesh-language") || "en";

  function applyLanguage(lang) {
    currentLanguage = lang;
    root.lang = lang === "or" ? "or" : "en";
    body.classList.toggle("odia", lang === "or");

    document.querySelectorAll("[data-en][data-or]").forEach(el => {
      el.textContent = lang === "or" ? el.dataset.or : el.dataset.en;
    });

    if (languageToggle) {
      languageToggle.textContent = lang === "en" ? "ଓଡ଼ିଆ" : "English";
      languageToggle.setAttribute(
        "aria-label",
        lang === "en" ? "Switch to Odia" : "Switch to English"
      );
    }

    localStorage.setItem("ssc-ganesh-language", lang);
  }

  languageToggle?.addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "or" : "en");
  });

  /* ================= MOBILE NAV ================= */
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  menuBtn?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
    });
  });

  /* ================= STATUS STORY ================= */
  const storyData = [
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_111942~2.jpg",
      alt: "Ganesh Puja celebration at Kendupalli",
      enTitle: "Ganesh Puja Celebration",
      orTitle: "ଗଣେଶ ପୂଜା ଉତ୍ସବ",
      enText: "A festive gathering filled with devotion, community spirit and joyful participation.",
      orText: "ଭକ୍ତି, ସାମୁଦାୟିକ ଏକତା ଓ ଆନନ୍ଦମୟ ଅଂଶଗ୍ରହଣରେ ଭରପୂର ଏକ ଉତ୍ସବ।"
    },
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_205541.jpg",
      alt: "Prize and certificate presentation",
      enTitle: "Recognition Moment",
      orTitle: "ସମ୍ମାନର ମୁହୂର୍ତ୍ତ",
      enText: "Students received recognition for their participation and achievements.",
      orText: "ଅଂଶଗ୍ରହଣ ଓ ସଫଳତା ପାଇଁ ଛାତ୍ରଛାତ୍ରୀମାନେ ସମ୍ମାନ ପାଇଥିଲେ।"
    },
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_163943.jpg",
      alt: "Students taking part in the competition",
      enTitle: "Students Take Centre Stage",
      orTitle: "ଛାତ୍ରଛାତ୍ରୀଙ୍କ ଅଂଶଗ୍ରହଣ",
      enText: "Young participants joined the competition with enthusiasm and concentration.",
      orText: "ଯୁବ ପ୍ରତିଯୋଗୀମାନେ ଉତ୍ସାହ ଓ ଏକାଗ୍ରତାର ସହ ପ୍ରତିଯୋଗିତାରେ ଭାଗ ନେଇଥିଲେ।"
    },
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_162430.jpg",
      alt: "Students working on competition entries",
      enTitle: "Creativity in Progress",
      orTitle: "ସୃଜନଶୀଳତାର ମୁହୂର୍ତ୍ତ",
      enText: "Students focused on preparing their creative competition entries.",
      orText: "ଛାତ୍ରଛାତ୍ରୀମାନେ ନିଜର ସୃଜନଶୀଳ ପ୍ରତିଯୋଗିତା କାମ ପ୍ରସ୍ତୁତ କରୁଥିଲେ।"
    },
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_205631.jpg",
      alt: "Young participants at the event",
      enTitle: "Young Talent",
      orTitle: "ଯୁବ ପ୍ରତିଭା",
      enText: "The programme gave young participants a shared space to express themselves.",
      orText: "ଯୁବ ପ୍ରତିଭାମାନଙ୍କୁ ନିଜ ଦକ୍ଷତା ପ୍ରକାଶ ପାଇଁ ଏକ ସାମୁଦାୟିକ ମଞ୍ଚ ମିଳିଥିଲା।"
    },
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_165439.jpg",
      alt: "Students seated during competition",
      enTitle: "Competition Day",
      orTitle: "ପ୍ରତିଯୋଗିତା ଦିବସ",
      enText: "A shared community setting turned the competition into a memorable experience.",
      orText: "ସାମୁଦାୟିକ ପରିବେଶ ପ୍ରତିଯୋଗିତାକୁ ଏକ ସ୍ମରଣୀୟ ଅନୁଭୂତିରେ ପରିଣତ କରିଥିଲା।"
    },
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_112413.jpg",
      alt: "Ganesh Puja decoration at Kendupalli",
      enTitle: "Festive Kendupalli",
      orTitle: "ଉତ୍ସବମୁଖର କେନ୍ଦୁପଲ୍ଲୀ",
      enText: "Colourful decoration and a welcoming atmosphere set the stage for the celebration.",
      orText: "ରଙ୍ଗିନ ସାଜସଜ୍ଜା ଓ ଆତିଥ୍ୟପୂର୍ଣ୍ଣ ପରିବେଶ ଉତ୍ସବକୁ ଆହୁରି ସୁନ୍ଦର କରିଥିଲା।"
    },
    {
      image: "https://pub-0ea4b0b9de9b4d6db5c369669418e7ef.r2.dev/gallery/ganesh/2026/IMG_20260914_105111.jpg",
      alt: "Community gathering during Ganesh Puja",
      enTitle: "Together as a Community",
      orTitle: "ଏକତାରେ ସମୁଦାୟ",
      enText: "Children, families and club members came together to celebrate.",
      orText: "ଶିଶୁ, ପରିବାର ଓ କ୍ଲବ୍ ସଦସ୍ୟମାନେ ଏକାଠି ହୋଇ ଉତ୍ସବ ପାଳନ କରିଥିଲେ।"
    }
  ];

  const storyImage = document.getElementById("storyImage");
  const storyTitle = document.getElementById("storyTitle");
  const storyText = document.getElementById("storyText");
  const storyCounter = document.getElementById("storyCounter");
  const storyThumbs = document.getElementById("storyThumbs");
  const progressWrap = document.getElementById("progressWrap");
  const nextStory = document.getElementById("nextStory");
  const prevStory = document.getElementById("prevStory");

  let storyIndex = 0;
  let storyTimer = null;
  const STORY_DURATION = 5000;

  function buildStoryControls() {
    progressWrap.innerHTML = "";
    storyThumbs.innerHTML = "";

    storyData.forEach((item, index) => {
      const segment = document.createElement("div");
      segment.className = "progress-segment";
      segment.innerHTML = "<span></span>";
      progressWrap.appendChild(segment);

      const thumb = document.createElement("button");
      thumb.className = "story-thumb";
      thumb.type = "button";
      thumb.innerHTML = `<img src="${item.image}" alt="${item.alt}">`;
      thumb.addEventListener("click", () => showStory(index, true));
      storyThumbs.appendChild(thumb);
    });
  }

  function updateProgress() {
    [...progressWrap.children].forEach((segment, index) => {
      const fill = segment.querySelector("span");
      fill.style.transition = "none";
      fill.style.width = index < storyIndex ? "100%" : "0%";

      if (index === storyIndex) {
        requestAnimationFrame(() => {
          fill.style.transition = `width ${STORY_DURATION}ms linear`;
          fill.style.width = "100%";
        });
      }
    });

    [...storyThumbs.children].forEach((thumb, index) => {
      thumb.classList.toggle("active", index === storyIndex);
    });
  }

  function showStory(index, restart = true) {
    storyIndex = (index + storyData.length) % storyData.length;
    const item = storyData[storyIndex];

    storyImage.style.opacity = "0";
    storyImage.style.transform = "scale(1.025)";

    setTimeout(() => {
      storyImage.src = item.image;
      storyImage.alt = item.alt;
      storyTitle.textContent = currentLanguage === "or" ? item.orTitle : item.enTitle;
      storyText.textContent = currentLanguage === "or" ? item.orText : item.enText;
      storyCounter.textContent = `${storyIndex + 1} / ${storyData.length}`;
      storyImage.style.opacity = "1";
      storyImage.style.transform = "scale(1)";
    }, 120);

    updateProgress();

    if (restart) startStoryTimer();
  }

  function startStoryTimer() {
    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => showStory(storyIndex + 1), STORY_DURATION);
  }

  nextStory?.addEventListener("click", () => showStory(storyIndex + 1, true));
  prevStory?.addEventListener("click", () => showStory(storyIndex - 1, true));

  /* Swipe like WhatsApp Status */
  let touchStartX = 0;
  storyImage?.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});

  storyImage?.addEventListener("touchend", e => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 45) {
      delta < 0 ? showStory(storyIndex + 1, true) : showStory(storyIndex - 1, true);
    }
  }, {passive:true});

  /* Pause story while page is hidden */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(storyTimer);
    else startStoryTimer();
  });

  /* ================= SHARE MODAL ================= */
  const shareModal = document.getElementById("shareModal");
  const shareBtn = document.getElementById("shareBtn");
  const topShare = document.getElementById("topShare");
  const shareClose = document.getElementById("shareClose");
  const sharePreview = document.getElementById("sharePreview");
  const nativeShare = document.getElementById("nativeShare");
  const whatsappShare = document.getElementById("whatsappShare");
  const copyShare = document.getElementById("copyShare");
  const downloadImage = document.getElementById("downloadImage");
  const shareStatus = document.getElementById("shareStatus");

  const pageUrl = window.location.href;
  const shareTitle = "Ganesh Puja Celebration 2026 | Sun Shine Club Kendupalli";
  const shareText =
    "Read the Ganesh Puja celebration story from Sun Shine Club, Kendupalli — student competition, community participation and prize moments.";

  function openShare() {
    shareModal.classList.add("open");
    shareModal.setAttribute("aria-hidden", "false");
    sharePreview.src = storyData[storyIndex].image;
    shareStatus.textContent = "";
    document.body.style.overflow = "hidden";
  }

  function closeShareModal() {
    shareModal.classList.remove("open");
    shareModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  shareBtn?.addEventListener("click", openShare);
  topShare?.addEventListener("click", openShare);
  shareClose?.addEventListener("click", closeShareModal);
  shareModal?.querySelector("[data-close-share]")?.addEventListener("click", closeShareModal);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeShareModal();
  });

  nativeShare?.addEventListener("click", async () => {
    if (!navigator.share) {
      shareStatus.textContent =
        currentLanguage === "or"
          ? "ଏହି ବ୍ରାଉଜରରେ Share Sheet ଉପଲବ୍ଧ ନାହିଁ।"
          : "Native sharing is not available in this browser.";
      return;
    }

    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: pageUrl
      });
      shareStatus.textContent =
        currentLanguage === "or" ? "ସେୟାର ଖୋଲିଗଲା।" : "Share sheet opened.";
    } catch (error) {
      if (error.name !== "AbortError") {
        shareStatus.textContent =
          currentLanguage === "or" ? "ସେୟାର କରିପାରିଲା ନାହିଁ।" : "Unable to open sharing.";
      }
    }
  });

  whatsappShare?.addEventListener("click", () => {
    const text = `${shareTitle}\n\n${shareText}\n${pageUrl}`;
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(text),
      "_blank",
      "noopener,noreferrer"
    );
  });

  copyShare?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      const temp = document.createElement("input");
      temp.value = pageUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      temp.remove();
    }

    shareStatus.textContent =
      currentLanguage === "or" ? "ଲିଙ୍କ୍ କପି ହୋଇଛି।" : "Link copied.";
  });

  /* Save the currently selected story image */
  downloadImage?.addEventListener("click", async () => {
    const src = storyData[storyIndex].image;
    try {
      const response = await fetch(src, {mode:"cors"});
      if (!response.ok) throw new Error("Image request failed");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `ganesh-puja-2026-${storyIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      shareStatus.textContent =
        currentLanguage === "or" ? "ଫଟୋ ସେଭ୍ ହେଉଛି।" : "Image save started.";
    } catch {
      window.open(src, "_blank", "noopener,noreferrer");
      shareStatus.textContent =
        currentLanguage === "or"
          ? "ଫଟୋକୁ ନୂଆ ଟ୍ୟାବ୍‌ରେ ଖୋଲାଗଲା।"
          : "Image opened in a new tab.";
    }
  });

  /* If an image is missing, make the replacement obvious */
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.style.opacity = ".55";
      img.alt = "Replace this image with the final event photograph";
    });
  });

  /* Initial state */
  buildStoryControls();
  applyLanguage(currentLanguage);
  showStory(0, false);
  startStoryTimer();
});


/* =========================================================
   CUSTOM YOUTUBE PLAYER
   Replace ONLY data-youtube-url in index.html
   ========================================================= */

const customVideo = document.getElementById("customVideo");
const videoFrame = document.getElementById("videoFrame");
const videoPlay = document.getElementById("videoPlay");
const videoMute = document.getElementById("videoMute");
const videoSeek = document.getElementById("videoSeek");
const videoTime = document.getElementById("videoTime");
const videoBigPlay = document.getElementById("videoBigPlay");
const videoFullscreen = document.getElementById("videoFullscreen");
const videoLoading = document.getElementById("videoLoading");

let ytPlayer = null;
let videoReady = false;
let videoTimer = null;
let controlsTimer = null;


/* =========================================================
   EXTRACT YOUTUBE VIDEO ID
   ========================================================= */

function getYouTubeId(url) {
    if (!url) return "";

    try {
        const u = new URL(url);

        // youtube.com/watch?v=VIDEO_ID
        const watchId = u.searchParams.get("v");

        if (watchId) {
            return watchId;
        }

        // youtu.be/VIDEO_ID
        if (u.hostname.includes("youtu.be")) {
            return u.pathname
                .replace(/^\/+/, "")
                .split("/")[0];
        }

        // youtube.com/embed/VIDEO_ID
        // youtube.com/shorts/VIDEO_ID
        const parts = u.pathname
            .split("/")
            .filter(Boolean);

        const embedIndex = parts.indexOf("embed");

        if (
            embedIndex !== -1 &&
            parts[embedIndex + 1]
        ) {
            return parts[embedIndex + 1];
        }

        const shortsIndex = parts.indexOf("shorts");

        if (
            shortsIndex !== -1 &&
            parts[shortsIndex + 1]
        ) {
            return parts[shortsIndex + 1];
        }

        return "";

    } catch (error) {
        console.error("Invalid YouTube URL:", error);

        // Allow direct video ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
            return url.trim();
        }

        return "";
    }
}


/* =========================================================
   FORMAT TIME
   ========================================================= */

function formatVideoTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {
        seconds = 0;
    }

    seconds = Math.floor(seconds);

    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
        (seconds % 3600) / 60
    );

    const secs = String(
        seconds % 60
    ).padStart(2, "0");

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${secs}`;
    }

    return `${minutes}:${secs}`;
}


/* =========================================================
   SHOW CUSTOM CONTROLS
   ========================================================= */

function showVideoControls() {

    if (!videoFrame) return;

    videoFrame.classList.add(
        "controls-visible"
    );

    clearTimeout(controlsTimer);

    controlsTimer = setTimeout(() => {

        if (
            ytPlayer &&
            ytPlayer.getPlayerState &&
            window.YT &&
            ytPlayer.getPlayerState() ===
                YT.PlayerState.PLAYING
        ) {
            videoFrame.classList.remove(
                "controls-visible"
            );
        }

    }, 2600);
}


/* =========================================================
   UPDATE CONTROLS
   ========================================================= */

function updateVideoUI() {

    if (
        !ytPlayer ||
        !videoReady ||
        !window.YT
    ) {
        return;
    }

    try {

        const current =
            ytPlayer.getCurrentTime() || 0;

        const duration =
            ytPlayer.getDuration() || 0;

        /* Progress */

        if (duration > 0) {

            videoSeek.value =
                (current / duration) * 100;

        } else {

            videoSeek.value = 0;

        }

        /* Time */

        videoTime.textContent =
            `${formatVideoTime(current)} / ${formatVideoTime(duration)}`;

        /* Player state */

        const state =
            ytPlayer.getPlayerState();

        const playing =
            state === YT.PlayerState.PLAYING;

        videoFrame.classList.toggle(
            "is-playing",
            playing
        );

        /* Play button */

        videoPlay.textContent =
            playing ? "❚❚" : "▶";

        /* Mute button */

        if (ytPlayer.isMuted()) {

            videoMute.textContent = "🔇";

        } else {

            videoMute.textContent = "🔊";

        }

        /* Big play button */

        if (videoBigPlay) {

            videoBigPlay.classList.toggle(
                "hidden",
                playing
            );

        }

    } catch (error) {

        console.warn(
            "Video UI update error:",
            error
        );

    }
}


/* =========================================================
   YOUTUBE PLAYER INITIALIZATION
   ========================================================= */

function initYouTubePlayer() {

    if (!customVideo) {
        console.warn(
            "Custom video container not found."
        );
        return;
    }

    if (
        !window.YT ||
        !window.YT.Player
    ) {
        console.log(
            "YouTube API not ready yet."
        );
        return;
    }

    if (ytPlayer) {
        return;
    }

    const youtubeUrl =
        customVideo.dataset.youtubeUrl;

    console.log(
        "YouTube URL:",
        youtubeUrl
    );

    const videoId =
        getYouTubeId(youtubeUrl);

    console.log(
        "YouTube Video ID:",
        videoId
    );

    if (!videoId) {

        if (videoLoading) {

            videoLoading.classList.remove(
                "hidden"
            );

            videoLoading.innerHTML =
                "<span>Please add a valid YouTube URL.</span>";

        }

        return;
    }


    /* Create player */

    ytPlayer = new YT.Player(
        "youtubePlayer",
        {

            videoId: videoId,

            playerVars: {

                // Hide YouTube controls
                controls: 0,

                // Avoid related videos where possible
                rel: 0,

                // Minimal branding
                modestbranding: 1,

                // Mobile inline playback
                playsinline: 1,

                // Hide annotations
                iv_load_policy: 3,

                // Disable keyboard controls
                disablekb: 1,

                // Disable YouTube fullscreen button
                fs: 0

            },

            events: {

                /* -----------------------------------------
                   PLAYER READY
                   ----------------------------------------- */

                onReady: function () {

                    console.log(
                        "YouTube player ready."
                    );

                    videoReady = true;

                    if (videoLoading) {

                        videoLoading.classList.add(
                            "hidden"
                        );

                    }

                    updateVideoUI();

                    showVideoControls();

                },


                /* -----------------------------------------
                   STATE CHANGE
                   ----------------------------------------- */

                onStateChange: function () {

                    updateVideoUI();

                    showVideoControls();

                    const state =
                        ytPlayer.getPlayerState();

                    if (
                        state ===
                        YT.PlayerState.ENDED
                    ) {

                        videoFrame.classList.remove(
                            "is-playing"
                        );

                        videoPlay.textContent = "↻";

                        if (videoBigPlay) {

                            videoBigPlay.classList.remove(
                                "hidden"
                            );

                        }

                    }

                },


                /* -----------------------------------------
                   ERROR
                   ----------------------------------------- */

                onError: function (event) {

                    console.error(
                        "YouTube Player Error:",
                        event.data
                    );

                    if (!videoLoading) return;

                    videoLoading.classList.remove(
                        "hidden"
                    );

                    let message =
                        "This YouTube video cannot be played.";

                    switch (event.data) {

                        case 2:
                            message =
                                "Invalid YouTube video ID.";
                            break;

                        case 5:
                            message =
                                "The video cannot be played in the HTML5 player.";
                            break;

                        case 100:
                            message =
                                "This video was not found or is private.";
                            break;

                        case 101:
                        case 150:
                            message =
                                "Embedding is disabled for this YouTube video.";
                            break;

                    }

                    videoLoading.innerHTML =
                        `<span>${message}</span>`;

                }

            }

        }
    );
}


/* =========================================================
   YOUTUBE API CALLBACK
   ========================================================= */

window.onYouTubeIframeAPIReady = function () {

    console.log(
        "YouTube API loaded."
    );

    initYouTubePlayer();

};


/* =========================================================
   PLAY / PAUSE
   ========================================================= */

videoPlay?.addEventListener(
    "click",
    function () {

        if (
            !ytPlayer ||
            !videoReady
        ) {
            return;
        }

        const state =
            ytPlayer.getPlayerState();

        if (
            state ===
            YT.PlayerState.PLAYING
        ) {

            ytPlayer.pauseVideo();

        } else {

            ytPlayer.playVideo();

        }

        showVideoControls();

    }
);


/* =========================================================
   BIG PLAY BUTTON
   ========================================================= */

videoBigPlay?.addEventListener(
    "click",
    function () {

        if (
            !ytPlayer ||
            !videoReady
        ) {
            return;
        }

        ytPlayer.playVideo();

        showVideoControls();

    }
);


/* =========================================================
   MUTE / UNMUTE
   ========================================================= */

videoMute?.addEventListener(
    "click",
    function () {

        if (
            !ytPlayer ||
            !videoReady
        ) {
            return;
        }

        if (ytPlayer.isMuted()) {

            ytPlayer.unMute();

        } else {

            ytPlayer.mute();

        }

        updateVideoUI();

        showVideoControls();

    }
);


/* =========================================================
   SEEK BAR
   ========================================================= */

videoSeek?.addEventListener(
    "input",
    function () {

        if (
            !ytPlayer ||
            !videoReady
        ) {
            return;
        }

        const duration =
            ytPlayer.getDuration();

        if (!duration) {
            return;
        }

        const percentage =
            Number(videoSeek.value) / 100;

        ytPlayer.seekTo(
            percentage * duration,
            true
        );

        updateVideoUI();

        showVideoControls();

    }
);


/* =========================================================
   MOUSE / TOUCH CONTROL VISIBILITY
   ========================================================= */

videoFrame?.addEventListener(
    "mousemove",
    showVideoControls
);

videoFrame?.addEventListener(
    "touchstart",
    showVideoControls,
    {
        passive: true
    }
);


/* =========================================================
   CLICK VIDEO AREA
   ========================================================= */

videoFrame?.addEventListener(
    "click",
    function (event) {

        if (
            event.target.closest(
                ".video-controls"
            ) ||
            event.target.closest(
                ".video-big-play"
            )
        ) {
            return;
        }

        showVideoControls();

    }
);


/* =========================================================
   FULLSCREEN
   ========================================================= */

videoFullscreen?.addEventListener(
    "click",
    async function () {

        if (!videoFrame) {
            return;
        }

        try {

            if (!document.fullscreenElement) {

                await videoFrame.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.error(
                "Fullscreen error:",
                error
            );

        }

    }
);


/* =========================================================
   UPDATE VIDEO PROGRESS
   ========================================================= */

videoTimer = setInterval(
    updateVideoUI,
    500
);


/* =========================================================
   FALLBACK
   If API was already loaded before this script
   ========================================================= */

if (
    window.YT &&
    window.YT.Player
) {

    console.log(
        "YouTube API already available."
    );

    initYouTubePlayer();

}



/* =========================================================
   DEFAULT ODIA — ONLY EVENT STORY PARAGRAPH
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const eventStoryParagraph =
        document.getElementById("eventStoryParagraph");

    if (eventStoryParagraph) {

        // Show ONLY this paragraph in Odia initially
        eventStoryParagraph.innerHTML =
            eventStoryParagraph.dataset.or
                .replace(/\n\n/g, "<br><br>");

    }

});