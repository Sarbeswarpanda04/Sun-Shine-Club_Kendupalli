/*==================================================
            HERO SECTION JAVASCRIPT
==================================================*/

document.addEventListener("DOMContentLoaded", () => {
  /*====================================
        ELEMENTS
    ====================================*/

  const hero = document.querySelector(".hero");

  if (!hero) return;

  const desktopSlider = document.querySelector(".desktop-slider");
  const mobileSlider = document.querySelector(".mobile-slider");
  const counters = document.querySelectorAll(".counter");
  const scrollBtn = document.querySelector(".scroll-down");

  let currentSlide = 0;
  let autoPlay = null;

  /*====================================
        ACTIVE SLIDER
    ====================================*/

  function getActiveSlider() {
    return window.innerWidth <= 768 ? mobileSlider : desktopSlider;
  }

  let slider = getActiveSlider();
  let slides = slider.querySelectorAll(".bg-slide");

  /*====================================
        DYNAMIC DOTS
    ====================================*/

  const dotsContainer = document.querySelector(".slider-dots");

  function createDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";

    slides.forEach((_, index) => {
      const dot = document.createElement("span");

      dot.className = "dot";

      if (index === currentSlide) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        currentSlide = index;

        showSlide(currentSlide);

        restartSlider();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function getDots() {
    return document.querySelectorAll(".slider-dots .dot");
  }

  /*====================================
        SHOW SLIDE
    ====================================*/

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));

    const dots = getDots();

    dots.forEach((dot) => dot.classList.remove("active"));

    if (slides[index]) {
      slides[index].classList.add("active");
    }

    if (dots[index]) {
      dots[index].classList.add("active");
    }
  }

  /*====================================
        PRELOAD NEXT IMAGE
    ====================================*/

  function preloadNextImage() {
    const next = (currentSlide + 1) % slides.length;

    const img = new Image();

    img.src = slides[next].src;
  }

  /*====================================
        NEXT / PREVIOUS
    ====================================*/

  function nextSlide() {
    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    showSlide(currentSlide);

    preloadNextImage();
  }

  function previousSlide() {
    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
  }

  /*====================================
        AUTOPLAY
    ====================================*/

  function startSlider() {
    stopSlider();

    autoPlay = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    if (autoPlay) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
  }

  function restartSlider() {
    stopSlider();
    startSlider();
  }

  /*====================================
        UPDATE ON RESIZE
    ====================================*/

  function updateSlider() {
    slider = getActiveSlider();

    slides = slider.querySelectorAll(".bg-slide");

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    createDots();

    showSlide(currentSlide);
  }

  window.addEventListener("resize", updateSlider);

  updateSlider();

  startSlider();

  /*====================================
        PAUSE ON HOVER
    ====================================*/

  hero.addEventListener("mouseenter", stopSlider);

  hero.addEventListener("mouseleave", startSlider);

  /*====================================
        MOUSE PARALLAX
    ====================================*/

  hero.addEventListener("mousemove", (event) => {
    const activeSlider = getActiveSlider();

    const x = (event.clientX / window.innerWidth - 0.5) * 20;

    const y = (event.clientY / window.innerHeight - 0.5) * 20;

    activeSlider.style.transform =
      `translate(${x}px, ${y}px) scale(1.08)`;
  });

  hero.addEventListener("mouseleave", () => {
    getActiveSlider().style.transform =
      "translate(0,0) scale(1.08)";
  });

  /*====================================
        COUNTER ANIMATION
    ====================================*/
  //   function animateCounter(counter) {
  //   const target = parseInt(counter.dataset.target, 10);
  //   let current = 0;

  //   const duration = 2000;
  //   const increment = target / (duration / 16);

  //   function update() {
  //     current += increment;

  //     if (current < target) {
  //       counter.textContent = Math.ceil(current);
  //       requestAnimationFrame(update);
  //     } else {
  //       counter.textContent = target + "+";
  //     }
  //   }

  //   update();
  // }

  /*====================================
        INTERSECTION OBSERVER
    ====================================*/

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.6,
    }
  );

  counters.forEach((counter) => observer.observe(counter));

  /*====================================
        SMOOTH SCROLL
    ====================================*/

  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();

      document.querySelector("#about")?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  /*====================================
        HERO CONTENT ANIMATION
    ====================================*/

  document.querySelectorAll(".hero-content > *").forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
  });

  /*====================================
        KEYBOARD SUPPORT
    ====================================*/

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
      restartSlider();
    }

    if (e.key === "ArrowLeft") {
      previousSlide();
      restartSlider();
    }
  });

  /*====================================
        TOUCH SWIPE SUPPORT
    ====================================*/

  let startX = 0;

  hero.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  });

  hero.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].screenX;

    if (startX - endX > 50) {
      nextSlide();
      restartSlider();
    }

    if (endX - startX > 50) {
      previousSlide();
      restartSlider();
    }
  });

  /*====================================
        PAGE VISIBILITY
    ====================================*/

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlider();
    } else {
      startSlider();
    }
  });

  /*====================================
        PRELOAD REMAINING IMAGES
    ====================================*/

  setTimeout(() => {
    slides.forEach((slide, index) => {
      if (index === 0) return;

      const img = new Image();
      img.src = slide.src;
    });
  }, 2000);

  /*====================================
        INITIALIZE
    ====================================*/

  showSlide(currentSlide);
});