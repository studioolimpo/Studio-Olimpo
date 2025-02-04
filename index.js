

// const appHeight = () => {
//     const doc = document.documentElement;
//     doc.style.setProperty("--app-height", `${window.innerHeight}px`);
//   };
  
//   window.addEventListener("resize", appHeight);
//   appHeight();
  
//   window.addEventListener("DOMContentLoaded", () => {
//     appHeight();
    
   
//     const appHeightValue = getComputedStyle(document.documentElement).getPropertyValue("--app-height");
//     console.log(appHeightValue);
//   });



//// CUSTOM EASE /////

CustomEase.create("load", "0.53, 0, 0, 1");


////////////  LENIS  //////////

  let lenis;

  if (Webflow.env("editor") === undefined) {
    lenis = new Lenis({
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, 
    });
  
    lenis.on("scroll", ScrollTrigger.update);
  
  
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); 
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
      if ($(this).hasClass("stop-scroll")) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });
  
  }
    



function handleOrientationChange() {
    setTimeout(function () {
      window.location.reload();
    }, 250);
  }
  window.addEventListener("orientationchange", handleOrientationChange);
  

  CustomEase.create("main", "0.5, 0.05, 0.05, 0.99");
  CustomEase.create("load", "0.53, 0, 0, 1");



//__________________GENERAL_________________//

/////////// SIGNATURE /////////

function Signature() {
    if (ranHomeLoader === false) { 
      console.log("%cCredits: Studio Olimpo – https://www.studioolimpo.it", "background: #F8F6F1; color: #000; font-size: 12px; padding:10px 14px;");
    }
  }


////// PLAY VIDEO IN VIEWPORT //////////

function playVideo(next) {

    const videos = next.querySelectorAll('.g_visual_video');
  
    if (videos.length === 0) {
      return;
    }
 
    const options = {
      root: null,  
      threshold: 0.5
    };
  
    const callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.play();
          observer.unobserve(video);
        }
      });
    };
  
    const observer = new IntersectionObserver(callback, options);
  
    videos.forEach(video => {
      observer.observe(video);
    });
  }



////// MOUSE MOVE CURSOR //////

function mouseMoveCursor() {
    const cursor = document.querySelector(".cursor_wrap");
    let cursorRevealed = false;

    cursor.classList.add("cursor_hide");

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo(cursor, "x", { duration: 0.7, ease: "power3.out" });
    let yTo = gsap.quickTo(cursor, "y", { duration: 0.7, ease: "power3.out" });

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);

        if (!cursorRevealed) {
            cursor.classList.remove("cursor_hide");
            cursorRevealed = true;
        }
    });
}



///// RESET VISUAL ////


function resetVisual(next) {
    let a = next.querySelectorAll("[visual-fade-in]");
  
    gsap.set(a, {
      opacity: 0, 
      overwrite: true
    });
}

///// RESET VIDEO ////


function resetVideo(next) {
    let a = next.querySelector("[visual-slide-in]");
  
    gsap.set(a, { 
      autoAlpha: 0, 
      overwrite: true
    });
}


////////// CURRENT YEAR /////////

function updateYear(next) {

    next = next || document;

    let yrSpan = next.querySelector('.current-year');
    if (yrSpan) {
      const currentYr = new Date().getFullYear();
      yrSpan.textContent = currentYr;
    }
  }




//////////  STOPMOTION  /////////

function initStopmotion(next) {
    next = next || document;

    let sections = next.querySelectorAll("[data-stopmotion-group]");

    sections.forEach((section) => {
        let visuals = section.querySelectorAll("[data-stopmotion]");

        if (visuals.length === 0) return;

        let currentIndex = 0;

        gsap.set(visuals, { 
            opacity: 0, 
            position: "absolute", 
            willChange: "opacity, transform" 
        });

        gsap.set(visuals[0], { 
            opacity: 1, 
            position: "relative" 
        });

        function animateStopmotion() {
            let prevIndex = currentIndex;
            currentIndex = (currentIndex + 1) % visuals.length;

            gsap.set(visuals[prevIndex], { opacity: 0, position: "absolute" });
            gsap.set(visuals[currentIndex], { opacity: 1, position: "relative" });

            setTimeout(animateStopmotion, 1500);
        }

        setTimeout(animateStopmotion, 1500);
    });
}


