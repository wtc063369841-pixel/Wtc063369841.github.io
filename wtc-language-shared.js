/* WTC Sonic — reliable shared language selector for all pages.
   Page-specific setLanguage(lang) functions remain the source of translations. */
(() => {
  "use strict";

  const STORAGE_KEY = "wtc-language";
  const LANGUAGES = new Set(["en", "bm", "cn"]);
  const LABELS = { en: "EN", bm: "BM", cn: "中文" };

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

  function closeLanguageMenus(except) {
    document.querySelectorAll(".lang-dropdown").forEach(menu => {
      if (menu !== except) menu.classList.remove("show");
    });
    document.querySelectorAll(".lang-toggle").forEach(button => {
      const ownMenu = button.closest(".lang-menu, .lang-menu-intro")?.querySelector(".lang-dropdown");
      button.setAttribute("aria-expanded", String(!!ownMenu && ownMenu === except));
    });
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

    // Save first: several legacy pages intentionally reload to restore their
    // original English HTML. The selected language must survive that reload.
    saveLanguage(lang);

    let translated = false;
    try {
      // English is already the source HTML on a fresh page load. Skipping the
      // legacy English branch avoids reload loops on pages that use reload()
      // to restore their original English copy.
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

    // Update the selector even if a page-specific translation has a defect.
    document.querySelectorAll(".lang-toggle").forEach(button => {
      button.textContent = LABELS[lang];
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

  // Capture phase is deliberate: it bypasses legacy page click handlers that
  // were closing or swallowing the language menu before it could be used.
  document.addEventListener("click", event => {
    const toggle = event.target.closest && event.target.closest(".lang-toggle");
    if (toggle) {
      event.preventDefault();
      event.stopPropagation();
      const scope = toggle.closest(".lang-menu, .lang-menu-intro");
      const menu = scope && scope.querySelector(".lang-dropdown");
      if (!menu) {
        console.error("[WTC language] Dropdown markup is missing.");
        return;
      }
      const shouldOpen = !menu.classList.contains("show");
      closeLanguageMenus(shouldOpen ? menu : null);
      if (shouldOpen) {
        menu.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      }
      return;
    }

    const choice = event.target.closest && event.target.closest("[data-wtc-lang]");
    if (choice) {
      event.preventDefault();
      event.stopPropagation();
      applyLanguage(choice.getAttribute("data-wtc-lang"));
      return;
    }

    if (!event.target.closest || !event.target.closest(".lang-menu, .lang-menu-intro")) {
      closeLanguageMenus(null);
    }
  }, true);

  // Keyboard support for the selector and its choices.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLanguageMenus(null);
  });

  const runtimeStyle = document.createElement("style");
  runtimeStyle.id = "wtc-language-runtime-style";
  runtimeStyle.textContent = `
    .lang-menu, .lang-menu-intro { position:relative !important; z-index:2147483000 !important; }
    .lang-toggle { cursor:pointer !important; pointer-events:auto !important; }
    .lang-dropdown { position:absolute !important; top:calc(100% + 8px) !important; right:0 !important; min-width:132px !important; width:max-content !important; padding:8px !important; background:#fff !important; border:1px solid #e5e7eb !important; border-radius:10px !important; box-shadow:0 12px 28px rgba(0,0,0,.14) !important; }
    .lang-dropdown.show { display:flex !important; visibility:visible !important; opacity:1 !important; pointer-events:auto !important; z-index:2147483000 !important; }
    .lang-dropdown button { display:block !important; width:100% !important; cursor:pointer !important; pointer-events:auto !important; }
  `;
  (document.head || document.documentElement).appendChild(runtimeStyle);

  window.WTCSetLanguage = applyLanguage;
  window.WTCToggleLanguageMenu = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const button = event && event.currentTarget;
    if (button) {
      const scope = button.closest(".lang-menu, .lang-menu-intro");
      const menu = scope && scope.querySelector(".lang-dropdown");
      if (menu) {
        const open = !menu.classList.contains("show");
        closeLanguageMenus(open ? menu : null);
        if (open) menu.classList.add("show");
      }
    }
    return false;
  };

  function restore() {
    const lang = readLanguage();
    // Only call the page translator; applyLanguage also updates persistent state.
    applyLanguage(lang, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restore, { once: true });
  } else {
    restore();
  }
})();
