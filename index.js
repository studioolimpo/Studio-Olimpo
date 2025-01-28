


  
function initWorkScroll(next) {
  next = next || document;

  console.log("initWorkScroll initialized!");

  let elements = next.querySelectorAll("[visual-fade-in]");

  elements.forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: "1rem" }, 
      {
        opacity: 1,
        y: "0rem", 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element, 
          start: "top 70%", 
          end: "top top",
          toggleActions: "restart none none reverse", 
          markers: true, 
        },
      }
    );
  });
}
  
  
function initWorkHero(next) {
  next = next || document;

  let triggers = next.querySelectorAll(".works_wrap");
  let targets = next.querySelectorAll(".works_contain");


  triggers.forEach((trigger, index) => {
    let target = targets[index];

    if (!target) {
      return; 
    }


    gsap.fromTo(
      target,
      { yPercent: 0 },
      {
        yPercent: -10,
        scrollTrigger: {
          trigger: trigger,
          start: "25% top", 
          end: "bottom top", 
          scrub: true,
        },
      }
    );
  });
}
  
// Dichiarazione della funzione initFirst
function initFirst() {
  console.log("First");
}

// Dichiarazione della funzione initSecond
function initSecond() {
  console.log("Second");
}

// Dichiarazione della funzione initGroup
function initGroup() {
  // Richiama initFirst
  initFirst();
  // Richiama initSecond
  initSecond();
  // Log aggiuntivo
  console.log("Group");
}

function resetWebflow(data) {
  let dom = $(
    new DOMParser().parseFromString(data.next.html, "text/html")
  ).find("html");

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
      let newCodeString = codeString.replace(
        /window\.addEventListener\("DOMContentLoaded",\s*\(\s*event\s*\)\s*=>\s*{\s*/,
        ""
      );
      codeString = newCodeString.replace(/\s*}\s*\);\s*$/, "");
    }
    let script = document.createElement("script");
    script.type = "text/javascript";
    if ($(this).attr("src")) script.src = $(this).attr("src");
    script.text = codeString;
    document.body.appendChild(script).remove();
  });
}

barba.hooks.before((data) => {
  // Rimuove tutte le funzioni prima di entrare nella nuova pagina
  if (
    window.pageFunctions &&
    typeof pageFunctions.removeAllFunctions === "function"
  ) {
    pageFunctions.removeAllFunctions();
  }
});

barba.hooks.enter((data) => {
  gsap.set(data.next.container, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 105,
  });
});

barba.hooks.after((data) => {
  gsap.set(data.next.container, {
    delay: 0.1,
    position: "relative",
    zIndex: 10,
  });
  $(window).scrollTop(0);

  // Reinizializza Webflow e altre funzioni
  resetWebflow(data);

  if (
    window.pageFunctions &&
    typeof pageFunctions.executeFunctions === "function"
  ) {
    pageFunctions.executeFunctions();
  }
});

// Modifica per gestire la transizione anche sulla stessa pagina
$(document).ready(function () {
  // Gestisci il clic sui link interni (link che portano alla stessa pagina)
  $("a").on("click", function (e) {
    var destination = $(this).attr("href");
    var currentLocation = window.location.pathname;

    // Se il link porta alla stessa pagina
    if (
      destination === currentLocation ||
      destination === currentLocation + "#" ||
      destination === currentLocation + window.location.search
    ) {
      e.preventDefault(); // Previeni il comportamento di default

      // Usa barba per caricare la stessa pagina con la transizione
      barba.go(destination);
    }
  });
});

barba.init({
  preventRunning: true,
  transitions: [
    {
      sync: true,
      leave(data) {
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.out" },
        });

        const coverWrap =
          data.current.container.querySelector(".transition_wrap");

        // Anima la copertura della pagina uscente
        tl.to(coverWrap, { opacity: 1 });

        return tl;
      },
      enter(data) {
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.out" },
        });

        const coverWrap = data.next.container.querySelector(".transition_wrap");

        // Ripristina lo stato iniziale della copertura della pagina entrante
        tl.set(coverWrap, { opacity: 0 });

        // Anima la pagina entrante
        tl.from(data.next.container, { y: "100vh" });
        tl.to(data.current.container, { y: "-30vh" }, "<");

        return tl;
      },
    },
  ],

  views: [
    {
      namespace: "home",
      beforeEnter(data) {
        let incomingPage = $(data.next.container);
        let tl = gsap.timeline();
        tl.from(incomingPage.find(".logo_svg"), {
          delay: 0.4,
          yPercent: 110,
          stagger: 0.1,
          duration: 0.9,
        });
        tl.from(
          incomingPage.find(".hero_heading"),
          { yPercent: 110, duration: 0.7 },
          "< 0.3"
        );
      },
    },
    {
      namespace: "about",
      beforeEnter(data) {
        initGroup();
        let incomingPage = $(data.next.container);
        let tl = gsap.timeline();
        tl.fromTo(
          incomingPage.find(".hero_about_contain"),
          { yPercent: 10, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.5,
            ease: "power1.out",
          }
        );
      },
    },
    {
      namespace: "works",
      afterEnter(data) {
        let next = data.next.container;
        initWorkHero(next);
        initWorkScroll(next);
      },
    },
    {
      namespace: "projects",
      beforeEnter(data) {
        let incomingPage = $(data.next.container);
        let tl = gsap.timeline();
        tl.fromTo(
          incomingPage.find(".works_contain"),
          { yPercent: 10, opacity: 0 },
          { delay: 0.5, opacity: 0.7, yPercent: 0, duration: 0.9 }
        );
      },
    },

    {
      namespace: "contact",
      beforeEnter(data) {
        let incomingPage = $(data.next.container);
        let tl = gsap.timeline();
        tl.fromTo(
          incomingPage.find(".hero_contact_contain"),
          { yPercent: 10, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.5,
            ease: "power1.out",
          }
        );
      },
    },
  ],
});

 