////////// THEME SWITCHER /////////

function initThemeAnimation() {  

    $("[data-animate-to]").each(function () {
        let theme = 1; // Default chiaro
        if ($(this).attr("data-animate-to") === "dark") theme = 2;

        ScrollTrigger.create({
            trigger: $(this),
            start: "top center",
            end: "bottom center",
            onToggle: ({ isActive }) => {
                if (isActive) {
                    gsap.to("body", { ...colorThemes[theme], duration: 0.5 });
                }
            }
        });
    });

}

function resetThemeLight() {
    gsap.to("body", { ...colorThemes[1], duration: 0.7 }); 
  }



////////////// SECTION FADE IN /////////////

function initSectionFade(next) {
    next = next || document;

    let elements = next.querySelectorAll("[section-fade-in]");

    elements.forEach((element) => {
        gsap.fromTo(
            element,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                duration: 0.7,
                ease: "sine.inOut",
                scrollTrigger: {
                    trigger: element,
                    start: "top 70%",
                    end: "top top",
                    toggleActions: "play none none none",
                },
            }
        );
    });
}





//__________________LOADER _________________//

let ranHomeLoader = false;


function initHomeLoader() {
    let counter = { value: 0 };
    let loaderDuration = 3;
    let loaderWrap = document.querySelector(".loader_wrap");
    let loaderVisualWrapper = loaderWrap.querySelectorAll(".loader_visual_wrapper");
    let loaderInner = loaderWrap.querySelectorAll(".loader_visual_inner");
    let loaderText = loaderWrap.querySelectorAll(".u-text-style-small");
    let logoHero = document.querySelectorAll(".logo_svg");
    let sloganHero = document.querySelectorAll(".hero_heading");

    if (sessionStorage.getItem("visited") !== null) {
        loaderDuration = 3;
    }
    sessionStorage.setItem("visited", "true");

    function updateLoaderText() {
        let progress = Math.round(counter.value);
        $(".loader_number").text(progress);
    }

    function endLoaderAnimation() {
        gsap.fromTo(loaderInner, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            ease: "power2.inOut",
            duration: 0.6,
        });

        gsap.to(loaderText, {
            yPercent: -110,
            duration: 0.4,
            ease: "power2.out"
        }, "<0.5");

        gsap.to(loaderWrap, {
            autoAlpha: 0,
            ease: "power1.out",
            duration: 0.7,
            onComplete: function () {
                loaderWrap.style.display = "none";
                gsap.set(loaderInner, { autoAlpha: 0 });
            },
        }, "<0.45");

        gsap.fromTo(logoHero, {
            yPercent: 110
        }, {
            yPercent: 0,
            stagger: 0.1,
            duration: 0.9
        }, "<0.1");

        gsap.fromTo(sloganHero, {
            yPercent: 110
        }, {
            yPercent: 0,
            duration: 0.7
        }, "<");
    }

    let tl = gsap.timeline({
        onStart: function () {
            lenis.stop(); 

            if (window.innerWidth > 768) {
                lenis.scrollTo(0, { duration: 0, immediate: true });  
            } else {
                window.scrollTo(0, 0); 
            }
        },
        onComplete: function () {
            ranHomeLoader = true;
            endLoaderAnimation();
            lenis.start(); 
        },
    });

    gsap.set(loaderWrap, { autoAlpha: 1 });
    gsap.set(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(loaderVisualWrapper, { autoAlpha: 0 });

    CustomEase.create("load", "0.53, 0, 0, 1");

    tl.to(counter, {
        value: 100,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: "load",
    }, 0);

    tl.fromTo(loaderText, {
        yPercent: 100,
    }, {
        opacity: 1,
        yPercent: 0,
        duration: 0.3,
        stagger: 0.2,
        ease: "power1.out",
    }, "<0.3");

    tl.fromTo(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        autoAlpha: 0,
        scale: 1.1
    }, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        autoAlpha: 1,
        scale: 1,
        duration: 1
    }, "<0.1");

    tl.fromTo(loaderVisualWrapper, {
        autoAlpha: 0
    }, {
        autoAlpha: 1,
        ease: "none",
        duration: 0.01,
        stagger: 0.4
    }, "<");
}



