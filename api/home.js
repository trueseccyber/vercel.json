
export async function GET() {
  try {
    const response = await fetch(
      "https://oxfordshirecountyoxfd.my.canva.site/",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Canva website unavailable");
    }

    let html = await response.text();

    const injection = `<script>
(function () {
  const ID = "ocr-live-counter";
  let queued = false;

  function findSlotText() {
    if (!document.body) return null;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    let node;

    while ((node = walker.nextNode())) {
      if (
        !node.parentElement ||
        node.parentElement.closest(
          "script,style,noscript,#" + ID
        )
      ) continue;

      const nodeRect =
        node.parentElement.getBoundingClientRect();

      if (!nodeRect.width || !nodeRect.height) {
        continue;
      }

      const value = (node.nodeValue || "")
        .trim()
        .toLowerCase()
        .replace(/\\s+/g, " ");

      if (value.includes("player counter slot")) {
        return node.parentElement;
      }
    }

    return null;
  }

  function getPlacement() {
    const pageWidth =
      document.documentElement.clientWidth;

    const slot = findSlotText();

    if (slot) {
      const textRect =
        slot.getBoundingClientRect();

      let element = slot.parentElement;

      for (
        let i = 0;
        i < 5 && element;
        i++, element = element.parentElement
      ) {
        const rect =
          element.getBoundingClientRect();

        if (
          rect.width > textRect.width * 1.4 &&
          rect.height > textRect.height * 2.2 &&
          rect.width <= pageWidth * 0.8 &&
          rect.height < rect.width &&
          rect.width / rect.height < 3.5
        ) {
          return rect;
        }
      }

      const width = Math.min(
        pageWidth * (pageWidth < 700 ? 0.88 : 0.45),
        850
      );

      const height = width * 0.58;

      return {
        left:
          textRect.left +
          textRect.width / 2 -
          width / 2,
        top:
          textRect.top +
          textRect.height / 2 -
          height / 2,
        width,
        height
      };
    }

    const width = Math.min(
      pageWidth * (pageWidth < 700 ? 0.88 : 0.45),
      850
    );

    const height = width * 0.58;

    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    return {
      left: pageWidth * 0.05,
      top: pageHeight * 0.84 - window.scrollY,
      width,
      height
    };
  }

  function ensureCounter() {
    if (!document.body) return null;

    let host = document.getElementById(ID);

    if (!host) {
      host = document.createElement("div");
      host.id = ID;

      host.style.cssText =
        "position:absolute;" +
        "z-index:2147483647;" +
        "border:2px solid #ff902c;" +
        "border-radius:18px;" +
        "overflow:hidden;" +
        "background:#151515;" +
        "box-sizing:border-box";

      const frame =
        document.createElement("iframe");

      frame.src = "/counter.html";
      frame.title = "Live Roblox Player Counter";

      frame.style.cssText =
        "display:block;" +
        "width:100%;" +
        "height:100%;" +
        "border:0";

      host.appendChild(frame);
      document.body.appendChild(host);
    }

    return host;
  }

  function update() {
    const host = ensureCounter();
    if (!host) return;

    const rect = getPlacement();

    const x = Math.max(
      0,
      rect.left + window.scrollX
    );

    const y = Math.max(
      0,
      rect.top + window.scrollY
    );

    host.style.left = x + "px";
    host.style.top = y + "px";
    host.style.width = rect.width + "px";
    host.style.height = rect.height + "px";
  }

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(function () {
      queued = false;
      update();
    });
  }

  function start() {
    update();

    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    new MutationObserver(schedule).observe(
      document.documentElement,
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

    const endHead = html
      .toLowerCase()
      .lastIndexOf("</head>");

    html = endHead >= 0
      ? html.slice(0, endHead) +
        injection +
        html.slice(endHead)
      : html + injection;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {
    return new Response(
      "Website temporarily unavailable",
      { status: 502 }
    );
  }
}
