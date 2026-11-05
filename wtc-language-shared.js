/* WTC Sonic — shared three-language selector.
   Mobile fix: move the open dropdown to <body> so horizontal-scroll navigation
   cannot clip it. Page-specific setLanguage(lang) functions remain the
   translation source for each page. */
(() => {
  "use strict";

  const STORAGE_KEY = "wtc-language";
  const LANGUAGES = new Set(["en", "bm", "cn"]);
  const LABELS = { en: "EN", bm: "BM", cn: "中文" };
  const menuForToggle = new WeakMap();
  const menuState = new WeakMap();

  function readLanguage() {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      if (LANGUAGES.has(fromUrl)) return fromUrl;
    } catch (_) {}
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGUAGES.has(saved)) return saved;
    } catch (_) {}
    try {
      const cookie = document.cookie.match(/(?:^|;\s*)wtc-language=(en|bm|cn)(?:;|$)/);
      if (cookie) return cookie[1];
    } catch (_) {}
    return "en";
  }

  function rememberMenus() {
    document.querySelectorAll(".lang-toggle").forEach(toggle => {
      const scope = toggle.closest(".lang-menu, .lang-menu-intro");
      const menu = scope && scope.querySelector(".lang-dropdown");
      if (menu) menuForToggle.set(toggle, menu);
    });
  }

  function restoreMenuToOriginalParent(menu) {
    const state = menuState.get(menu);
    if (!state) return;
    if (state.placeholder && state.placeholder.parentNode) {
      state.placeholder.parentNode.insertBefore(menu, state.placeholder);
      state.placeholder.remove();
    } else if (state.parent && menu.parentNode !== state.parent) {
      state.parent.appendChild(menu);
    }
    if (state.originalStyle === null) menu.removeAttribute("style");
    else menu.setAttribute("style", state.originalStyle);
    menuState.delete(menu);
  }

  function closeLanguageMenus(except) {
    document.querySelectorAll(".lang-dropdown").forEach(menu => {
      if (menu !== except) {
        menu.classList.remove("show");
        restoreMenuToOriginalParent(menu);
      }
    });
    document.querySelectorAll(".lang-toggle").forEach(button => {
      const menu = menuForToggle.get(button);
      button.setAttribute("aria-expanded", String(!!menu && menu === except));
    });
  }

  function openMobileMenu(toggle, menu) {
    const rect = toggle.getBoundingClientRect();
    const placeholder = document.createComment("WTC language menu position");
    const parent = menu.parentNode;
    parent.insertBefore(placeholder, menu);
    menuState.set(menu, {
      parent,
      placeholder,
      originalStyle: menu.hasAttribute("style") ? menu.getAttribute("style") : null
    });

    // A fixed-position menu attached to body escapes .top-menu's
    // overflow-x:auto clipping on real mobile layouts.
    document.body.appendChild(menu);
    const menuWidth = Math.min(160, Math.max(132, window.innerWidth - 16));
    const right = Math.max(8, window.innerWidth - rect.right);
    const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, rect.right - menuWidth));
    menu.style.setProperty("position", "fixed", "important");
    menu.style.setProperty("top", Math.min(window.innerHeight - 150, rect.bottom + 6) + "px", "important");
    menu.style.setProperty("left", left + "px", "important");
    menu.style.setProperty("right", "auto", "important");
    menu.style.setProperty("width", menuWidth + "px", "important");
    menu.style.setProperty("min-width", "132px", "important");
    menu.style.setProperty("z-index", "2147483647", "important");
    menu.style.setProperty("display", "flex", "important");
    menu.style.setProperty("visibility", "visible", "important");
    menu.style.setProperty("opacity", "1", "important");
    menu.style.setProperty("pointer-events", "auto", "important");
    menu.style.setProperty("flex-direction", "column", "important");
    menu.style.setProperty("background", "#fff", "important");
    menu.style.setProperty("border", "1px solid #e5e7eb", "important");
    menu.style.setProperty("border-radius", "10px", "important");
    menu.style.setProperty("box-shadow", "0 12px 28px rgba(0,0,0,.16)", "important");
    menu.style.setProperty("padding", "8px", "important");
  }

  function saveLanguage(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    try {
      document.cookie = STORAGE_KEY + "=" + lang + "; Path=/; Max-Age=31536000; SameSite=Lax";
    } catch (_) {}
  }

  function syncInternalLinks(lang) {
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(https?:|mailto:|tel:|javascript:|data:)/i.test(raw)) return;
      try {
        const target = new URL(raw, window.location.href);
        const current = new URL(window.location.href);
        if (target.origin === current.origin && /\.html?$/i.test(target.pathname)) {
          target.searchParams.set("lang", lang);
          link.setAttribute("href", target.href);
        }
      } catch (_) {}
    });
  }

  function applyLanguage(lang, isRestore = false) {
    if (!LANGUAGES.has(lang)) return;
    saveLanguage(lang);

    let translated = false;
    try {
      if (isRestore && lang === "en") {
        translated = true;
      } else if (typeof window.setLanguage === "function") {
        window.setLanguage(lang);
        translated = true;
      } else {
        console.error("[WTC language] This page does not define setLanguage(lang).");
      }
    } catch (error) {
      console.error("[WTC language] Page translation failed:", error);
    }

    document.querySelectorAll(".lang-toggle").forEach(button => {
      // Preserve nested icon markup if a page uses it.
      const icon = button.querySelector("i");
      if (icon) icon.textContent = LABELS[lang];
      else button.textContent = LABELS[lang];
      button.setAttribute("aria-label",
        lang === "cn" ? "选择语言" :
        lang === "bm" ? "Pilih bahasa" : "Select language");
      button.setAttribute("aria-expanded", "false");
    });

    document.documentElement.lang = lang === "cn" ? "zh-CN" : lang === "bm" ? "ms" : "en";
    document.documentElement.dataset.wtcLanguage = lang;
    syncInternalLinks(lang);
    closeLanguageMenus(null);
    if (!translated) console.warn("[WTC language] Selector changed, but page translation function was unavailable.");
  }

  rememberMenus();

  // Capture phase handles both mouse clicks and mobile touch-generated clicks.
  document.addEventListener("click", event => {
    const target = event.target;
    const toggle = target && target.closest ? target.closest(".lang-toggle") : null;
    if (toggle) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const scope = toggle.closest(".lang-menu, .lang-menu-intro");
      const menu = menuForToggle.get(toggle) || (scope && scope.querySelector(".lang-dropdown"));
      if (!menu) {
        console.error("[WTC language] Dropdown markup is missing for this selector.");
        return;
      }
      menuForToggle.set(toggle, menu);
      const shouldOpen = !menu.classList.contains("show");
      closeLanguageMenus(null);
      if (shouldOpen) {
        menu.classList.add("show");
        if (window.matchMedia && window.matchMedia("(max-width: 760px)").matches) {
          openMobileMenu(toggle, menu);
        }
        toggle.setAttribute("aria-expanded", "true");
      }
      return;
    }

    const choice = target && target.closest ? target.closest("[data-wtc-lang]") : null;
    if (choice) {
      event.preventDefault();
      event.stopImmediatePropagation();
      applyLanguage(choice.getAttribute("data-wtc-lang"));
      return;
    }

    if (!target || !target.closest || !target.closest(".lang-menu, .lang-menu-intro")) {
      closeLanguageMenus(null);
    }
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLanguageMenus(null);
  });

  // Close on scroll/resize to avoid a detached menu after the header moves.
  window.addEventListener("scroll", () => closeLanguageMenus(null), true);
  window.addEventListener("resize", () => closeLanguageMenus(null));

  const runtimeStyle = document.createElement("style");
  runtimeStyle.id = "wtc-language-runtime-style";
  runtimeStyle.textContent = `
    .lang-menu, .lang-menu-intro { position:relative !important; z-index:2147483000 !important; }
    .lang-toggle { cursor:pointer !important; pointer-events:auto !important; touch-action:manipulation !important; -webkit-tap-highlight-color:transparent !important; }
    .lang-dropdown { position:absolute !important; top:calc(100% + 8px) !important; right:0 !important; min-width:132px !important; width:max-content !important; padding:8px !important; background:#fff !important; border:1px solid #e5e7eb !important; border-radius:10px !important; box-shadow:0 12px 28px rgba(0,0,0,.14) !important; }
    .lang-dropdown.show { display:flex !important; visibility:visible !important; opacity:1 !important; pointer-events:auto !important; z-index:2147483000 !important; }
    .lang-dropdown button { display:block !important; width:100% !important; min-height:38px !important; cursor:pointer !important; pointer-events:auto !important; touch-action:manipulation !important; }
  `;
  (document.head || document.documentElement).appendChild(runtimeStyle);

  window.WTCSetLanguage = applyLanguage;
  window.WTCToggleLanguageMenu = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const button = event && event.currentTarget;
    if (button) button.click();
    return false;
  };

  function restore() {
    rememberMenus();
    applyLanguage(readLanguage(), true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restore, { once: true });
  } else {
    restore();
  }
})();
