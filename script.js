/* =====================================
   ALL MUSIC FESTIVAL — CINEMATIC SCRIPT
   (smooth scroll + reveal + glow pulse +
    embers + parallax glow + lens flare)
===================================== */

(() => {
  // Guard: run after DOM is ready
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  onReady(() => {
    /* -----------------------------
       Smooth scroll for anchor links
    ------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId && targetId.length > 1) {
          const target = document.querySelector(targetId);
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    /* -----------------------------
       Navbar background change on scroll
    ------------------------------ */
    const nav = document.querySelector(".nav");
    const setNavBg = () => {
      if (!nav) return;
      nav.style.background =
        window.scrollY > 50 ? "rgba(0,0,0,0.82)" : "rgba(0,0,0,0.45)";
    };
    window.addEventListener("scroll", setNavBg, { passive: true });
    setNavBg();

    /* -----------------------------
       Reveal on scroll (cards + titles)
    ------------------------------ */
    const revealElements = document.querySelectorAll(".card, .section__title");
    revealElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(34px)";
      el.style.transition = "opacity 650ms ease, transform 650ms ease";
      el.style.willChange = "opacity, transform";
    });

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < windowHeight - 110) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll, { passive: true });
    window.addEventListener("load", revealOnScroll);
    revealOnScroll();

    /* -----------------------------
       Subtle button glow pulse
    ------------------------------ */
    const primaryButtons = document.querySelectorAll(".btn--primary");
    primaryButtons.forEach((btn) => {
      // Make it cinematic (no harsh flashing)
      setInterval(() => {
        btn.style.boxShadow = "0 18px 70px rgba(255, 90, 0, 0.35)";
        setTimeout(() => {
          btn.style.boxShadow = "0 18px 60px rgba(255, 90, 0, 0.22)";
        }, 900);
      }, 2600);
    });

    /* -----------------------------
       Cinematic embers (floating particles)
       - lightweight, no canvas
       - respects prefers-reduced-motion
    ------------------------------ */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector(".hero");
    if (hero && !reduceMotion) {
      const emberLayer = document.createElement("div");
      emberLayer.setAttribute("aria-hidden", "true");
      emberLayer.style.position = "absolute";
      emberLayer.style.inset = "0";
      emberLayer.style.pointerEvents = "none";
      emberLayer.style.overflow = "hidden";
      emberLayer.style.zIndex = "0";
      hero.appendChild(emberLayer);

      // Ensure hero content stays above embers
      const heroContent = document.querySelector(".hero__content");
      if (heroContent) {
        heroContent.style.position = "relative";
        heroContent.style.zIndex = "2";
      }

      // Inject keyframes once
      const styleTag = document.createElement("style");
      styleTag.textContent = `
        @keyframes emberFloat {
          0%   { transform: translate3d(var(--xStart), 120%, 0) scale(var(--s)); opacity: 0; }
          12%  { opacity: var(--o); }
          100% { transform: translate3d(var(--xEnd), -40%, 0) scale(var(--s)); opacity: 0; }
        }
        @keyframes emberFlicker {
          0%,100% { filter: blur(0.2px); opacity: 0.95; }
          50%     { filter: blur(1.2px); opacity: 0.55; }
        }
      `;
      document.head.appendChild(styleTag);

      const makeEmber = () => {
        const ember = document.createElement("span");
        const size = 2 + Math.random() * 5; // px
        const duration = 5200 + Math.random() * 5200; // ms
        const delay = Math.random() * 1600; // ms
        const opacity = 0.35 + Math.random() * 0.5;

        const startX = Math.random() * 100; // vw-ish
        const drift = (Math.random() - 0.5) * 30; // %
        const endX = Math.max(0, Math.min(100, startX + drift));

        ember.style.position = "absolute";
        ember.style.left = `${startX}%`;
        ember.style.bottom = "-20%";
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;
        ember.style.borderRadius = "999px";
        ember.style.background =
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,176,0,0.95), rgba(255,0,106,0.35))";
        ember.style.boxShadow = "0 0 18px rgba(255, 176, 0, 0.35)";
        ember.style.opacity = "0";

        ember.style.setProperty("--xStart", "0%");
        ember.style.setProperty("--xEnd", `${endX - startX}%`);
        ember.style.setProperty("--s", `${0.75 + Math.random() * 1.35}`);
        ember.style.setProperty("--o", `${opacity}`);

        ember.style.animation = `
          emberFloat ${duration}ms linear ${delay}ms forwards,
          emberFlicker ${800 + Math.random() * 900}ms ease-in-out ${delay}ms infinite
        `;

        emberLayer.appendChild(ember);

        // Cleanup after animation ends
        setTimeout(() => {
          ember.remove();
        }, duration + delay + 200);
      };

      // Spawn rate
      const emberInterval = setInterval(() => {
        // Keep it light; scale up on desktop a bit
        const count = window.innerWidth >= 900 ? 3 : 2;
        for (let i = 0; i < count; i++) makeEmber();
      }, 650);

      // Stop embers if hero removed (safety)
      window.addEventListener(
        "beforeunload",
        () => clearInterval(emberInterval),
        { once: true }
      );
    }

    /* -----------------------------
       Parallax glow shift (hero background)
       - subtle movement tied to scroll
    ------------------------------ */
    const heroBg = document.querySelector(".hero__bg");
    if (heroBg && !reduceMotion) {
      const parallax = () => {
        const y = Math.min(120, window.scrollY * 0.15);
        heroBg.style.transform = `translate3d(0, ${y * -0.15}px, 0) scale(1.03)`;
      };
      window.addEventListener("scroll", parallax, { passive: true });
      parallax();
    }

    /* -----------------------------
       Lens flare shimmer (in hero)
    ------------------------------ */
    if (!reduceMotion) {
      const flare = document.createElement("div");
      flare.setAttribute("aria-hidden", "true");
      flare.style.position = "absolute";
      flare.style.inset = "-20%";
      flare.style.pointerEvents = "none";
      flare.style.zIndex = "1";
      flare.style.background =
        "linear-gradient(115deg, transparent 35%, rgba(255,176,0,0.12) 45%, rgba(255,90,0,0.18) 50%, rgba(255,0,106,0.12) 55%, transparent 65%)";
      flare.style.filter = "blur(8px)";
      flare.style.opacity = "0.0";
      flare.style.transform = "translate3d(-25%, 0, 0) rotate(0deg)";
      flare.style.transition = "opacity 280ms ease";
      flare.style.mixBlendMode = "screen";

      const heroEl = document.querySelector(".hero");
      if (heroEl) heroEl.appendChild(flare);

      let lastY = window.scrollY;
      let ticking = false;

      const runFlare = () => {
        const y = window.scrollY;
        const delta = Math.abs(y - lastY);
        lastY = y;

        // show flare briefly on bigger scroll moves
        if (delta > 18) {
          flare.style.opacity = "0.55";
          const x = (y % 800) / 8; // 0..100-ish
          flare.style.transform = `translate3d(${x - 40}%, 0, 0) rotate(0deg)`;
          clearTimeout(runFlare._t);
          runFlare._t = setTimeout(() => {
            flare.style.opacity = "0.0";
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
       Dynamic countdown
       (set your real event date/time here)
    ------------------------------ */
    const eventDate = new Date("May 16, 2026 18:00:00").getTime();

    const countdown = () => {
      const now = Date.now();
      const distance = eventDate - now;

      // If passed, hide
      if (distance <= 0) {
        const el = document.getElementById("countdown");
        if (el) el.remove();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      let countdownEl = document.getElementById("countdown");
      const host = document.querySelector(".hero__left");

      if (!countdownEl && host) {
        countdownEl = document.createElement("div");
        countdownEl.id = "countdown";
        countdownEl.style.marginTop = "18px";
        countdownEl.style.fontWeight = "900";
        countdownEl.style.letterSpacing = "0.04em";
        countdownEl.style.textTransform = "uppercase";
        countdownEl.style.color = "rgba(255, 255, 255, 0.92)";
        countdownEl.style.padding = "10px 12px";
        countdownEl.style.borderRadius = "12px";
        countdownEl.style.border = "1px solid rgba(255, 176, 0, 0.35)";
        countdownEl.style.background = "rgba(0,0,0,0.35)";
        countdownEl.style.boxShadow = "0 10px 40px rgba(0,0,0,0.35)";
        host.appendChild(countdownEl);
      }

      if (countdownEl) {
        countdownEl.textContent = `Starts in ${days}d ${hours}h ${mins}m ${secs}s`;
      }
    };

    setInterval(countdown, 1000);
    countdown();
  });
})();