///////// LOADER ABOUT /////////
function initAboutLoader() {

    let counter = { value: 0 };
    let loaderDuration = 3;
    let loaderWrap = document.querySelector(".loader_wrap");
    let loaderVisual = loaderWrap.querySelector(".loader_visual");
    let loaderVisualWrapper = loaderWrap.querySelectorAll(".loader_visual_wrapper");
    let loaderInner = loaderWrap.querySelectorAll(".loader_visual_inner");
    let loaderProgress = loaderWrap.querySelector(".loader_progress");
    let loaderText = loaderWrap.querySelectorAll(".u-text-style-small");
    let aboutHero = document.querySelectorAll(".hero_about_contain");
  
    


    if (sessionStorage.getItem("visited") !== null) {
        loaderDuration = 3;
    }
    sessionStorage.setItem("visited", "true");

    function updateLoaderText() {
        let progress = Math.round(counter.value);
        $(".loader_number").text(progress);
    }

    function endLoaderAnimation() {
        gsap.fromTo(loaderInner, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            ease: "power2.inOut",
            duration: 0.6,
        });

        gsap.to(loaderText, {
            yPercent: -110,
            duration: 0.4,
            ease: "power2.out"
        }, "<0.5");

        gsap.to(loaderWrap, {
            autoAlpha: 0,
            ease: "power1.out",
            duration: 0.7,
            onComplete: function () {
                loaderWrap.style.display = "none";
                gsap.set(loaderInner, { autoAlpha: 0 });
            },
        }, "<0.45");

        gsap.fromTo(
            aboutHero,
            { yPercent: 10, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power1.out",
            },"<0.2");


    }

    let tl = gsap.timeline({
        onStart: function () {
            lenis.stop();

            if (window.innerWidth > 768) {
                lenis.scrollTo(0, { duration: 0, immediate: true });  
            } else {
                window.scrollTo(0, 0); 
            }

        },
        onComplete: function () {
            ranHomeLoader = true;
            endLoaderAnimation();
            lenis.start();
        },
    });

    gsap.set(loaderWrap, { autoAlpha: 1 });
    gsap.set(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(loaderVisualWrapper, { autoAlpha: 0 });

    CustomEase.create("load", "0.53, 0, 0, 1");

    tl.to(counter, {
        value: 100,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: "load",
    }, 0);

    tl.fromTo(loaderText, {
        yPercent: 100,
    }, {
        opacity: 1,
        yPercent: 0,
        duration: 0.3,
        stagger: 0.2,
        ease: "power1.out",
    }, "<0.3");

    tl.fromTo(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        autoAlpha: 0,
        scale: 1.1
    }, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        autoAlpha: 1,
        scale: 1,
        duration: 1
    }, "<0.1");

    tl.fromTo(loaderVisualWrapper, {
        autoAlpha: 0
    }, {
        autoAlpha: 1,
        ease: "none",
        duration: 0.01,
        stagger: 0.4
    }, "<");
}


