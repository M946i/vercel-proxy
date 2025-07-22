export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // Extract the URL from the query parameters
  const url = new URL(request.url);
  const targetURL = url.searchParams.get('url'); // ?url=xxx

  // If no URL is provided, return an error
  if (!targetURL) {
    return new Response('Missing target URL parameter', { status: 400 });
  }

  // Optionally validate the target URL to prevent SSRF or malicious requests
  try {
    new URL(targetURL); // Ensure the target URL is valid
  } catch (error) {
    return new Response('Invalid target URL', { status: 400 });
  }

  try {
    // Perform the fetch request to the target URL
    const res = await fetch(targetURL, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'POST' ? request.body : null,
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
      },
    });

  } catch (error) {
    // Handle any errors during the fetch
    console.error('Error while fetching the target URL:', error);
    return new Response('Error while fetching the target URL: ',{ status: 500 });
  }
}
