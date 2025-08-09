/* Enhance keyboard support for the mobile menu toggle */
(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var toggle = document.getElementById("menu-toggle");
    if (!toggle) return;

    var openButtons = Array.prototype.slice.call(
      document.querySelectorAll('label.menu-btn[for="menu-toggle"]')
    );
    var closeButtons = Array.prototype.slice.call(
      document.querySelectorAll('label.close-btn[for="menu-toggle"]')
    );
    var menu = document.getElementById("mobile-menu");

    // Ensure assistive attributes are present
    if (menu) {
      if (!menu.getAttribute("role")) menu.setAttribute("role", "dialog");
      menu.setAttribute("aria-modal", "false");
    }

    var lastOpener = null;
    var lastFocusedBeforeOpen = null;

    function isVisible(el) {
      if (!el) return false;
      if (el.hasAttribute("hidden")) return false;
      if (el.getAttribute("aria-hidden") === "true") return false;
      var rects = el.getClientRects();
      return rects && rects.length > 0;
    }

    function getFocusable(container) {
      if (!container) return [];
      var focusableSelectors = [
        'a[href]',
        'area[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex="-1"])'
      ].join(',');
      var nodes = Array.prototype.slice.call(container.querySelectorAll(focusableSelectors));
      return nodes.filter(function (el) {
        // Must be visible and not inside an aria-hidden parent
        if (!isVisible(el)) return false;
        var parent = el.parentElement;
        while (parent && parent !== container) {
          if (parent.getAttribute && parent.getAttribute('aria-hidden') === 'true') return false;
          parent = parent.parentElement;
        }
        return true;
      });
    }

    function updateAria() {
      var expanded = toggle.checked ? "true" : "false";
      openButtons.forEach(function (btn) {
        btn.setAttribute("aria-expanded", expanded);
      });
      if (menu) {
        menu.setAttribute("aria-hidden", toggle.checked ? "false" : "true");
        menu.setAttribute("aria-modal", toggle.checked ? "true" : "false");
      }
    }

    function focusInitialElement() {
      if (!menu) return;
      var focusables = getFocusable(menu);
      var target = null;
      // Prefer close button if present, else the first focusable control
      var closeBtn = menu.querySelector('.close-btn');
      if (closeBtn && isVisible(closeBtn)) {
        target = closeBtn;
      } else if (focusables.length > 0) {
        target = focusables[0];
      }
      if (target) {
        // Focus after styles/visibility apply
        requestAnimationFrame(function () { target.focus(); });
      }
    }

    function handleKeydownTrap(event) {
      if (!toggle.checked || !menu) return;

      // Only trap when focus is within the drawer to avoid conflicting with other modals (e.g., Ghost Portal)
      var active = document.activeElement;
      var focusIsInsideMenu = menu.contains(active);

      if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;
      if (!focusIsInsideMenu) return;

      var focusables = getFocusable(menu);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var isShift = event.shiftKey === true;

      if (!isShift && active === last) {
        event.preventDefault();
        first.focus();
      } else if (isShift && active === first) {
        event.preventDefault();
        last.focus();
      }
    }

    function openMenu() {
      lastFocusedBeforeOpen = document.activeElement;
      updateAria();
      document.addEventListener('keydown', handleKeydownTrap, true);
      focusInitialElement();
    }

    function closeMenu() {
      toggle.checked = false;
      updateAria();
      document.removeEventListener('keydown', handleKeydownTrap, true);
      // Restore focus
      var target = lastOpener || lastFocusedBeforeOpen;
      if (target && typeof target.focus === 'function') {
        requestAnimationFrame(function () { target.focus(); });
      }
    }

    function handleKeyActivate(event) {
      var key = event.key;
      if (key === "Enter" || key === " ") {
        event.preventDefault();
        // Record opener when keyboard-activated
        if (event.currentTarget && event.currentTarget.classList.contains('menu-btn')) {
          lastOpener = event.currentTarget;
        }
        var willOpen = !toggle.checked;
        toggle.checked = willOpen;
        updateAria();
        if (willOpen) {
          openMenu();
        } else {
          closeMenu();
        }
      }
    }

    // Track last opener on pointer
    openButtons.forEach(function (btn) {
      btn.addEventListener('mousedown', function () { lastOpener = btn; });
      btn.addEventListener('keydown', handleKeyActivate);
      btn.addEventListener('click', function () {
        // checkbox state toggled by label click; wait for it then run handlers
        setTimeout(function () {
          updateAria();
          if (toggle.checked) {
            openMenu();
          } else {
            closeMenu();
          }
        }, 0);
      });
    });

    closeButtons.forEach(function (btn) {
      btn.addEventListener('keydown', handleKeyActivate);
      btn.addEventListener('click', function () {
        setTimeout(function () {
          updateAria();
          if (toggle.checked) {
            openMenu();
          } else {
            closeMenu();
          }
        }, 0);
      });
    });

    // React to programmatic or label-driven state changes
    toggle.addEventListener('change', function () {
      updateAria();
      if (toggle.checked) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    // Initialize ARIA state on load
    updateAria();
  });
})();