///////// LOADER WORKS /////////
function initWorksLoader() {

    let counter = { value: 0 };
    let loaderDuration = 3;
    let loaderWrap = document.querySelector(".loader_wrap");
    let loaderVisual = loaderWrap.querySelector(".loader_visual");
    let loaderVisualWrapper = loaderWrap.querySelectorAll(".loader_visual_wrapper");
    let loaderInner = loaderWrap.querySelectorAll(".loader_visual_inner");
    let loaderProgress = loaderWrap.querySelector(".loader_progress");
    let loaderText = loaderWrap.querySelectorAll(".u-text-style-small");
    let worksVisual = document.querySelectorAll("#hero .hero_visual_item");
  
  
    
   



    if (sessionStorage.getItem("visited") !== null) {
        loaderDuration = 3;
    }
    sessionStorage.setItem("visited", "true");

    function updateLoaderText() {
        let progress = Math.round(counter.value);
        $(".loader_number").text(progress);
    }

    function endLoaderAnimation() {
        gsap.fromTo(loaderInner, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            ease: "power2.inOut",
            duration: 0.6,
        });

        gsap.to(loaderText, {
            yPercent: -110,
            duration: 0.4,
            ease: "power2.out"
        }, "<0.5");

        gsap.to(loaderWrap, {
            autoAlpha: 0,
            ease: "power1.out",
            duration: 0.7,
            onComplete: function () {
                loaderWrap.style.display = "none";
                gsap.set(loaderInner, { autoAlpha: 0 });
            },
        }, "<0.45");

    }

    let tl = gsap.timeline({
        onStart: function () {
            lenis.stop();

            if (window.innerWidth > 768) {
                lenis.scrollTo(0, { duration: 0, immediate: true });  
            } else {
                window.scrollTo(0, 0); 
            }
        },
        onComplete: function () {
            ranHomeLoader = true;
            endLoaderAnimation();
            lenis.start();
        },
    });

    gsap.set(loaderWrap, { autoAlpha: 1 });
    gsap.set(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(loaderVisualWrapper, { autoAlpha: 0 });

    CustomEase.create("load", "0.53, 0, 0, 1");

    tl.to(counter, {
        value: 100,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: "load",
    }, 0);

    tl.fromTo(loaderText, {
        yPercent: 100,
    }, {
        opacity: 1,
        yPercent: 0,
        duration: 0.3,
        stagger: 0.2,
        ease: "power1.out",
    }, "<0.3");

    tl.fromTo(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        autoAlpha: 0,
        scale: 1.1
    }, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        autoAlpha: 1,
        scale: 1,
        duration: 1
    }, "<0.1");

    tl.fromTo(loaderVisualWrapper, {
        autoAlpha: 0
    }, {
        autoAlpha: 1,
        ease: "none",
        duration: 0.01,
        stagger: 0.4
    }, "<");
}


///////// LOADER WORKS /////////
function initContactLoader() {

    let counter = { value: 0 };
    let loaderDuration = 3;
    let loaderWrap = document.querySelector(".loader_wrap");
    let loaderVisual = loaderWrap.querySelector(".loader_visual");
    let loaderVisualWrapper = loaderWrap.querySelectorAll(".loader_visual_wrapper");
    let loaderInner = loaderWrap.querySelectorAll(".loader_visual_inner");
    let loaderProgress = loaderWrap.querySelector(".loader_progress");
    let loaderText = loaderWrap.querySelectorAll(".u-text-style-small");
    let contactHero = document.querySelectorAll(".hero_contact_contain");



    if (sessionStorage.getItem("visited") !== null) {
        loaderDuration = 3;
    }
    sessionStorage.setItem("visited", "true");

    function updateLoaderText() {
        let progress = Math.round(counter.value);
        $(".loader_number").text(progress);
    }

    function endLoaderAnimation() {
        gsap.fromTo(loaderInner, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            ease: "power2.inOut",
            duration: 0.6,
        });

        gsap.to(loaderText, {
            yPercent: -110,
            duration: 0.4,
            ease: "power2.out"
        }, "<0.5");

        gsap.to(loaderWrap, {
            autoAlpha: 0,
            ease: "power1.out",
            duration: 0.7,
            onComplete: function () {
                loaderWrap.style.display = "none";
                gsap.set(loaderInner, { autoAlpha: 0 });
            },
        }, "<0.45");

        

        gsap.fromTo(
            contactHero,
            { yPercent: 2, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power1.out",
            }, "<0.2"
          );
    }

    let tl = gsap.timeline({
        onStart: function () {
            lenis.stop();

            if (window.innerWidth > 768) {
                lenis.scrollTo(0, { duration: 0, immediate: true });  
            } else {
                window.scrollTo(0, 0); 
            }

        },
        onComplete: function () {
            ranHomeLoader = true;
            endLoaderAnimation();
            lenis.start();
        },
    });

    gsap.set(loaderWrap, { autoAlpha: 1 });
    gsap.set(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(loaderVisualWrapper, { autoAlpha: 0 });

    CustomEase.create("load", "0.53, 0, 0, 1");

    tl.to(counter, {
        value: 100,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: "load",
    }, 0);

    tl.fromTo(loaderText, {
        yPercent: 100,
    }, {
        opacity: 1,
        yPercent: 0,
        duration: 0.3,
        stagger: 0.2,
        ease: "power1.out",
    }, "<0.3");

    tl.fromTo(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        autoAlpha: 0,
        scale: 1.1
    }, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        autoAlpha: 1,
        scale: 1,
        duration: 1
    }, "<0.1");

    tl.fromTo(loaderVisualWrapper, {
        autoAlpha: 0
    }, {
        autoAlpha: 1,
        ease: "none",
        duration: 0.01,
        stagger: 0.4
    }, "<");
}


