/*==================================================
            HERO SECTION JAVASCRIPT
==================================================*/

document.addEventListener("DOMContentLoaded", () => {
  /*====================================
        ELEMENTS
    ====================================*/

  const hero = document.querySelector(".hero");

  const slider = document.querySelector(".hero-slider");

  const slides = document.querySelectorAll(".bg-slide");

  const dots = document.querySelectorAll(".dot");

  const counters = document.querySelectorAll(".counter");

  const scrollBtn = document.querySelector(".scroll-down");

  /*====================================
        IMAGE SLIDER
    ====================================*/

  let currentSlide = 0;

  let autoPlay;

  function showSlide(index) {
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    slides[index].classList.add("active");

    dots[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide++;

    if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    showSlide(currentSlide);
  }

  function previousSlide() {
    currentSlide--;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
  }

  function startSlider() {
    autoPlay = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(autoPlay);
  }

  showSlide(currentSlide);

  startSlider();

  /*====================================
        DOT NAVIGATION
    ====================================*/

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;

      showSlide(currentSlide);

      stopSlider();

      startSlider();
    });
  });

  /*====================================
        PAUSE ON HOVER
    ====================================*/

  hero.addEventListener("mouseenter", () => {
    stopSlider();
  });

  hero.addEventListener("mouseleave", () => {
    startSlider();
  });

  /*====================================
        MOUSE PARALLAX
    ====================================*/

  hero.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 30;

    const y = (event.clientY / window.innerHeight - 0.5) * 30;

    slider.style.transform = `translate(${x}px,${y}px) scale(1.08)`;
  });

  hero.addEventListener("mouseleave", () => {
    slider.style.transform = "translate(0px,0px) scale(1.08)";
  });

  /*====================================
        COUNTER ANIMATION
    ====================================*/

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);

    const duration = 2000;

    const stepTime = 16;

    const increment = target / (duration / stepTime);

    let current = 0;

    function update() {
      current += increment;

      if (current < target) {
        counter.innerText = Math.ceil(current);

        requestAnimationFrame(update);
      } else {
        counter.innerText = target + "+";
      }
    }

    update();
  }

  /*====================================
        OBSERVER
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
    },
  );

  counters.forEach((counter) => {
    observer.observe(counter);
  });

  /*====================================
        SMOOTH SCROLL
    ====================================*/

  if (scrollBtn) {
    scrollBtn.addEventListener("click", (event) => {
      event.preventDefault();

      const target = document.querySelector("#about");

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  }

  /*====================================
        HERO CONTENT ANIMATION
    ====================================*/

  const heroItems = document.querySelectorAll(".hero-content>*");

  heroItems.forEach((item, index) => {
    item.style.animationDelay = `${0.25 * index}s`;
  });

  /*====================================
        KEYBOARD SUPPORT
    ====================================*/

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextSlide();

      stopSlider();

      startSlider();
    }

    if (event.key === "ArrowLeft") {
      previousSlide();

      stopSlider();

      startSlider();
    }
  });

  /*====================================
        TOUCH SWIPE SUPPORT
    ====================================*/

  let startX = 0;

  let endX = 0;

  hero.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].screenX;
  });

  hero.addEventListener("touchend", (event) => {
    endX = event.changedTouches[0].screenX;

    if (startX - endX > 50) {
      nextSlide();

      stopSlider();

      startSlider();
    }

    if (endX - startX > 50) {
      previousSlide();

      stopSlider();

      startSlider();
    }
  });

  /*====================================
        PRELOAD IMAGES
    ====================================*/

  slides.forEach((slide) => {
    const img = new Image();

    img.src = slide.src;
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
});



document.querySelectorAll(".hero-slider").forEach((slider) => {
  const slides = slider.querySelectorAll(".bg-slide");

  let current = 0;

  setInterval(() => {
    slides[current].classList.remove("active");

    current = (current + 1) % slides.length;

    slides[current].classList.add("active");
  }, 5000);
});
