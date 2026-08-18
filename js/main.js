(function () {
  var viewport = document.querySelector(".stories-viewport");
  var track = document.querySelector(".stories-track");
  var prev = document.querySelector(".stories-prev");
  var next = document.querySelector(".stories-next");
  if (!viewport || !track || !prev || !next) return;

  var cards = track.querySelectorAll(".story-card");
  var index = 0;

  function visibleCount() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1023) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  function goTo(nextIndex) {
    index = Math.min(maxIndex(), Math.max(0, nextIndex));
    var card = cards[0];
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    var step = card.getBoundingClientRect().width + gap;
    track.style.transform = "translateX(" + -(index * step) + "px)";
  }

  prev.addEventListener("click", function () {
    goTo(index <= 0 ? maxIndex() : index - 1);
  });

  next.addEventListener("click", function () {
    goTo(index >= maxIndex() ? 0 : index + 1);
  });

  window.addEventListener("resize", function () {
    goTo(index);
  });
})();

(function () {
  var el = document.getElementById("chat-type");
  if (!el) return;

  var message = "Bonjour, apprenons le français !";
  var i = 0;
  var typing = true;

  function tick() {
    if (typing) {
      i += 1;
      el.textContent = message.slice(0, i);
      if (i >= message.length) {
        typing = false;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 70);
      return;
    }

    i -= 1;
    el.textContent = message.slice(0, i);
    if (i <= 0) {
      typing = true;
      setTimeout(tick, 500);
      return;
    }
    setTimeout(tick, 28);
  }

  setTimeout(tick, 600);
})();

(function () {
  var el = document.getElementById("why-type");
  if (!el) return;

  var message = "WHY LEARN FRENCH?";
  var i = 0;
  var typing = true;

  function tick() {
    if (typing) {
      i += 1;
      el.textContent = message.slice(0, i);
      if (i >= message.length) {
        typing = false;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 80);
      return;
    }

    i -= 1;
    el.textContent = message.slice(0, i);
    if (i <= 0) {
      typing = true;
      setTimeout(tick, 500);
      return;
    }
    setTimeout(tick, 36);
  }

  setTimeout(tick, 400);
})();

(function () {
  var el = document.getElementById("cta-type");
  if (!el) return;

  var message = "Not Sure Which Program Is Right For You?";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = message;
    return;
  }

  var i = 0;
  var typing = true;
  var started = false;

  function tick() {
    if (typing) {
      i += 1;
      el.textContent = message.slice(0, i);
      if (i >= message.length) {
        typing = false;
        setTimeout(tick, 2400);
        return;
      }
      setTimeout(tick, 68);
      return;
    }

    i -= 1;
    el.textContent = message.slice(0, i);
    if (i <= 0) {
      typing = true;
      setTimeout(tick, 500);
      return;
    }
    setTimeout(tick, 32);
  }

  var section = el.closest(".explore-cta") || el;
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      observer.disconnect();
      setTimeout(tick, 280);
    }, { threshold: 0.35 });
    observer.observe(section);
  } else {
    setTimeout(tick, 400);
  }
})();

