
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
  function showCounter() {
    if (!document.body) return;

    if (document.getElementById("ocr-live-counter")) {
      return;
    }

    const container = document.createElement("div");
    container.id = "ocr-live-counter";

    Object.assign(container.style, {
      position: "fixed",
      top: "80px",
      right: "15px",
      width: "min(400px, calc(100vw - 30px))",
      height: "170px",
      zIndex: "2147483647",
      background: "#151515",
      border: "2px solid #ff902c",
      borderRadius: "18px",
      overflow: "hidden"
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

    container.appendChild(frame);
    document.body.appendChild(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      showCounter
    );
  } else {
    showCounter();
  }

  new MutationObserver(showCounter).observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );
})();
</script>`;

    if (/<\/head\s*>/i.test(html)) {
      html = html.replace(
        /<\/head\s*>/i,
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