///////// LOADER PROJECT /////////
function initProjectLoader() {

    let counter = { value: 0 };
    let loaderDuration = 3;
    let loaderWrap = document.querySelector(".loader_wrap");
    let loaderVisual = loaderWrap.querySelector(".loader_visual");
    let loaderVisualWrapper = loaderWrap.querySelectorAll(".loader_visual_wrapper");
    let loaderInner = loaderWrap.querySelectorAll(".loader_visual_inner");
    let loaderProgress = loaderWrap.querySelector(".loader_progress");
    let loaderText = loaderWrap.querySelectorAll(".u-text-style-small");
    let projectHero = document.querySelectorAll(".project_contain");
    let projectVisual = document.querySelectorAll(".visual_layout");

    



    if (sessionStorage.getItem("visited") !== null) {
        loaderDuration = 3;
    }
    sessionStorage.setItem("visited", "true");

    function updateLoaderText() {
        let progress = Math.round(counter.value);
        $(".loader_number").text(progress);
    }

    function endLoaderAnimation() {
        gsap.fromTo(loaderInner, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            ease: "power2.inOut",
            duration: 0.6,
        });

        gsap.to(loaderText, {
            yPercent: -110,
            duration: 0.4,
            ease: "power2.out"
        }, "<0.5");

        gsap.to(loaderWrap, {
            autoAlpha: 0,
            ease: "power1.out",
            duration: 0.7,
            onComplete: function () {
                loaderWrap.style.display = "none";
                gsap.set(loaderInner, { autoAlpha: 0 });
            },
        }, "<0.45");

        
        gsap.fromTo(
            projectHero,
            { y: "1rem", opacity: 0 },
            {opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "<0.3"
          );

          gsap.fromTo(projectVisual,
            {autoAlpha: 0},
            {autoAlpha: 1, duration: 0.7, ease: "sine.inOut"},
            "<0.3");
    }

    let tl = gsap.timeline({
        onStart: function () {
            lenis.stop();

            if (window.innerWidth > 768) {
                lenis.scrollTo(0, { duration: 0, immediate: true });  
            } else {
                window.scrollTo(0, 0); 
            }

        },
        onComplete: function () {
            ranHomeLoader = true;
            endLoaderAnimation();
            lenis.start();
        },
    });

    gsap.set(loaderWrap, { autoAlpha: 1 });
    gsap.set(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(loaderVisualWrapper, { autoAlpha: 0 });

    CustomEase.create("load", "0.53, 0, 0, 1");

    tl.to(counter, {
        value: 100,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: "load",
    }, 0);

    tl.fromTo(loaderText, {
        yPercent: 100,
    }, {
        opacity: 1,
        yPercent: 0,
        duration: 0.3,
        stagger: 0.2,
        ease: "power1.out",
    }, "<0.3");

    tl.fromTo(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        autoAlpha: 0,
        scale: 1.1
    }, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        autoAlpha: 1,
        scale: 1,
        duration: 1
    }, "<0.1");

    tl.fromTo(loaderVisualWrapper, {
        autoAlpha: 0
    }, {
        autoAlpha: 1,
        ease: "none",
        duration: 0.01,
        stagger: 0.4
    }, "<");
}


///////////// 404 LOADER

