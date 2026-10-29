
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

    const counter = `
<iframe
  src="/counter.html"
  title="Live Roblox Player Counter"
  style="
    position: absolute;
    top: 226vw;
    left: 5vw;
    width: 45vw;
    height: 26.5vw;
    border: none;
    background: transparent;
    z-index: 2147483647;
  "
></iframe>

    `;

    html = html.replace(
      /<\/body>/i,
      counter + "</body>"
    );

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
