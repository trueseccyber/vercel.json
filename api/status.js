
export async function GET() {
  const apiKey = process.env.OXFD_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "API key not configured" },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      "https://api.oxfd.re/v1/server",
      {
        headers: {
          "server-key": apiKey
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!response.ok) {
      throw new Error("API unavailable");
    }

    const data = await response.json();

    const online =
      String(data.Status).toLowerCase() === "online";

    return Response.json(
      {
        online,
        players: online ? data.CurrentPlayers : 0,
        maxPlayers: data.MaxPlayers
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15"
        }
      }
    );

  } catch (error) {
    return Response.json(
      { error: "Unable to fetch players" },
      { status: 502 }
    );
  }
}
