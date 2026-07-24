/*==================================================
                CONTACT PAGE JS
==================================================*/

document.addEventListener("DOMContentLoaded", () => {
  /*========================================
                ELEMENTS
    ========================================*/

  const form = document.querySelector(".contact-form form");

  const nameInput = form.querySelector('input[type="text"]');

  const emailInput = form.querySelector('input[type="email"]');

  const subjectInput = form.querySelectorAll('input[type="text"]')[1];

  const messageInput = form.querySelector("textarea");

  const submitBtn = form.querySelector("button");

  /*========================================
            CHARACTER COUNTER
    ========================================*/

  const counter = document.createElement("small");

  counter.className = "message-counter";

  counter.innerHTML = "0 / 500";

  messageInput.parentNode.insertBefore(counter, messageInput.nextSibling);

  messageInput.setAttribute("maxlength", "500");

  messageInput.addEventListener("input", () => {
    counter.innerHTML = `${messageInput.value.length} / 500`;
  });

  /*========================================
            EMAIL VALIDATION
    ========================================*/

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /*========================================
            FORM SUBMIT
    ========================================*/

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (nameInput.value.trim() === "") {
      alert("Please enter your name.");

      nameInput.focus();

      return;
    }

    if (!validEmail(emailInput.value.trim())) {
      alert("Please enter a valid email address.");

      emailInput.focus();

      return;
    }

    if (messageInput.value.trim().length < 10) {
      alert("Message should contain at least 10 characters.");

      messageInput.focus();

      return;
    }

    submitBtn.disabled = true;

    submitBtn.innerHTML = "Sending...";

    setTimeout(() => {
      alert("✅ Thank you! Your message has been sent successfully.");

      form.reset();

      counter.innerHTML = "0 / 500";

      submitBtn.disabled = false;

      submitBtn.innerHTML = "Send Message";
    }, 1500);
  });

  /*========================================
            SCROLL REVEAL
    ========================================*/

  const revealItems = document.querySelectorAll(
    ".contact-info, .contact-form, .map-section, .social-section",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";

          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  revealItems.forEach((item) => {
    item.style.opacity = "0";

    item.style.transform = "translateY(40px)";

    item.style.transition = ".8s ease";

    observer.observe(item);
  });

  /*========================================
            CARD HOVER EFFECT
    ========================================*/

  const cards = document.querySelectorAll(".info-box");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateX(8px)";

      card.style.transition = ".3s";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateX(0)";
    });
  });

  /*========================================
            SOCIAL ICON ANIMATION
    ========================================*/

  const socials = document.querySelectorAll(".social-links a");

  socials.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      icon.style.transform = "translateY(-8px) rotate(8deg)";
    });

    icon.addEventListener("mouseleave", () => {
      icon.style.transform = "translateY(0) rotate(0deg)";
    });
  });

  /*========================================
            SMOOTH SCROLL
    ========================================*/

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        e.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});
