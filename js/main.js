(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* hero image fade-in (blur-up from gradient placeholder) */
  const hero = document.querySelector(".hero");
  const heroImg = document.querySelector(".hero-media img");
  if (heroImg.complete) hero.classList.add("ready");
  else heroImg.addEventListener("load", () => hero.classList.add("ready"), { once: true });

  /* scroll reveals — stagger siblings inside a .reveal-group */
  document.querySelectorAll(".reveal-group").forEach((group) => {
    group.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.setProperty("--d", `${i * 90}ms`);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* subtle hero parallax (transform-only, rAF-throttled) */
  const media = document.querySelector(".hero-media");
  if (!reduced && media) {
    let ticking = false;
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(scrollY, innerHeight);
        media.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* Claude Code terminal — types when scrolled into view */
  const LINES = [
    { cls: "t-dim", text: "~/clients/enterprise-org $ ", then: { cls: "t-cmd", text: "claude", type: true } },
    { cls: "t-vio", text: "> ", then: { cls: "t-cmd", text: "Refactor OpportunityTrigger into a handler class and cover it with tests", type: true } },
    { gap: 420 },
    { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Read(triggers/OpportunityTrigger.trigger)" } },
    { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Write(classes/OpportunityTriggerHandler.cls)" } },
    { cls: "t-dim", text: "  └ bulk-safe · one trigger, one handler · no SOQL in loops" },
    { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Write(classes/OpportunityTriggerHandlerTest.cls)" } },
    { cls: "t-dim", text: "  └ 12 tests · bulk, recursion & CRUD/FLS paths" },
    { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Bash(sf apex run test --code-coverage)" } },
    { cls: "t-ok", text: "  ✓ 12/12 passing · 94% coverage" },
    { gap: 500 },
    { cls: "t-cmd", text: "Architecture holds. Ready: ", then: { cls: "t-blue", text: "sf project deploy start" } },
  ];

  const body = document.getElementById("term-body");

  function renderInstant() {
    body.innerHTML = "";
    for (const line of LINES) {
      if (line.gap) continue;
      body.appendChild(buildLine(line));
    }
  }

  function buildLine(line) {
    const div = document.createElement("div");
    const a = document.createElement("span");
    a.className = line.cls;
    a.textContent = line.text;
    div.appendChild(a);
    if (line.then) {
      const b = document.createElement("span");
      b.className = line.then.cls;
      b.textContent = line.then.text;
      div.appendChild(b);
    }
    return div;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeInto(span, text, caret, speed = 26) {
    for (const ch of text) {
      span.textContent += ch;
      await sleep(speed + Math.random() * 24);
    }
    void caret;
  }

  async function play() {
    const caret = document.createElement("span");
    caret.className = "t-caret";
    for (const line of LINES) {
      if (line.gap) { await sleep(line.gap); continue; }
      const div = document.createElement("div");
      const a = document.createElement("span");
      a.className = line.cls;
      div.appendChild(a);
      body.appendChild(div);
      div.appendChild(caret);

      if (line.then && line.then.type) {
        a.textContent = line.text;
        const b = document.createElement("span");
        b.className = line.then.cls;
        div.insertBefore(b, caret);
        await typeInto(b, line.then.text, caret);
        await sleep(300);
      } else {
        a.textContent = line.text;
        if (line.then) {
          const b = document.createElement("span");
          b.className = line.then.cls;
          b.textContent = line.then.text;
          div.insertBefore(b, caret);
        }
        await sleep(230);
      }
    }
  }

  if (reduced) {
    renderInstant();
  } else {
    const tio = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          tio.disconnect();
          play();
        }
      },
      { threshold: 0.4 }
    );
    tio.observe(document.querySelector(".terminal"));
  }
})();
