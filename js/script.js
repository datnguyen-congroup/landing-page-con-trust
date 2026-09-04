(function () {
  "use strict";

  var body = document.body;
  var STORAGE_KEY = "contrust_lang";
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- language toggle ---------- */
  function setLang(lang) {
    body.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function initLang() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    if (saved === "vi" || saved === "en") setLang(saved);
  }

  var langSwitch = document.getElementById("langSwitch");
  if (langSwitch) {
    langSwitch.addEventListener("click", function () {
      var current = body.getAttribute("data-lang") === "en" ? "vi" : "en";
      setLang(current);
    });
  }
  initLang();

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- footer year ---------- */
  var year = new Date().getFullYear();
  ["year", "year2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = year;
  });

  /* ---------- contact form (Formspree AJAX) ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  var MESSAGES = {
    vi: {
      sending: "Đang gửi...",
      ok: "Cảm ơn bạn! ConTrust đã nhận được thông tin và sẽ liên hệ sớm.",
      err: "Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ trực tiếp qua điện thoại/email.",
      notConfigured:
        "Form liên hệ chưa được kích hoạt. Vui lòng liên hệ trực tiếp qua điện thoại hoặc email bên dưới.",
    },
    en: {
      sending: "Sending...",
      ok: "Thank you! ConTrust has received your details and will reach out soon.",
      err: "Something went wrong, please try again or contact us directly by phone/email.",
      notConfigured:
        "The contact form isn't active yet. Please reach out directly by phone or email below.",
    },
  };

  function currentLang() {
    return body.getAttribute("data-lang") === "en" ? "en" : "vi";
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lang = currentLang();
      var msgs = MESSAGES[lang];

      // Honeypot spam check
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1) {
        status.textContent = msgs.notConfigured;
        status.className = "form-status err";
        return;
      }

      status.textContent = msgs.sending;
      status.className = "form-status";

      var data = new FormData(form);
      fetch(action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = msgs.ok;
            status.className = "form-status ok";
            form.reset();
          } else {
            status.textContent = msgs.err;
            status.className = "form-status err";
          }
        })
        .catch(function () {
          status.textContent = msgs.err;
          status.className = "form-status err";
        });
    });
  }

  /* ---------- scroll reveal ---------- */
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("has-reveal");

    var revealEls = document.querySelectorAll(".reveal");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- hero stat counters ---------- */
  if (!prefersReducedMotion) {
    var statEls = document.querySelectorAll(".stat-num[data-count-to]");
    statEls.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
      var suffix = el.getAttribute("data-count-suffix") || "";
      var duration = 1100;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      window.requestAnimationFrame(step);
    });
  }
})();
