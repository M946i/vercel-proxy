export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: { url: string | URL; method: string; headers: any; body: BodyInit | null | undefined; }) {
  // Extract the URL from the query parameters
  const url = new URL(request.url);
  const targetURL = url.searchParams.get('url'); // ?url=xxx

  // If no URL is provided, return an error
  if (!targetURL) {
    return new Response('Missing target URL parameter', { status: 400 });
  }

  try {
    // Perform the fetch request to the target URL
    const res = await fetch(targetURL, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'POST' ? request.body : null
    });

    // Check if the fetch request was successful
    if (!res.ok) {
      return new Response('Failed to fetch the target URL', { status: res.status });
    }

    // Return the response back to the client
    const responseBody = await res.text();
    return new Response(responseBody, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'text/html',
      }
    });

  } catch (error) {
    // Handle any errors during the fetch
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return new Response('Error while fetching the target URL: ' + error.message, { status: 500 });
  }
}
