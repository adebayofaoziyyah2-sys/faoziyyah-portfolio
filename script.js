/* ============================================================
   Adebayo Faoziyyah Portfolio — script.js
   ------------------------------------------------------------
   Small interactions only (no libraries, no build step):
     1. Mobile menu open/close
     2. Sticky navbar shadow
     3. Scroll-reveal animations
     4. Active nav-link highlighting
     5. Hero rotating word (typing effect)
     6. "Fields I want to explore" demo (localStorage)
     7. Contact form -> opens visitor's email app
     8. Footer year
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");

  menuBtn.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the menu when any link is tapped (mobile UX)
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 2. Navbar shadow on scroll ---------- */
  var navbar = document.getElementById("navbar");
  function onScrollShadow() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScrollShadow, { passive: true });
  onScrollShadow();

  /* ---------- 3. Reveal-on-scroll animations ---------- */
  // Elements with .reveal fade up when they enter the viewport.
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Old browser fallback: show everything immediately
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 4. Highlight the current section in the nav ---------- */
  var sectionIds = ["about", "skills", "projects", "learning", "interests", "education", "contact"];
  var navMap = {};
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href && href.charAt(0) === "#") navMap[href.slice(1)] = link;
  });

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            Object.keys(navMap).forEach(function (id) {
              navMap[id].classList.remove("active");
            });
            var active = navMap[entry.target.id];
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---------- 5. Hero rotating word ---------- */
  // Cycles through interests with a simple type/delete effect.
  var words = [
    "data analysis",
    "technology for good",
    "confident communication",
    "new technology"
  ];
  var typedEl = document.getElementById("typedText");
  var wordIndex = 0;
  var charIndex = words[0].length;
  var deleting = true;
  var pauseTicks = 0; // counts ticks to wait on full / empty word

  // Skip the animation for users who prefer reduced motion
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typedEl && !reduceMotion) {
    setInterval(function () {
      // Pause briefly when a word is fully typed or fully deleted
      if (pauseTicks > 0) {
        pauseTicks--;
        return;
      }
      var current = words[wordIndex];
      if (deleting) {
        charIndex--;
        typedEl.textContent = current.slice(0, Math.max(charIndex, 0));
        if (charIndex <= 0) {
          // Move to next word and start typing it
          wordIndex = (wordIndex + 1) % words.length;
          deleting = false;
          pauseTicks = 4; // short pause before typing
        }
      } else {
        var next = words[wordIndex];
        charIndex++;
        typedEl.textContent = next.slice(0, Math.min(charIndex, next.length));
        if (charIndex >= next.length) {
          // Word complete: pause, then start deleting
          deleting = true;
          pauseTicks = 12; // ~1 second pause on full word
        }
      }
    }, 90);
  }

  /* ---------- 6. "Explore" list demo (browser-only storage) ---------- */
  var exploreForm = document.getElementById("exploreForm");
  var exploreInput = document.getElementById("exploreInput");
  var exploreList = document.getElementById("exploreList");
  var STORAGE_KEY = "faoziyyah-explore-items";

  function addExploreItem(text) {
    var li = document.createElement("li");
    li.textContent = text;
    exploreList.appendChild(li);
  }

  // Load previously added items (this browser only)
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    saved.forEach(addExploreItem);
  } catch (e) { /* storage unavailable — ignore */ }

  exploreForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = exploreInput.value.trim();
    if (!value) return;
    addExploreItem(value);
    exploreInput.value = "";
    exploreInput.focus();
    try {
      var current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      current.push(value);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) { /* storage unavailable — ignore */ }
  });

  /* ---------- 7. Contact form (no backend needed) ---------- */
  // Builds a "mailto:" link so the visitor's own email app sends the message.
  var contactForm = document.getElementById("contactForm");
  var formError = document.getElementById("formError");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("cfName").value.trim();
    var email = document.getElementById("cfEmail").value.trim();
    var message = document.getElementById("cfMsg").value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !message) {
      formError.hidden = false;
      return;
    }
    formError.hidden = true;

    // Email provided by Adebayo — contact form sends to this address.
    var myEmail = "adebayofaoziyyah2@gmail.com";
    var subject = encodeURIComponent("Portfolio message from " + name);
    var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
    window.location.href = "mailto:" + myEmail + "?subject=" + subject + "&body=" + body;
  });

  /* ---------- 8. Footer year (only if the year element exists) ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