function initErrorLoader() {
    let counter = { value: 0 };
    let counterError = { value: 0 };
    let loaderDuration = 3;
    let loaderWrap = document.querySelector(".loader_wrap");
    let loaderVisual = loaderWrap.querySelector(".loader_visual");
    let loaderVisualWrapper = loaderWrap.querySelectorAll(".loader_visual_wrapper");
    let loaderInner = loaderWrap.querySelectorAll(".loader_visual_inner");
    let loaderProgress = loaderWrap.querySelector(".loader_progress");
    let loaderText = loaderWrap.querySelectorAll(".u-text-style-small");
    let sectionText = document.querySelector("._404_text .g_paragraph_wrap");
    let sectionHeading = document.querySelector("._404_header_inner");
    let sectionNumber = document.querySelector("._404_number");


    let sectionButton = document.querySelector(".button_link_wrap");

    if (sessionStorage.getItem("visited") !== null) {
        loaderDuration = 3;
    }
    sessionStorage.setItem("visited", "true");

    function updateLoaderText() {
        let progress = Math.round(counter.value);
        document.querySelector(".loader_number").textContent = progress;
    }

    function updateErrorText() {
        let progress = Math.round(counterError.value);
        sectionNumber.textContent = progress;
    }

    function endLoaderAnimation() {
        gsap.fromTo(loaderInner, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        }, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            ease: "power2.inOut",
            duration: 0.6,
        });

        gsap.to(loaderText, {
            yPercent: -110,
            duration: 0.4,
            ease: "power2.out"
        }, "<0.5");

        gsap.to(loaderWrap, {
            autoAlpha: 0,
            ease: "power1.out",
            duration: 0.7,
            onComplete: function () {
                loaderWrap.style.display = "none";
                gsap.set(loaderInner, { autoAlpha: 0 });
            },
        }, "<0.45");



        gsap.to(counterError, {
            delay: 0.7,
            value: 4,
            onUpdate: updateErrorText,
            duration: 1.5,
            ease: "load",
        });



        gsap.fromTo(sectionHeading,
            { yPercent: 115 },
            {yPercent: 0, duration: 1.1, ease: "power2.out" },
            "<0.2");


        gsap.fromTo(
            sectionText,
            { yPercent: 110 },
            { opacity: 1, yPercent: 0, duration: 0.7, ease: "power2.out" }, "<1.2"
            );


        gsap.fromTo(sectionButton,
            {opacity:0},
            {opacity: 1, duration: 1.2, ease: "power1.out"}, "<0.7"
            );
    }

    let tl = gsap.timeline({
        onStart: function () {
            lenis.stop();

            if (window.innerWidth > 768) {
                lenis.scrollTo(0, { duration: 0, immediate: true });  
            } else {
                window.scrollTo(0, 0); 
            }

        },
        onComplete: function () {
            ranHomeLoader = true;
            endLoaderAnimation();
            lenis.start();
        },
    });

    gsap.set(loaderWrap, { autoAlpha: 1 });
    gsap.set(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(loaderVisualWrapper, { autoAlpha: 0 });

    tl.to(counter, {
        value: 404,
        onUpdate: updateLoaderText,
        duration: loaderDuration,
        ease: "load",
    }, 0);

    tl.fromTo(loaderText, {
        yPercent: 100,
    }, {
        opacity: 1,
        yPercent: 0,
        duration: 0.3,
        stagger: 0.2,
        ease: "power1.out",
    }, "<0.3");

    tl.fromTo(loaderInner, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        autoAlpha: 0,
        scale: 1.1
    }, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        webkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        autoAlpha: 1,
        scale: 1,
        duration: 1
    }, "<0.1");

    tl.fromTo(loaderVisualWrapper, {
        autoAlpha: 0
    }, {
        autoAlpha: 1,
        ease: "none",
        duration: 0.01,
        stagger: 0.4
    }, "<");
}





//_______________PAGE ANIMATION_______________//

//////////  HOME  /////////

