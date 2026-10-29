
export async function GET() {
  try {
    const response = await fetch(
      "https://oxfordshirecountyoxfd.my.canva.site/",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Canva returned " + response.status);
    }

    let html = await response.text();

    const css = `<style>
#ocr-live-counter {
  width: min(420px, 90vw) !important;
  height: 170px !important;
  min-height: 0 !important;
  max-width: 420px !important;
  position: absolute !important;
}


#ocr-live-counter iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 700px) {
  #ocr-live-counter {
    left: 4vw;
    width: 92vw;
    height: 54vw;
  }
}
</style>`;

    const counter = `<div id="ocr-live-counter">
  <iframe
    src="/counter.html"
    title="Live Roblox Player Counter"
  ></iframe>
</div>`;

    const script = `<script>
(function () {
  const ID = "ocr-live-counter";
  let pending = false;

  function findSlot() {
    const elements =
      document.querySelectorAll("span,p,div");

    for (const el of elements) {
      if (el.closest("#" + ID)) continue;

      const text = el.textContent
        .trim()
        .toLowerCase();

      if (
        text === "player counter slot" &&
        el.getBoundingClientRect().width > 0
      ) {
        return el;
      }
    }

    return null;
  }

  function ensureCounter() {
    if (!document.body) return null;

    let host = document.getElementById(ID);

    if (!host) {
      host = document.createElement("div");
      host.id = ID;

      const frame =
        document.createElement("iframe");

      frame.src = "/counter.html";
      frame.title = "Live Roblox Player Counter";

      host.appendChild(frame);
      document.body.appendChild(host);
    }

    return host;
  }

  function positionCounter() {
    const host = ensureCounter();
    const label = findSlot();

    if (!host || !label) return;

    const labelBox = label.getBoundingClientRect();
    let target = label;

    for (let i = 0; i < 5; i++) {
      const parent = target.parentElement;

      if (!parent || parent === document.body) {
        break;
      }

      const box = parent.getBoundingClientRect();

      if (
        box.width > labelBox.width * 1.4 &&
        box.height > labelBox.height * 2 &&
        box.width <= innerWidth * 0.7 &&
        box.width / Math.max(1, box.height) < 3.5
      ) {
        target = parent;
        break;
      }

      target = parent;
    }

    const box = target.getBoundingClientRect();

    const fullBox =
      box.width > labelBox.width * 1.4 &&
      box.height > labelBox.height * 2;

    const width = fullBox
      ? box.width
      : Math.min(innerWidth * 0.46, 850);

    const height = fullBox
      ? box.height
      : width * 0.58;

    const left = fullBox
      ? box.left
      : labelBox.left +
        (labelBox.width - width) / 2;

    const top = fullBox
      ? box.top
      : labelBox.top +
        (labelBox.height - height) / 2;

    host.style.left =
      Math.max(0, left + scrollX) + "px";

    host.style.top =
      Math.max(0, top + scrollY) + "px";

    host.style.width = width + "px";
    host.style.height = height + "px";
  }

  function schedule() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(function () {
      pending = false;
      positionCounter();
    });
  }

  function start() {
    schedule();

    addEventListener("resize", schedule);
    addEventListener("load", schedule);

    new MutationObserver(schedule).observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

    setTimeout(schedule, 1500);
    setTimeout(schedule, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }
})();
</script>`;

    html = html.replace(
      /<\/head>/i,
      css + script + "</head>"
    );

    if (/<\/body>/i.test(html)) {
      html = html.replace(
        /<\/body>/i,
        counter + "</body>"
      );
    } else {
      html += css + counter + script;
    }

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {
    return new Response(
      "Could not load Canva website: " + error.message,
      { status: 502 }
    );
  }
}
