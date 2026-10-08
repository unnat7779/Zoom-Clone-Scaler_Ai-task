import { type NextRequest, NextResponse } from "next/server";

// Fallback to the live Render backend
const BACKEND_BASE = (process.env.BACKEND_API_URL || "https://zoom-clone-backend-zwie.onrender.com").replace(/\/+$/, "");
// The origin allowed by Render's CORS configuration
const ALLOWED_ORIGIN = "https://frontend-bay-beta-22.vercel.app";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const subpath = path.join("/");
  const targetUrl = new URL(`${BACKEND_BASE}/api/${subpath}`);
  targetUrl.search = request.nextUrl.search;

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    // Always supply the origin expected by the Render backend so CORS never blocks the request
    Origin: ALLOWED_ORIGIN,
  };

  const contentType = request.headers.get("content-type");
  if (contentType) {
    reqHeaders["Content-Type"] = contentType;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    reqHeaders["Authorization"] = authHeader;
  }

  const isBodyAllowed = !["GET", "HEAD"].includes(request.method);
  let body: ArrayBuffer | undefined = undefined;
  if (isBodyAllowed) {
    try {
      body = await request.arrayBuffer();
    } catch {
      // no body
    }
  }

  try {
    const upstreamRes = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: reqHeaders,
      body,
      cache: "no-store",
    });

    const resHeaders = new Headers();
    upstreamRes.headers.forEach((val, key) => {
      // Do not forward upstream cors headers, we will inject open ones
      if (!key.toLowerCase().startsWith("access-control-")) {
        resHeaders.set(key, val);
      }
    });

    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    resHeaders.set("Access-Control-Allow-Headers", "*");

    const contentType = upstreamRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const text = await upstreamRes.text();
      const transformed = text
        .replaceAll("Alex Morgan", "Unnat Agrawal")
        .replaceAll("alex.morgan@example.com", "agrawanunnat.ieee@gmail.com")
        .replaceAll(`"initials":"AM"`, `"initials":"UA"`)
        .replaceAll(`"initials": "AM"`, `"initials": "UA"`);
      resHeaders.delete("content-encoding");
      resHeaders.delete("content-length");
      return new NextResponse(transformed, {
        status: upstreamRes.status,
        statusText: upstreamRes.statusText,
        headers: resHeaders,
      });
    }

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: resHeaders,
    });
  } catch (err) {
    console.error("Backend proxy error:", err);
    return NextResponse.json(
      { error: { code: "UPSTREAM_ERROR", message: "Failed to connect to backend server. It may be waking up." } },
      { status: 502, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
