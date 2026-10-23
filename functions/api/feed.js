export async function onRequest(context) {
  const urlParam = new URL(context.request.url).searchParams.get("url");
  if (!urlParam) {
    return new Response("Missing URL parameter", { status: 400 });
  }

  try {
    const feedResponse = await fetch(urlParam, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) nciselliott.xyz RSS Reader"
      }
    });

    if (!feedResponse.ok) {
      return new Response(`Target feed returned HTTP error ${feedResponse.status}`, { status: feedResponse.status });
    }

    const xmlText = await feedResponse.text();

    return new Response(xmlText, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(`Failed to fetch feed: ${err.message}`, { status: 500 });
  }
}