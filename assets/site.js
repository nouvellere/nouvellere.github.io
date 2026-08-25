(function () {
  "use strict";

  var topButton = document.querySelector(".back-to-top");
  var scrollThreshold = 80;

  if (topButton) {
    function updateTopButton() {
      topButton.hidden = window.scrollY <= scrollThreshold;
    }

    topButton.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", updateTopButton, { passive: true });
    window.addEventListener("resize", updateTopButton);
    updateTopButton();
  }

  var disclosureToggles = Array.prototype.slice.call(
    document.querySelectorAll("[data-disclosure-target]")
  );

  function setDisclosureOpen(toggle, panel, isOpen) {
    panel.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));

    if (
      isOpen &&
      window.MathJax &&
      typeof window.MathJax.typesetPromise === "function"
    ) {
      window.MathJax.typesetPromise([panel]).catch(function () {});
    }
  }

  disclosureToggles.forEach(function (toggle) {
    var panel = document.getElementById(toggle.dataset.disclosureTarget);

    if (!panel) {
      return;
    }

    toggle.addEventListener("click", function () {
      setDisclosureOpen(toggle, panel, panel.hidden);
    });
  });

  function openDisclosureFromHash() {
    var targetId;

    try {
      targetId = decodeURIComponent(window.location.hash.slice(1));
    } catch (error) {
      return;
    }

    if (!targetId) {
      return;
    }

    var target = document.getElementById(targetId);
    var toggle = null;

    if (target && target.hasAttribute("data-disclosure-target")) {
      toggle = target;
    } else if (target) {
      toggle = target.querySelector("[data-disclosure-target]");
    }

    if (!toggle) {
      toggle = disclosureToggles.find(function (candidate) {
        return candidate.dataset.disclosureTarget === targetId;
      });
    }

    if (!toggle) {
      return;
    }

    var panel = document.getElementById(toggle.dataset.disclosureTarget);
    if (panel) {
      setDisclosureOpen(toggle, panel, true);
    }
  }

  window.addEventListener("hashchange", openDisclosureFromHash);
  openDisclosureFromHash();
})();
