/* Skyla Tech — interactions */
(function () {
  "use strict";

  /* ---------- Nav: scroll state + mobile menu ---------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Stagger reveal of grouped children */
  document.querySelectorAll(".cards .reveal, .hero__stats").forEach(function (group) {
    var items = group.classList.contains("reveal") ? null : group.querySelectorAll(".reveal");
    if (!items) return;
    items.forEach(function (el, i) { el.style.transitionDelay = i * 90 + "ms"; });
  });

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll(".stat__num[data-count]");
  var animateCount = function (el) {
    var target = parseInt(el.dataset.count, 10);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    var duration = 1600;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Testimonial tabs ---------- */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".t-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var idx = tab.dataset.tab;
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      panels.forEach(function (p) { p.classList.toggle("is-active", p.dataset.panel === idx); });
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    var required = form.querySelectorAll("input[required], textarea[required]");
    required.forEach(function (field) {
      var ok = field.value.trim() !== "" && (!field.type || field.type !== "email" || /\S+@\S+\.\S+/.test(field.value));
      field.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "Please fill in all required fields with valid values.";
      status.className = "form-status error";
      return;
    }

    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";
    status.textContent = "";

    /* Front-end demo: no backend is connected yet. Swap for a real
       fetch() to your form API / CRM endpoint here. */
    setTimeout(function () {
      status.textContent = "Thank you! Your submission has been received.";
      status.className = "form-status success";
      form.reset();
      btn.disabled = false;
      btn.textContent = "Send message";
    }, 900);
  });

  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () { field.classList.remove("invalid"); });
  });

  /* ---------- Hue-based gradient media (case/project cards) ---------- */
  document.querySelectorAll("[data-hue]").forEach(function (el) {
    el.style.setProperty("--hue", el.dataset.hue);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
