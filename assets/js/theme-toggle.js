(function () {
  var root = document.documentElement;
  var toggle = null;
  var metaTheme = null;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("theme-dark");
      root.setAttribute("data-theme", "dark");
      if (metaTheme) metaTheme.setAttribute("content", "#14171A");
      if (toggle) toggle.setAttribute("aria-pressed", "true");
    } else {
      root.classList.remove("theme-dark");
      root.setAttribute("data-theme", "light");
      if (metaTheme) metaTheme.setAttribute("content", "#ffffff");
      if (toggle) toggle.setAttribute("aria-pressed", "false");
    }
  }

  function getPreferredTheme() {
    try {
      var stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  function init() {
    toggle = document.getElementById("theme-toggle");
    metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!toggle) return;

    // Set initial state to match applied theme
    var current = root.classList.contains("theme-dark") ? "dark" : "light";
    applyTheme(current);

    toggle.addEventListener("click", function () {
      var next = root.classList.contains("theme-dark") ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      applyTheme(next);
    });

    // React to system theme changes only if user hasn't explicitly chosen
    try {
      var stored = localStorage.getItem("theme");
      if (!stored && window.matchMedia) {
        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        mq.addEventListener("change", function (e) {
          applyTheme(e.matches ? "dark" : "light");
        });
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
