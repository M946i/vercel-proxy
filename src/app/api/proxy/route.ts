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
  const url = new URL(req.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing url param", { status: 400 });
  }

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

  // ✅ 复制响应 headers
  const resHeaders = new Headers();
  response.headers.forEach((value, key) => {
    // 可选：过滤一些有问题的 header
    if (key.toLowerCase() === "content-encoding") return;
    resHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    headers: resHeaders,
  });
}
