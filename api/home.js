
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

    const counterScript = `
<script>
(function () {
  const ID = "ocr-live-counter";
  let counter;
  let placeholder;
  let scheduled = false;

  function findPlaceholder() {
    if (placeholder && placeholder.isConnected) {
      return placeholder;
    }

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    let node;

    while ((node = walker.nextNode())) {
      if (
        node.nodeValue &&
        /player\\s+counter\\s+slot/i.test(node.nodeValue)
      ) {
        placeholder = node.parentElement;
        return placeholder;
      }
    }

    return null;
  }

  function getSlotBox(element) {
    const text = element.getBoundingClientRect();
    let parent = element;

    while (parent && parent !== document.body) {
      const box = parent.getBoundingClientRect();
      const ratio = box.width / Math.max(box.height, 1);

      if (
        box.width >= text.width * 1.35 &&
        box.height >= Math.max(40, text.height * 2.6) &&
        box.width <= window.innerWidth * 0.8 &&
        ratio >= 1.4 &&
        ratio <= 2.7
      ) {
        return box;
      }

      parent = parent.parentElement;
    }

    const width = window.innerWidth < 700
      ? window.innerWidth * 0.85
      : window.innerWidth * 0.45;

    const height = width * 0.58;

    return {
      left: text.left + text.width / 2 - width / 2,
      top: text.top + text.height / 2 - height / 2,
      width: width,
      height: height
    };
  }

  function updatePosition() {
    if (!counter) return;

    const target = findPlaceholder();
    let x, y, width, height;

    if (target) {
      const box = getSlotBox(target);

      width = box.width;
      height = box.height;

      x = box.left + window.scrollX;
      y = box.top + window.scrollY;

    } else {
      width = window.innerWidth < 700
        ? window.innerWidth * 0.85
        : window.innerWidth * 0.45;

      height = width * 0.58;

      x = window.innerWidth * 0.05;
      y = Math.max(
        0,
        document.documentElement.scrollHeight -
        height - 180
      );
    }

    x = Math.max(0, x);

    Object.assign(counter.style, {
      position: "absolute",
      left: x + "px",
      top: y + "px",
      width: width + "px",
      height: height + "px"
    });
  }

  function schedulePosition() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(function () {
      scheduled = false;
      updatePosition();
    });
  }

  function start() {
    if (!document.body) return;

    counter = document.getElementById(ID);

    if (!counter) {
      counter = document.createElement("div");
      counter.id = ID;

      Object.assign(counter.style, {
        position: "absolute",
        background: "#151515",
        border: "2px solid #ff902c",
        borderRadius: "18px",
        overflow: "hidden",
        zIndex: "2147483647"
      });

      const frame = document.createElement("iframe");
      frame.src = "/counter.html";
      frame.title = "Live Roblox Player Counter";

      Object.assign(frame.style, {
        width: "100%",
        height: "100%",
        border: "none",
        display: "block"
      });

      counter.appendChild(frame);
      document.body.appendChild(counter);
    }

    updatePosition();

    window.addEventListener("resize", schedulePosition);
    window.addEventListener("scroll", schedulePosition, {
      passive: true
    });
    window.addEventListener("load", schedulePosition);

    new MutationObserver(schedulePosition).observe(
      document.body,
      { childList: true, subtree: true }
    );

    setTimeout(schedulePosition, 1000);
    setTimeout(schedulePosition, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
</script>`;

    if (/<\\/head\\s*>/i.test(html)) {
      html = html.replace(
        /<\\/head\\s*>/i,
        counterScript + "</head>"
      );
    } else {
      html += counterScript;
    }

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
