// hawtof-the-press v0.4 — tag filter enhancement + Portal modal shim
(function () {
  // Progressive-enhancement tag filter on list pages
  var feed = document.getElementById("feed");
  var filterBar = document.getElementById("tag-filter");
  if (feed && filterBar) {
    var items = Array.prototype.slice.call(feed.querySelectorAll("li"));
    var tags = new Set();
    items.forEach(function (li) {
      (li.getAttribute("data-tags") || "")
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean)
        .forEach(function (t) {
          tags.add(t);
        });
    });
    var frag = document.createDocumentFragment();
    function mk(t, label) {
      var a = document.createElement("a");
      a.href = t ? "/tag/" + encodeURIComponent(t) + "/" : "/";
      a.setAttribute("data-tag", t || "");
      a.textContent = label;
      return a;
    }
    frag.appendChild(mk("", "[all]"));
    Array.from(tags)
      .sort()
      .forEach(function (t) {
        frag.appendChild(mk(t, "#" + t));
      });
    filterBar.innerHTML = "";
    filterBar.appendChild(frag);

    function apply(tag) {
      items.forEach(function (li) {
        var liTags = (li.getAttribute("data-tags") || "")
          .split(",")
          .map(function (s) {
            return s.trim();
          });
        li.style.display = !tag || liTags.indexOf(tag) !== -1 ? "" : "none";
      });
      filterBar.querySelectorAll("a").forEach(function (a) {
        a.setAttribute(
          "aria-current",
          a.getAttribute("data-tag") === (tag || "") ? "true" : "false"
        );
      });
    }
    // read server URL if we're on tag page (works when JS hydrated on /tag/...)
    var currentTag = "";
    var path = (location.pathname || "").toLowerCase();
    var m = path.match(/\/tag\/([^\/]*)\//);
    if (m) {
      currentTag = decodeURIComponent(m[1]);
    }
    apply(currentTag);

    filterBar.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      // keep links crawlable, but if staying on the same page we can intercept
      var t = a.getAttribute("data-tag") || "";
      e.preventDefault();
      history.replaceState(
        null,
        "",
        t ? "/tag/" + encodeURIComponent(t) + "/" : "/"
      );
      apply(t);
    });
  }

  // (Custom subscribe modal removed in favor of Ghost Portal for signup/signin)
})();
