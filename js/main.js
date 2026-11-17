// =========================================================
// Skyla Tech — Site interactions
// =========================================================

(function () {
  "use strict";

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.getElementById("navMenuToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    /* Close menu when a link is clicked */
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Navbar shadow on scroll ---------- */
  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* ---------- Testimonial tabs ---------- */
  var tabs = document.querySelectorAll(".testimonials_tab-link");
  var panels = document.querySelectorAll(".tab-pane");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var idx = tab.dataset.tab;
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.dataset.panel === idx);
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(
    "section > .container-large > *, header > .container-large > *"
  );
  revealEls.forEach(function (el, i) {
    el.classList.add("reveal");
    /* gentle stagger for grouped siblings */
    el.style.transitionDelay = Math.min((i % 4) * 70, 280) + "ms";
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    /* fallback: show everything */
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var required = form.querySelectorAll("input[required]");
      required.forEach(function (field) {
        var ok = field.value.trim() !== "" &&
          (!field.type || field.type !== "email" || /\S+@\S+\.\S+/.test(field.value));
        field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        status.textContent = "Please fill in all required fields with valid values.";
        status.className = "form-status error";
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      status.textContent = "";

      /* Front-end demo: no backend connected. */
      setTimeout(function () {
        status.textContent = "Thank you! Your submission has been received.";
        status.className = "form-status success";
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = "send your message"; }
      }, 1500);
    });
  }
})();