(function () {
  var input = document.getElementById("translate-from");
  var output = document.getElementById("translate-to");
  var statusEl = document.getElementById("translate-status");
  var copyBtn = document.getElementById("translate-copy");
  var countEl = document.getElementById("translate-count");
  var chips = document.getElementById("translate-chips");
  if (!input || !output) return;

  var MAX = 1000;
  var timer = null;
  var reqId = 0;
  var lastSource = "";

  var glossary = [
    { re: /\bTEF Canada\b/gi, token: "TEFCANADAX", fr: "TEF Canada" },
    { re: /\bCanadian PR\b/gi, token: "CANADIANPRX", fr: "la résidence permanente canadienne" },
    { re: /\bCanada PR\b/gi, token: "CANADAPRX", fr: "la résidence permanente au Canada" },
    { re: /\bpermanent residency\b/gi, token: "PERMRESX", fr: "résidence permanente" },
    { re: /\bFrançais on tips\b/gi, token: "FRANCAISONTIPSX", fr: "Français on tips" }
  ];

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "translator-status" + (kind ? " is-" + kind : "");
  }

  function updateCount() {
    if (countEl) countEl.textContent = input.value.length + " / " + MAX;
  }

  function protect(text) {
    glossary.forEach(function (item) {
      text = text.replace(item.re, item.token);
    });
    return text;
  }

  function restore(text) {
    glossary.forEach(function (item) {
      text = text.replace(new RegExp(item.token, "gi"), item.fr);
    });
    return text;
  }

  function parseGoogle(data) {
    if (!data || !data[0]) return "";
    return data[0].map(function (row) {
      return row[0] || "";
    }).join("");
  }

  function translateGoogle(text) {
    var url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=" +
      encodeURIComponent(text);
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("google");
      return res.json();
    }).then(function (data) {
      var translated = parseGoogle(data).trim();
      if (!translated) throw new Error("empty");
      return translated;
    });
  }

  function translateMemory(text) {
    var url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text.slice(0, 480)) +
      "&langpair=en|fr";
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("memory");
      return res.json();
    }).then(function (data) {
      var translated = data && data.responseData && data.responseData.translatedText;
      if (!translated) {
        var matches = data && data.matches;
        if (matches && matches.length) {
          for (var i = 0; i < matches.length; i += 1) {
            if (matches[i].translation) {
              translated = matches[i].translation;
              break;
            }
          }
        }
      }
      if (!translated) throw new Error("empty");
      return String(translated).trim();
    });
  }

  function translate(text) {
    var guarded = protect(text);
    return translateGoogle(guarded).catch(function () {
      return translateMemory(guarded);
    }).then(restore);
  }

  function showResult(french) {
    output.textContent = french;
    output.setAttribute("data-empty", french ? "false" : "true");
  }

  function run() {
    var text = input.value.replace(/^\s+|\s+$/g, "");
    updateCount();

    if (!text) {
      lastSource = "";
      showResult("");
      setStatus("");
      return;
    }

    if (text === lastSource) return;

    var id = (reqId += 1);
    setStatus("Translating…", "busy");

    translate(text).then(function (french) {
      if (id !== reqId) return;
      lastSource = text;
      showResult(french);
      setStatus("Translated", "ok");
    }).catch(function () {
      if (id !== reqId) return;
      setStatus("Could not translate. Please try again.", "err");
    });
  }

  input.addEventListener("input", function () {
    if (input.value.length > MAX) {
      input.value = input.value.slice(0, MAX);
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(run, 350);
  });

  if (chips) {
    chips.addEventListener("click", function (event) {
      var chip = event.target.closest(".translator-chip");
      if (!chip) return;
      input.value = chip.textContent;
      updateCount();
      window.clearTimeout(timer);
      run();
      input.focus();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var french = output.textContent;
      if (!french) return;
      function copied() {
        copyBtn.textContent = "Copied";
        copyBtn.classList.add("is-copied");
        window.setTimeout(function () {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("is-copied");
        }, 1400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(french).then(copied);
        return;
      }
      copied();
    });
  }

  updateCount();
})();

(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var via = event.submitter && event.submitter.value === "email" ? "email" : "whatsapp";
    var name = (form.name.value || "").trim();
    var email = (form.email.value || "").trim();
    var phone = (form.phone.value || "").trim();
    var program = (form.program.value || "").trim();
    var message = (form.message.value || "").trim();
    var lines = [
      "Hello, I would like to book a free demo class.",
      "Name: " + name,
      "Email: " + email
    ];
    if (phone) lines.push("Phone: " + phone);
    if (program) lines.push("Interest: " + program);
    if (message) lines.push("Message: " + message);
    var body = lines.join("\n");

    if (via === "email") {
      window.location.href =
        "mailto:Francaisontips@gmail.com?subject=" +
        encodeURIComponent("Free demo class — " + name) +
        "&body=" +
        encodeURIComponent(body);
      return;
    }

    window.open("https://wa.me/14162781058?text=" + encodeURIComponent(body), "_blank");
  });
})();