function initHome(next) {
    next = next || document;
    
    let logo = next.querySelectorAll(".logo_svg");
    let title = next.querySelector(".hero_heading");
    let tl = gsap.timeline();
  
    tl.from(logo, {
      delay: 0.4,
      yPercent: 110,
      stagger: 0.1,
      duration: 0.9,
      ease: "power2.out"
    });
  
    tl.from(
        title,
      { yPercent: 110, duration: 0.6, ease:"power2.out" },
      "< 0.3"
    );
  }
  

//////////  ABOUT  /////////

function initAboutHero(next) {
    next = next || document; 
    let elements = next.querySelector(".hero_about_contain");
  
    gsap.fromTo(
      elements,
      { yPercent: 10, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        delay: 0.5,
        ease: "power1.out",
      }
    );
  }


//////////  WORKS  //////////

  
function initWorkScroll(next) {
    next = next || document;

    console.log("works scroll RUN!");

    let elements = next.querySelectorAll("[visual-fade-in]");

    elements.forEach((element) => {
        
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0; 
        const hasPassedStart = rect.top < window.innerHeight * 0.8; 

       
        if (isVisible && hasPassedStart) {
            gsap.set(element, { autoAlpha: 0, yPercent: 3 }); 
            gsap.to(element, {
                autoAlpha: 1,
                yPercent: 0,
                duration: 0.7,
                
                ease: "power2.out"
            });
        } else {
            
            gsap.set(element, { autoAlpha: 0, yPercent: 3 });

            gsap.fromTo(element, { autoAlpha: 0, yPercent: 3 }, {
                autoAlpha: 1,
                yPercent: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",  
                    end: "top top",   
                    toggleActions: "play none none none"
                }
            });
        }
    });
}

function initFooterWorks(next) {
    next = next || document;

    let element = next.querySelector(".footer_2_contain"); 

    if (element) { 
        gsap.fromTo(
            element,
            { autoAlpha: 0, y: "2rem" }, 
            {
                autoAlpha: 1,
                y: "0rem",
                duration: 1,
                ease: "power3.out",
                delay: 0.2,
                scrollTrigger: {
                    trigger: element,
                    start: "top bottom", 
                    end: "top top",
                    toggleActions: "restart none none none", 
                },
            }
        );
    }
}
  
  

  
//////////  CONTACT  //////////

function initContactHero(next) { 
    next = next || document;
    let hero = next.querySelector(".hero_contact_contain"); 
  
    gsap.fromTo(
      hero,
      { yPercent: 4, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        delay: 0.5,
        ease: "power1.out",
      }
    );
  }


  /////////  PROJECTS  //////////

function initProjectHero(next) {
    next = next || document;
    let heroProject = next.querySelector(".project_contain");
    let visualLayout = next.querySelector(".visual_layout");


    gsap.fromTo(
        heroProject,
        { y: "1rem", autoAlpha: 0 },
        { delay: 0.6, autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );

    
      gsap.fromTo(visualLayout,
        {autoAlpha:0},
        {autoAlpha: 1, duration: 0.7, ease: "sine.inOut"},
        "<0.3");

    
}






function initVisualSlidein(next) {
    next = next || document;

    let elements = next.querySelectorAll("[visual-slide-in]");

    elements.forEach((element) => {
        gsap.set(element, { autoAlpha: 0 });

        gsap.to(element, {
            autoAlpha: 1, 
            duration: 0.7,
            ease: "sine.inOut",
            stagger: 0.7,
            scrollTrigger: {
                trigger: element,
                start: "top 80%", 
                end: "top center",  
                toggleActions: "play none none none",
            },
        });
    });
}



////////  404 //////////

function initError(next) {
    next = next || document;
    
    let sectionText = document.querySelector("._404_text .g_paragraph_wrap");
    let sectionHeading = document.querySelector("._404_header_inner");
    let sectionNumber = document.querySelector("._404_number");
    let sectionButton = document.querySelector(".button_link_wrap");


    let tl = gsap.timeline();
  
    function updateErrorText() {
        let progress = Math.round(counterError.value);
        sectionNumber.textContent = progress;
    }


    tl.to(counterError, {
        delay: 0.7,
        value: 4,
        onUpdate: updateErrorText,
        duration: 1.5,
        ease: "load",
    });



    tl.fromTo(sectionHeading,
        { yPercent: 115 },
        {yPercent: 0, duration: 1.1, ease: "power2.out" },
        "<0.2");


    tl.fromTo(
        sectionText,
        { yPercent: 110 },
        { opacity: 1, yPercent: 0, duration: 0.7, ease: "power2.out" }, "<1.2"
        );


    tl.fromTo(sectionButton,
        {opacity:0},
        {opacity: 1, duration: 1.2, ease: "power1.out"}, "<0.7"
        );
  }



////////// BARBA SETTINGS //////

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




barba.hooks.leave(() => {

    lenis.destroy();

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    

    gsap.delayedCall(0.1, () => ScrollTrigger.refresh());

})


barba.hooks.before((data) => {    

  });


barba.hooks.enter((data) => {
    
    resetThemeLight();




  gsap.set(data.next.container, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 105,
  });


 // da verificare 
 lenis = new Lenis({
    duration: 1.1,
    wrapper: document.body,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -13 * t)),
  });

  console.log("enter")

});





