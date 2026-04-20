function handleOrientationChange() {
    setTimeout((function() {
        window.location.reload()
    }), 250)
}

function initNav() {

  const navWrap = document.querySelector(".nav_wrap");
  const overlay = navWrap.querySelector(".nav_overlay");
  const menu = navWrap.querySelector(".nav_menu");
  const bgPanels = navWrap.querySelectorAll(".nav_menu_panel");
  const menuToggles = document.querySelectorAll("[data-menu-toggle]");
  const menuButton = document.querySelector(".menu_button_wrap");
  const menuButtonLayout = menuButton.querySelectorAll(".menu_button_layout");
  const menuDivider = navWrap.querySelectorAll(".nav_menu_divider");
  const menuList = navWrap.querySelector(".nav_menu_list");
  const navTransition = navWrap.querySelector(".nav_transition");

  let menuOpen = false;
  const tl = gsap.timeline();

  const openNav = () => {
    menuOpen = true;
    navWrap.setAttribute("data-nav", "open");
    tl.clear()
      .set(navWrap, { display: "block" })
      .set(menu, { yPercent: 0 }, "<")
      .set(navTransition, { autoAlpha: 0 }, "<")
      .fromTo(menuButtonLayout, { yPercent: 0 }, { yPercent: -150, duration: 1 }, "<")
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, "<")
      .fromTo(bgPanels, { yPercent: 101 }, { yPercent: 0, duration: 0.6 }, "<")
      .fromTo(menuList, { yPercent: 60 }, { yPercent: 0 }, "<")
      .fromTo(menuDivider, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, stagger: 0.1, duration: 1 }, "<")
      //.fromTo(menuIndexs, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, "<")
      //.fromTo(menuLinks, { autoAlpha: 0, yPercent: 140 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 }, "<0.1");

    lenis.stop();
  };

  const closeNav = () => {
    menuOpen = false;
    navWrap.setAttribute("data-nav", "closed");
    tl.clear()
      .to(overlay, { autoAlpha: 0 })
      .to(menu, { yPercent: -110 }, "<")
      .to(menuButtonLayout, { yPercent: 0 }, "<")
      .set(navWrap, { display: "none" });

    lenis.start();
  };

  const transitionNav = () => {
    menuOpen = false;
    navWrap.setAttribute("data-nav", "closed");
    tl.clear()
      .to(overlay, { autoAlpha: 0, delay: 0.1 })
      .to(navTransition, { autoAlpha: 1, duration: 0.5 }, "<")
      .to(menu, { yPercent: -50, ease: "power2.out" }, "<")
      .to(menuButtonLayout, { yPercent: 0 }, "<0.3")
      .set(navWrap, { display: "none" });
    
    lenis.start();
  };

  // Toggle menu con pulsante
  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      menuOpen ? closeNav() : openNav();
    });
  });

  // Chiudi menu con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) {
      closeNav();
    }
  });

  // Hook di Barba per sincronizzare lo stato nav
  if (window.barba) {
    barba.hooks.leave(() => {
      if (menuOpen) transitionNav();
    });
  }
}


// === FUNZIONI ===

// Stopmotion

function initStopmotion(e) {
  // Usa il container passato o il document intero
  const scope = e instanceof Element ? e : document;

  const sections = scope.querySelectorAll("[data-stopmotion-group]");

  sections.forEach((section) => {
    const visuals = section.querySelectorAll("img");
    if (visuals.length === 0) return;

    let currentIndex = 0;
    let interval = null;

    // Inizializza stato visivo
    gsap.set(visuals, {
      opacity: 0,
      position: "absolute",
      willChange: "opacity, transform"
    });

    gsap.set(visuals[0], {
      opacity: 1,
      position: "relative"
    });

    function play() {
      if (interval) return; // evita intervalli multipli
      interval = setInterval(() => {
        const prevIndex = currentIndex;
        currentIndex = (currentIndex + 1) % visuals.length;

        gsap.set(visuals[prevIndex], { opacity: 0, position: "absolute" });
        gsap.set(visuals[currentIndex], { opacity: 1, position: "relative" });
      }, 1200);
    }

    function stop() {
      clearInterval(interval);
      interval = null;
    }

    // Intersection Observer per avviare/fermare in base alla visibilità
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play();
          } else {
            stop();
          }
        });
      },
      {
        threshold: 0.5 // almeno il 50% visibile
      }
    );

    observer.observe(section);
  });
}


// Get current year

function initCurrentYear(e) {
    e.querySelectorAll("[data-year]").forEach((e => {
        e.innerHTML = (new Date).getFullYear()
    }))
}

// Custom cursor

function initCursorFollow() {

    let cursorRevealed = false;
    cursorWrap.classList.add("cursor_hide");


    gsap.set(cursorWrap, {
        xPercent: -50,
        yPercent: -50
    });
    let e = gsap.quickTo(cursorWrap, "x", {
            ease: "power3"
        }),
        t = gsap.quickTo(cursorWrap, "y", {
            ease: "power3"
        });
    window.addEventListener("mousemove", (r => {
        e(r.clientX), t(r.clientY)
    }))

    if (!cursorRevealed) {
            cursorWrap.classList.remove("cursor_hide");
            cursorRevealed = true;
        }
}

// Animate theme scroll

function initAnimateThemeScroll(e) {
  const scope = e || document;

  $(scope).find("[data-animate-theme-to]").each(function () {
    const theme = $(this).attr("data-animate-theme-to");
    const brand = $(this).attr("data-animate-brand-to");

    ScrollTrigger.create({
      trigger: this,
      start: "top center",
      end: "bottom center",
      onToggle: ({ isActive }) => {
        if (isActive) {
          gsap.to("body", { ...colorThemes.getTheme(theme, brand) });
        }
      }
    });
  });
}


