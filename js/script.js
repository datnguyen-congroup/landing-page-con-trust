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
  const button = form.querySelector('button[type="submit"]');

  var MESSAGES = {
    vi: {
      sending: "Đang gửi...",
      ok: "Cảm ơn bạn! ConTrust đã nhận được thông tin và sẽ liên hệ sớm.",
      err: "Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ trực tiếp qua điện thoại/email.",
      notConfigured:
        "Form liên hệ chưa được kích hoạt. Vui lòng liên hệ trực tiếp qua điện thoại hoặc email bên dưới.",
      required: "Vui lòng điền trường này",
      invalidPhone: "Số điện thoại không hợp lệ",
      invalidEmail: "Email không hợp lệ",
    },
    en: {
      sending: "Sending...",
      ok: "Thank you! ConTrust has received your details and will reach out soon.",
      err: "Something went wrong, please try again or contact us directly by phone/email.",
      notConfigured:
        "The contact form isn't active yet. Please reach out directly by phone or email below.",
      required: "This field is required",
      invalidPhone: "Invalid phone number",
      invalidEmail: "Invalid email address",
    },
  };

  function currentLang() {
    return body.getAttribute("data-lang") === "en" ? "en" : "vi";
  }

  const PHONE_RE = /^\d{9,}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function getErrorEl(input, create) {
    const row = input.closest(".form-row") || input.parentElement;
    let el = row.querySelector('.field-error[data-for="' + input.name + '"]');
    if (!el && create) {
      el = document.createElement("span");
      el.className = "field-error";
      el.setAttribute("data-for", input.name);
      el.setAttribute("role", "alert");
      input.insertAdjacentElement("afterend", el);
    }
    return el;
  }

  function showError(input, message) {
    const el = getErrorEl(input, true);
    el.textContent = message;
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(input) {
    const el = getErrorEl(input, false);
    if (el) el.textContent = "";
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
  }

  function validateForm(form, msgs) {
    const fields = [
      { name: "full_name", required: true },
      { name: "company_name", required: true },
      {
        name: "phone_number",
        required: true,
        re: PHONE_RE,
        err: msgs.invalidPhone,
      },
      { name: "email", required: true, re: EMAIL_RE, err: msgs.invalidEmail },
    ];

    let firstInvalid = null;

    fields.forEach((f) => {
      const input = form.elements[f.name];
      const value = input.value.trim();
      clearError(input);

      if (f.required && !value) {
        showError(input, msgs.required);
        firstInvalid = firstInvalid || input;
        return;
      }

      const formatValue = f.sanitize ? f.sanitize(value) : value;
      if (value && f.re && !f.re.test(formatValue)) {
        showError(input, f.err);
        firstInvalid = firstInvalid || input;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  const ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxc75yxhjdaDHsSSM7sj8E2a5THTA4LDy6-O8LUXU12VEv-ytYwUkrboLl_QnUmVzhjgw/exec";
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var lang = currentLang();
      var msgs = MESSAGES[lang];

      // Validate trước, chưa disable button
      if (!validateForm(form, msgs)) {
        status.textContent = "";
        status.className = "form-status";
        return;
      }

      button.disabled = true;

      // Honeypot spam check
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      const dataForm = Object.fromEntries(new FormData(form));

      try {
        status.textContent = msgs.sending;
        status.className = "form-status";

        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(dataForm),
        });
        await res.json();

        status.textContent = msgs.ok;
      } catch (error) {
        status.textContent = msgs.err;
        status.className = "form-status err";
      } finally {
        button.disabled = false;
      }
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