barba.hooks.afterEnter((data) => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });

    Signature();
    
});


barba.hooks.after((data) => {
  gsap.set(data.next.container, {
    delay: 0.1,
    position: "relative",
    zIndex: 10,
  });
  $(window).scrollTop(0);

  resetWebflow(data);



});

$(document).ready(function () {
  $("a").on("click", function (e) {
    var destination = $(this).attr("href");
    var currentLocation = window.location.pathname;

    if (
      destination === currentLocation ||
      destination === currentLocation + "#" ||
      destination === currentLocation + window.location.search
    ) {
      e.preventDefault();

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

        tl.to(coverWrap, { opacity: 1 });

 

        return tl;
      },
      enter(data) {
        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power3.out" },
        });


        const coverWrap = data.next.container.querySelector(".transition_wrap");

        tl.set(coverWrap, { opacity: 0 });

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
        let next = data.next.container;
        if (ranHomeLoader !== true) {
            initHomeLoader();
            initThemeAnimation(next);
            initSectionFade (next);
            mouseMoveCursor();

          } else {
        initHome(next);
        gsap.delayedCall(1.5, initThemeAnimation, [next]);
        gsap.delayedCall(1.5, initSectionFade, [next]);

        }
        updateYear(next)
        

      },
    },
    {
      namespace: "about",
      beforeEnter(data) {
        let next = data.next.container;
        if (ranHomeLoader !== true) {
            initAboutLoader();
            mouseMoveCursor();
          } else {
        initAboutHero(next);
        }
        gsap.delayedCall(1.2, initSectionFade, [next]);
        updateYear(next)
      },
    },
    {
        namespace: "works",
        beforeEnter(data) {
            let next = data.next.container;
    
            if (ranHomeLoader !== true) {
                initWorksLoader();
                resetVisual(next);
                mouseMoveCursor();
                gsap.delayedCall(4.2, initWorkScroll, [next]);
            } else {
                resetVisual(next)
                gsap.delayedCall(0.9, initWorkScroll, [next]);
            }
            updateYear(next);
        },
    },
    {
      namespace: "contact",
      beforeEnter(data) {
        let next = data.next.container;
        if (ranHomeLoader !== true) {
            initContactLoader();
            mouseMoveCursor();
          } else {
            initContactHero(next);
        }
        updateYear(next)
      },
    },{
        namespace: "projects",
        beforeEnter(data) {
          let next = data.next.container;
          if (ranHomeLoader !== true) {
            initProjectLoader();
            mouseMoveCursor();
          } else {
            initProjectHero(next);
            resetVideo(next);
        }
        playVideo(next);
        },

        afterEnter(data) {
            let next = data.next.container;
            initStopmotion(next);
            initFooterWorks(next);
            initVisualSlidein(next);
            initSectionFade(next);
        },
      },
      {
        namespace: "404",
        beforeEnter(data) {
            let next = data.next.container;
            if (ranHomeLoader !== true) {
               initErrorLoader();
               mouseMoveCursor();
             } else {
              initError(next);
          }
          updateYear(next)
        },
      },
  ],
});

 
