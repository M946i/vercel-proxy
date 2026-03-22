export const runtime = 'edge';

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}

export async function PUT(req: Request) {
  return handle(req);
}

export async function DELETE(req: Request) {
  return handle(req);
}

async function handle(req: Request) {
  const fullUrl = req.url;

  // 提取 ?url= 后面的所有内容
  const match = fullUrl.match(/\?url=(.*)/);
  if (!match || !match[1]) {
    return new Response("Missing url param", { status: 400 });
  }

  const target = decodeURIComponent(match[1]); // 解码
  let targetUrl: URL;

  try {
    targetUrl = new URL(target);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  const headers = new Headers();

  const response = await fetch(targetUrl.toString(), {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    redirect: "manual",
  });

  const resHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-encoding") return;
    resHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    headers: resHeaders,
  });
}
