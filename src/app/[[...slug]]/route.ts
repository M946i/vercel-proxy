import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const path = url.pathname.substring(1);
    const targetURL = `https://${path}`;

    try {
        const response = await fetch(targetURL, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"
            }
        });

        // 将 Headers 转为普通对象，并删除可能冲突的 Content-Encoding
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "content-encoding") return; // 避免浏览器解码失败
            headers[key] = value;
        });

        // 将 body 转为 ArrayBuffer 或直接流
        const buffer = await response.arrayBuffer();

        return new Response(buffer, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
        });
    } catch (error) {
        return new Response("Proxy request failed", { status: 500 });
    }
}
