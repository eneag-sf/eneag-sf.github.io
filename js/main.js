(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* hero image fade-in */
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

  /* scroll progress hairline + hero parallax, one rAF loop */
  const progress = document.querySelector(".progress i");
  const media = document.querySelector(".hero-media");
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      if (!reduced && media) {
        const y = Math.min(scrollY, innerHeight);
        media.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
      }
      ticking = false;
    });
  }, { passive: true });

  /* 3D tilt on expertise cards (fine pointers only) */
  if (!reduced && finePointer) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("tilting");
        card.style.transform =
          `perspective(700px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("tilting");
        card.style.transform = "";
      });
    });

    /* magnetic pull on footer pills */
    document.querySelectorAll(".link-pill").forEach((pill) => {
      pill.addEventListener("pointermove", (e) => {
        const r = pill.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        pill.style.transform = `translate(${dx * 0.18}px, ${dy * 0.3 - 3}px)`;
      });
      pill.addEventListener("pointerleave", () => { pill.style.transform = ""; });
    });
  }

  /* Claude Code terminal — two scenes, loops between them */
  const SCENES = [
    {
      title: "claude — enterprise-org",
      lines: [
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
      ],
    },
    {
      title: "claude — b2b-storefront",
      lines: [
        { cls: "t-vio", text: "> ", then: { cls: "t-cmd", text: "Checkout is slow for buyers with 500+ line carts. Find it and fix it", type: true } },
        { gap: 420 },
        { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Grep(CartItemService, classes/**)" } },
        { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Read(classes/CartTotalsCalculator.cls)" } },
        { cls: "t-dim", text: "  └ found it: price lookup runs one SOQL per cart line" },
        { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Edit(classes/CartTotalsCalculator.cls)" } },
        { cls: "t-dim", text: "  └ bulk price map · one query for the whole cart" },
        { cls: "t-blue", text: "⏺ ", then: { cls: "t-cmd", text: "Bash(sf apex run test --tests CartTotalsCalculatorTest)" } },
        { cls: "t-ok", text: "  ✓ checkout p95: 8.4s → 1.2s on a 500-line cart" },
        { gap: 500 },
        { cls: "t-cmd", text: "Buyers won’t wait. Now they don’t have to." },
      ],
    },
  ];

  const body = document.getElementById("term-body");
  const titleEl = document.getElementById("term-title");

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

  function renderInstant() {
    body.innerHTML = "";
    for (const line of SCENES[0].lines) {
      if (line.gap) continue;
      body.appendChild(buildLine(line));
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeInto(span, text, speed = 26) {
    for (const ch of text) {
      span.textContent += ch;
      await sleep(speed + Math.random() * 24);
    }
  }

  async function playScene(scene) {
    titleEl.textContent = scene.title;
    body.innerHTML = "";
    const caret = document.createElement("span");
    caret.className = "t-caret";
    for (const line of scene.lines) {
      if (line.gap) { await sleep(line.gap); continue; }
      const div = document.createElement("div");
      const a = document.createElement("span");
      a.className = line.cls;
      a.textContent = line.text;
      div.appendChild(a);
      body.appendChild(div);
      div.appendChild(caret);
      if (line.then) {
        const b = document.createElement("span");
        b.className = line.then.cls;
        div.insertBefore(b, caret);
        if (line.then.type) {
          await typeInto(b, line.then.text);
          await sleep(300);
        } else {
          b.textContent = line.then.text;
          await sleep(230);
        }
      } else {
        await sleep(230);
      }
    }
  }

  async function playLoop() {
    let i = 0;
    for (;;) {
      await playScene(SCENES[i % SCENES.length]);
      await sleep(5200);
      i++;
    }
  }

  if (reduced) {
    renderInstant();
  } else {
    const tio = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          tio.disconnect();
          playLoop();
        }
      },
      { threshold: 0.4 }
    );
    tio.observe(document.querySelector(".terminal"));
  }
})();
