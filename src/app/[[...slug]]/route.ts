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

  // 例如：/api/proxy?url=https://aaa/?xxx=xxx
  const target = url.searchParams.get("url");
  if (!target) {
    return new Response("Missing url param", { status: 400 });
  }

  const targetUrl = new URL(target);

  // 复制 headers
  const headers = new Headers(req.headers);

  // ⚠️ 关键：修改 Host
  headers.set("host", targetUrl.host);

  // 可选：伪装来源
  headers.set("origin", targetUrl.origin);
  headers.set("referer", targetUrl.origin);

  const response = await fetch(targetUrl.toString(), {
    method: req.method,
    headers,
    body: req.body, // 透传请求体
    redirect: "manual"
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers
  });
}
