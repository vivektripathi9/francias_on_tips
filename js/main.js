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