// === FUNZIONI GENERALI ===
 function initGeneral(e) {
//     initNavScroll();
//     initNavName(e);
//     initSplit(e);
//     initHeadings(e);
//     initParallaxImages(e);
       initCurrentYear(e);
       initAnimateThemeScroll(e);
//     initFooter(e);
}

// === VARIABILI GLOBALI ===
let lenis;
gsap.registerPlugin(
    CustomEase,
    SplitText,
    //ScrambleTextPlugin,
    ScrollTrigger,
    Observer,
    //Draggable,
    //InertiaPlugin,
    //Flip
);

// let cleanupWork,
//     navWrap = document.querySelector(".nav-w"),
//     navButton = document.querySelector(".nav-button"),
//     state = navWrap.getAttribute("data-nav"),
//     transitionWrap = document.querySelector(".transition-w"),
//     transitionTitles = transitionWrap.querySelectorAll("p"),
let cursorWrap = document.querySelector(".cursor_wrap")
//     cursorText = cursorWrap.querySelector("p");

// === INIZIALIZZAZIONE LENIS (solo fuori da Webflow Editor) ===
if (void 0 === Webflow.env("editor")) {
    lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
        autoResize: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(e => {
        lenis.raf(1e3 * e);
    });
    gsap.ticker.lagSmoothing(0);

    $("[data-lenis-start]").on("click", function () {
        lenis.start();
    });

    $("[data-lenis-stop]").on("click", function () {
        lenis.stop();
    });

    $("[data-lenis-toggle]").on("click", function () {
        $(this).toggleClass("stop-scroll");
        $(this).hasClass("stop-scroll") ? lenis.stop() : lenis.start();
    });
}

// === BREAKPOINT RESPONSIVE ===
let isMobile = window.innerWidth < 550,
    isMobileLandscape = window.innerWidth < 768,
    isTablet = window.innerWidth < 992;

// === CURVE DI EASING E DEFAULT GSAP ===
CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
CustomEase.create("load", "0.6, 0.01, 0.05, 1");
CustomEase.create("easePanel", "0.59, 0, 0, 1");
CustomEase.create("easeInText", "0, 0, 0, 1");
CustomEase.create("easeOutText", "0.59, 0.01, 0, 1");

gsap.defaults({
    ease: "main",
    duration: 0.725
});

// === EVENTI GLOBALI E INIZIALIZZAZIONI IMMEDIATE ===
window.addEventListener("orientationchange", handleOrientationChange);
initNav();
initCursorFollow();
initCurrentYear(document);

// === HOOK DI BARBA.JS ===
barba.hooks.leave(() => {
    lenis.destroy();
});



barba.hooks.afterEnter(e => {
    let t = e.next.container;

    // Pulisce tutti gli ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => {
        trigger.kill();
    });

    // Reinizializza Lenis se non in editor
    if (void 0 === Webflow.env("editor")) {
        lenis = new Lenis({
            duration: 1.25,
            wrapper: document.body,
            easing: e => (e === 1 ? 1 : 1 - Math.pow(2, -13 * e))
        });

        lenis.scrollTo(".page-w", {
            duration: 0.5,
            force: true,
            lock: true
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add(e => {
            lenis.raf(1e3 * e);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // Inizializza funzioni generali sulla nuova pagina
    initGeneral(t);
});


function resetWebflow(data) {
  let dom = $(new DOMParser().parseFromString(data.next.html, "text/html")).find("html");
  // reset webflow interactions
  $("html").attr("data-wf-page", dom.attr("data-wf-page"));
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();
  // reset w--current class
  $(".w--current").removeClass("w--current");
  $("a").each(function () {
    if ($(this).attr("href") === window.location.pathname) {
      $(this).addClass("w--current");
    }
  });
  // reset scripts
  dom.find("[data-barba-script]").each(function () {
    let codeString = $(this).text();
    if (codeString.includes("DOMContentLoaded")) {
      let newCodeString = codeString.replace(/window\.addEventListener\("DOMContentLoaded",\s*\(\s*event\s*\)\s*=>\s*{\s*/, "");
      codeString = newCodeString.replace(/\s*}\s*\);\s*$/, "");
    }
    let script = document.createElement("script");
    script.type = "text/javascript";
    if ($(this).attr("src")) script.src = $(this).attr("src");
    script.text = codeString;
    document.body.appendChild(script).remove();
  });
}

barba.hooks.enter((data) => {
  gsap.set(data.next.container, { position: "fixed", top: 0, left: 0, width: "100%" });

  //reset theme scroll
  gsap.to("body", { ...colorThemes.getTheme("light", "default"), duration: 0.6 });

});
barba.hooks.after((data) => {
  gsap.set(data.next.container, { position: "relative" });
  $(window).scrollTop(0);
  resetWebflow(data);
});

barba.init({
  debug: !1,
  preventRunning: !0,
  prevent: function({
    el: e
  }) 
    {if (e.hasAttribute("data-barba-prevent")) return !0},
  transitions: [
    {
      sync: true,

      leave(data) {
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.out" }
        });

        const coverWrap = data.current.container.querySelector(".transition_wrap");
        tl.to(coverWrap, { opacity: 1 });

        return tl;
      },

      enter(data) {
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power3.out" }
        });

        const coverWrap = data.next.container.querySelector(".transition_wrap");
        tl.set(coverWrap, { opacity: 0 });
        tl.from(data.next.container, { y: "100vh" });
        tl.to(data.current.container, { y: "-30vh" }, "<");

        return tl;
      }
    }
  ],
  views: [
    {
      namespace: "home",
      enter(data) {

      },
      afterEnter(data) {
        let next = data.next.container;
        initStopmotion(next);
        
      },
    },
  ]
});







