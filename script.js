/* =====================================
   ALL MUSIC FESTIVAL — CINEMATIC SCRIPT
   Full upgrade:
   - smooth scroll with fixed-nav offset
   - active nav link highlight
   - reveal on scroll
   - primary button glow pulse
   - cinematic embers
   - hero parallax
   - lens flare shimmer
   - commercial video polish
   - dynamic festival countdown
   - current year fallback
===================================== */

(() => {
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const nav = $(".nav");
    const hero = $(".hero");
    const heroBg = $(".hero__bg");
    const heroContent = $(".hero__content");
    const heroLeft = $(".hero__left");
    const primaryButtons = $$(".btn--primary");
    const navLinks = $$('.nav a[href^="#"], .footer a[href^="#"]');
    const sectionLinks = $$('.nav__links a[href^="#"], .footer__links a[href^="#"]');
    const video = $(".commercial-video");

    /* -----------------------------
       Utility
    ------------------------------ */
    const getNavOffset = () => {
      if (!nav) return 90;
      return nav.offsetHeight + 16;
    };

    const scrollToTarget = (target) => {
      if (!target) return;
      const offset = getNavOffset();
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: Math.max(0, y),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    /* -----------------------------
       Smooth scroll for anchor links
    ------------------------------ */
    navLinks.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        scrollToTarget(target);

        if (history.pushState) {
          history.pushState(null, "", href);
        } else {
          window.location.hash = href;
        }
      });
    });

    // If page loads with hash, offset scroll correctly
    if (window.location.hash) {
      const initialTarget = document.querySelector(window.location.hash);
      if (initialTarget) {
        setTimeout(() => scrollToTarget(initialTarget), 60);
      }
    }

    /* -----------------------------
       Navbar background on scroll
    ------------------------------ */
    const setNavBg = () => {
      if (!nav) return;
      if (window.scrollY > 40) {
        nav.style.background = "rgba(5, 5, 8, 0.84)";
        nav.style.borderBottomColor = "rgba(255, 255, 255, 0.1)";
        nav.style.boxShadow = "0 12px 36px rgba(0, 0, 0, 0.28)";
      } else {
        nav.style.background = "rgba(5, 5, 8, 0.56)";
        nav.style.borderBottomColor = "rgba(255, 255, 255, 0.08)";
        nav.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.18)";
      }
    };

    window.addEventListener("scroll", setNavBg, { passive: true });
    setNavBg();

    /* -----------------------------
       Active nav section highlight
    ------------------------------ */
    const sections = $$("section[id], header[id]");

    const setActiveNav = () => {
      const offset = getNavOffset() + 30;
      let currentId = "top";

      sections.forEach((section) => {
        const top = section.offsetTop - offset;
        const bottom = top + section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
          currentId = section.id;
        }
      });

      sectionLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (href === `#${currentId}`) {
          link.style.color = "var(--primary)";
        } else {
          link.style.color = "";
        }
      });
    };

    window.addEventListener("scroll", setActiveNav, { passive: true });
    window.addEventListener("resize", setActiveNav);
    setActiveNav();

    /* -----------------------------
       Reveal on scroll
    ------------------------------ */
    const revealElements = $$(
      ".section__title, .card, .festival-outro, .festival-band, .quick li"
    );

    const injectRevealBase = () => {
      revealElements.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition =
          "opacity 700ms ease, transform 700ms ease, filter 700ms ease";
        el.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
        el.style.filter = "blur(6px)";
        el.style.willChange = "opacity, transform, filter";
      });
    };

    const revealElement = (el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      el.style.filter = "blur(0)";
    };

    if (!reduceMotion && "IntersectionObserver" in window) {
      injectRevealBase();

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealElement(entry.target);
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      revealElements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
    }

    /* -----------------------------
       Primary button glow pulse
    ------------------------------ */
    const pulseStyle = document.createElement("style");
    pulseStyle.textContent = `
      @keyframes festivalBtnPulse {
        0%, 100% {
          box-shadow: 0 18px 60px rgba(255, 90, 0, 0.22);
          transform: translateY(0);
        }
        50% {
          box-shadow: 0 20px 78px rgba(255, 90, 0, 0.34);
          transform: translateY(-1px);
        }
      }

      .btn--pulse {
        animation: festivalBtnPulse 2.8s ease-in-out infinite;
      }

      @keyframes countdownGlow {
        0%, 100% {
          box-shadow:
            0 10px 34px rgba(0, 0, 0, 0.28),
            0 0 0 rgba(255, 176, 0, 0);
        }
        50% {
          box-shadow:
            0 14px 44px rgba(0, 0, 0, 0.34),
            0 0 22px rgba(255, 176, 0, 0.12);
        }
      }

      @keyframes emberFloat {
        0% {
          transform: translate3d(var(--xStart), 120%, 0) scale(var(--s));
          opacity: 0;
        }
        10% {
          opacity: var(--o);
        }
        100% {
          transform: translate3d(var(--xEnd), -40%, 0) scale(var(--s));
          opacity: 0;
        }
      }

      @keyframes emberFlicker {
        0%, 100% {
          filter: blur(0.2px);
          opacity: 0.95;
        }
        50% {
          filter: blur(1.2px);
          opacity: 0.55;
        }
      }
    `;
    document.head.appendChild(pulseStyle);

    if (!reduceMotion) {
      primaryButtons.forEach((btn, index) => {
        btn.classList.add("btn--pulse");
        btn.style.animationDelay = `${index * 180}ms`;
      });
    }

    /* -----------------------------
       Cinematic embers
    ------------------------------ */
    let emberInterval = null;
    let emberLayer = null;

    const startEmbers = () => {
      if (!hero || reduceMotion || emberLayer) return;

      emberLayer = document.createElement("div");
      emberLayer.setAttribute("aria-hidden", "true");
      emberLayer.style.position = "absolute";
      emberLayer.style.inset = "0";
      emberLayer.style.pointerEvents = "none";
      emberLayer.style.overflow = "hidden";
      emberLayer.style.zIndex = "0";
      hero.appendChild(emberLayer);

      if (heroContent) {
        heroContent.style.position = "relative";
        heroContent.style.zIndex = "2";
      }

      const makeEmber = () => {
        if (!emberLayer) return;

        const ember = document.createElement("span");
        const size = 2 + Math.random() * 5;
        const duration = 5200 + Math.random() * 4800;
        const delay = Math.random() * 1400;
        const opacity = 0.32 + Math.random() * 0.5;
        const startX = Math.random() * 100;
        const drift = (Math.random() - 0.5) * 30;
        const endX = Math.max(0, Math.min(100, startX + drift));

        ember.style.position = "absolute";
        ember.style.left = `${startX}%`;
        ember.style.bottom = "-20%";
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;
        ember.style.borderRadius = "999px";
        ember.style.background =
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.96), rgba(255,176,0,0.96), rgba(255,0,106,0.36))";
        ember.style.boxShadow = "0 0 18px rgba(255, 176, 0, 0.38)";
        ember.style.opacity = "0";
        ember.style.setProperty("--xStart", "0%");
        ember.style.setProperty("--xEnd", `${endX - startX}%`);
        ember.style.setProperty("--s", `${0.8 + Math.random() * 1.25}`);
        ember.style.setProperty("--o", `${opacity}`);
        ember.style.animation = `
          emberFloat ${duration}ms linear ${delay}ms forwards,
          emberFlicker ${800 + Math.random() * 900}ms ease-in-out ${delay}ms infinite
        `;

        emberLayer.appendChild(ember);

        window.setTimeout(() => ember.remove(), duration + delay + 200);
      };

      emberInterval = window.setInterval(() => {
        const count = window.innerWidth >= 900 ? 3 : 2;
        for (let i = 0; i < count; i += 1) makeEmber();
      }, 650);
    };

    const stopEmbers = () => {
      if (emberInterval) {
        clearInterval(emberInterval);
        emberInterval = null;
      }
      if (emberLayer) {
        emberLayer.remove();
        emberLayer = null;
      }
    };

    if (!reduceMotion) startEmbers();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (emberInterval) clearInterval(emberInterval);
      } else if (!reduceMotion && hero && emberLayer && !emberInterval) {
        emberInterval = window.setInterval(() => {
          const count = window.innerWidth >= 900 ? 3 : 2;
          for (let i = 0; i < count; i += 1) {
            const ember = document.createElement("span");
            const size = 2 + Math.random() * 5;
            const duration = 5200 + Math.random() * 4800;
            const delay = Math.random() * 1400;
            const opacity = 0.32 + Math.random() * 0.5;
            const startX = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 30;
            const endX = Math.max(0, Math.min(100, startX + drift));

            ember.style.position = "absolute";
            ember.style.left = `${startX}%`;
            ember.style.bottom = "-20%";
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;
            ember.style.borderRadius = "999px";
            ember.style.background =
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.96), rgba(255,176,0,0.96), rgba(255,0,106,0.36))";
            ember.style.boxShadow = "0 0 18px rgba(255, 176, 0, 0.38)";
            ember.style.opacity = "0";
            ember.style.setProperty("--xStart", "0%");
            ember.style.setProperty("--xEnd", `${endX - startX}%`);
            ember.style.setProperty("--s", `${0.8 + Math.random() * 1.25}`);
            ember.style.setProperty("--o", `${opacity}`);
            ember.style.animation = `
              emberFloat ${duration}ms linear ${delay}ms forwards,
              emberFlicker ${800 + Math.random() * 900}ms ease-in-out ${delay}ms infinite
            `;

            emberLayer.appendChild(ember);
            window.setTimeout(() => ember.remove(), duration + delay + 200);
          }
        }, 650);
      }
    });

    window.addEventListener("beforeunload", stopEmbers, { once: true });

    /* -----------------------------
       Hero parallax glow shift
    ------------------------------ */
    if (heroBg && !reduceMotion) {
      let parallaxTicking = false;

      const runParallax = () => {
        const y = Math.min(180, window.scrollY * 0.18);
        heroBg.style.transform = `translate3d(0, ${y * -0.16}px, 0) scale(1.03)`;
        parallaxTicking = false;
      };

      window.addEventListener(
        "scroll",
        () => {
          if (!parallaxTicking) {
            parallaxTicking = true;
            requestAnimationFrame(runParallax);
          }
        },
        { passive: true }
      );

      runParallax();
    }

    /* -----------------------------
       Lens flare shimmer
    ------------------------------ */
    if (hero && !reduceMotion) {
      const flare = document.createElement("div");
      flare.setAttribute("aria-hidden", "true");
      flare.style.position = "absolute";
      flare.style.inset = "-20%";
      flare.style.pointerEvents = "none";
      flare.style.zIndex = "1";
      flare.style.background =
        "linear-gradient(115deg, transparent 35%, rgba(255,176,0,0.11) 45%, rgba(255,90,0,0.16) 50%, rgba(255,0,106,0.11) 55%, transparent 65%)";
      flare.style.filter = "blur(8px)";
      flare.style.opacity = "0";
      flare.style.transform = "translate3d(-25%, 0, 0)";
      flare.style.transition = "opacity 260ms ease";
      flare.style.mixBlendMode = "screen";
      hero.appendChild(flare);

      let lastY = window.scrollY;
      let ticking = false;
      let fadeTimer = null;

      const runFlare = () => {
        const y = window.scrollY;
        const delta = Math.abs(y - lastY);
        lastY = y;

        if (delta > 18) {
          flare.style.opacity = "0.5";
          const x = (y % 800) / 8;
          flare.style.transform = `translate3d(${x - 40}%, 0, 0)`;

          if (fadeTimer) clearTimeout(fadeTimer);
          fadeTimer = window.setTimeout(() => {
            flare.style.opacity = "0";
          }, 240);
        }

        ticking = false;
      };

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(runFlare);
          }
        },
        { passive: true }
      );
    }

    /* -----------------------------
       Commercial video polish
    ------------------------------ */
    if (video) {
      video.setAttribute("playsinline", "");
      video.setAttribute("preload", "metadata");

      video.addEventListener("play", () => {
        const shell = video.closest(".video-shell");
        if (shell) {
          shell.style.boxShadow = "0 22px 70px rgba(255, 90, 0, 0.18)";
          shell.style.transform = "translateY(-2px)";
          shell.style.transition = "box-shadow 220ms ease, transform 220ms ease";
        }
      });

      video.addEventListener("pause", () => {
        const shell = video.closest(".video-shell");
        if (shell) {
          shell.style.boxShadow = "";
          shell.style.transform = "";
        }
      });

      if ("IntersectionObserver" in window && !reduceMotion) {
        const videoObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting && !video.paused) {
                video.pause();
              }
            });
          },
          { threshold: 0.18 }
        );

        videoObserver.observe(video);
      }
    }

    /* -----------------------------
       Dynamic countdown
    ------------------------------ */
    const eventDate = new Date("2026-05-16T18:00:00-04:00").getTime();
    let countdownInterval = null;

    const createCountdown = () => {
      if (!heroLeft || $("#countdown")) return $("#countdown");

      const countdownEl = document.createElement("div");
      countdownEl.id = "countdown";
      countdownEl.setAttribute("aria-live", "polite");
      countdownEl.style.marginTop = "18px";
      countdownEl.style.padding = "12px 14px";
      countdownEl.style.borderRadius = "14px";
      countdownEl.style.border = "1px solid rgba(255, 176, 0, 0.35)";
      countdownEl.style.background = "rgba(0, 0, 0, 0.34)";
      countdownEl.style.backdropFilter = "blur(10px)";
      countdownEl.style.boxShadow = "0 10px 34px rgba(0, 0, 0, 0.28)";
      countdownEl.style.animation = reduceMotion ? "none" : "countdownGlow 3s ease-in-out infinite";

      const label = document.createElement("div");
      label.textContent = "Festival Countdown";
      label.style.fontSize = "0.76rem";
      label.style.fontWeight = "900";
      label.style.textTransform = "uppercase";
      label.style.letterSpacing = "0.16em";
      label.style.color = "rgba(255, 214, 154, 0.94)";
      label.style.marginBottom = "8px";

      const time = document.createElement("div");
      time.className = "countdown__time";
      time.style.fontWeight = "1000";
      time.style.letterSpacing = "0.03em";
      time.style.fontSize = "1rem";
      time.style.color = "rgba(255, 255, 255, 0.95)";

      countdownEl.appendChild(label);
      countdownEl.appendChild(time);

      const ctaRow = $(".cta-row", heroLeft);
      if (ctaRow) {
        heroLeft.insertBefore(countdownEl, ctaRow);
      } else {
        heroLeft.appendChild(countdownEl);
      }

      return countdownEl;
    };

    const updateCountdown = () => {
      const now = Date.now();
      const distance = eventDate - now;
      const countdownEl = createCountdown();
      const timeEl = countdownEl ? $(".countdown__time", countdownEl) : null;

      if (!countdownEl || !timeEl) return;

      if (distance <= 0) {
        timeEl.textContent = "The festival is here.";
        countdownEl.style.borderColor = "rgba(255, 176, 0, 0.55)";
        countdownEl.style.background =
          "linear-gradient(90deg, rgba(255, 176, 0, 0.14), rgba(255, 90, 0, 0.12), rgba(255, 0, 106, 0.12))";
        if (countdownInterval) clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((distance / (1000 * 60)) % 60);
      const secs = Math.floor((distance / 1000) % 60);

      timeEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s until showtime`;
    };

    updateCountdown();
    countdownInterval = window.setInterval(updateCountdown, 1000);

    /* -----------------------------
       Current year fallback
    ------------------------------ */
    const yearEl = $("#year");
    if (yearEl && !yearEl.textContent.trim()) {
      yearEl.textContent = new Date().getFullYear();
    }
  });
})();