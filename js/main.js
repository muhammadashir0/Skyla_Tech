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

  /* ---------- Testimonial tabs (horizontal + vertical) ---------- */
  var tabs = document.querySelectorAll(".tab, .v-tab");
  var panels = document.querySelectorAll(".t-panel, .v-panel");
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
    var originalText = btn ? btn.textContent : "Send";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    status.textContent = "";

    /* Front-end demo: no backend is connected yet. Swap for a real
       fetch() to your form API / CRM endpoint here. */
    setTimeout(function () {
      status.textContent = "Thank you! Your submission has been received.";
      status.className = "form-status success";
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
    }, 900);
  });

  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () { field.classList.remove("invalid"); });
  });

  /* ---------- Career form ---------- */
  var careerForm = document.getElementById("careerForm");
  var careerStatus = document.getElementById("careerFormStatus");

  if (careerForm && careerStatus) {
    careerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var required = careerForm.querySelectorAll("input[required], textarea[required]");
      required.forEach(function (field) {
        var ok = field.value.trim() !== "" && (!field.type || field.type !== "email" || /\S+@\S+\.\S+/.test(field.value));
        field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        careerStatus.textContent = "Please fill in all required fields with valid values.";
        careerStatus.className = "form-status error";
        return;
      }

      var btn = careerForm.querySelector("button[type=submit]");
      var originalText = btn ? btn.textContent : "Send";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      careerStatus.textContent = "";

      setTimeout(function () {
        careerStatus.textContent = "Thank you! Your CV has been received.";
        careerStatus.className = "form-status success";
        careerForm.reset();
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
      }, 900);
    });

    careerForm.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () { field.classList.remove("invalid"); });
    });
  }

  /* ---------- Blog filter ---------- */
  var blogFilters = document.querySelectorAll(".blog-filter");
  var blogCards = document.querySelectorAll(".blog-card");

  blogFilters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      var f = filter.dataset.filter;
      blogFilters.forEach(function (b) { b.classList.remove("is-active"); });
      filter.classList.add("is-active");

      blogCards.forEach(function (card) {
        var cat = card.dataset.category;
        var show = f === "all" || cat === f;
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------- Theme toggle (dark/light) ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;

  /* Apply saved theme before paint to avoid flash */
  (function initTheme() {
    var saved = localStorage.getItem("skyla-theme");
    if (saved) {
      root.setAttribute("data-theme", saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.setAttribute("data-theme", "dark");
    }
  })();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";

      /* Black flash transition — exactly like dark teme.mp4:
         light → black flash (~1 frame) → dark, instant hard cut */
      var flash = document.createElement("div");
      flash.className = "theme-flash";
      document.body.appendChild(flash);

      // Force reflow to ensure the transition triggers
      void flash.offsetWidth;
      flash.classList.add("active");

      setTimeout(function () {
        if (next === "dark") {
          root.setAttribute("data-theme", "dark");
        } else {
          root.removeAttribute("data-theme");
        }
        localStorage.setItem("skyla-theme", next);
        themeToggle.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");

        // Hide flash after a tiny delay for the hard-cut effect
        setTimeout(function () {
          flash.classList.remove("active");
          setTimeout(function () {
            if (flash.parentNode) flash.parentNode.removeChild(flash);
          }, 60);
        }, 30);
      }, 35);
    });
    var savedTheme = localStorage.getItem("skyla-theme");
    if (savedTheme) {
      themeToggle.setAttribute("aria-label", savedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  /* ---------- Hue-based gradient media (case/project cards) ---------- */
  document.querySelectorAll("[data-hue]").forEach(function (el) {
    el.style.setProperty("--hue", el.dataset.hue);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
