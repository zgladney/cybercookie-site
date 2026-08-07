const ACADEMY_PREFIX = "/academy";
const ACADEMY_ORIGIN = "https://aestrea-academy.cybercookie.org";

export function isAcademyPath(pathname) {
  return pathname === ACADEMY_PREFIX || pathname.startsWith(`${ACADEMY_PREFIX}/`);
}

function rewriteLocation(location, publicUrl) {
  if (!location) return location;

  const resolved = new URL(location, ACADEMY_ORIGIN);
  if (resolved.origin !== ACADEMY_ORIGIN) return location;

  return `${publicUrl.origin}${resolved.pathname}${resolved.search}${resolved.hash}`;
}

function rewriteCookieDomain(cookie) {
  return cookie.replace(
    /Domain=\.?aestrea-academy\.cybercookie\.org/gi,
    "Domain=cybercookie.org",
  );
}

export function createAcademyProxy(upstreamFetch = fetch) {
  return {
    async fetch(request) {
      const publicUrl = new URL(request.url);

      // The Cloudflare route ends in `academy*` so queries on `/academy` match.
      // Explicitly pass similarly named paths, such as `/academy-news`, through
      // to the existing cybercookie.org origin Worker.
      if (!isAcademyPath(publicUrl.pathname)) return upstreamFetch(request);

      const upstreamUrl = new URL(
        `${publicUrl.pathname}${publicUrl.search}`,
        ACADEMY_ORIGIN,
      );
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("X-Forwarded-Host", publicUrl.host);
      requestHeaders.set("X-Forwarded-Proto", publicUrl.protocol.slice(0, -1));
      requestHeaders.set("X-CyberCookie-Public-Origin", publicUrl.origin);

      const upstreamRequest = new Request(upstreamUrl, {
        method: request.method,
        headers: requestHeaders,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        duplex: "half",
        redirect: "manual",
      });
      const upstreamResponse = await upstreamFetch(upstreamRequest);
      const responseHeaders = new Headers(upstreamResponse.headers);

      const location = responseHeaders.get("Location");
      if (location) responseHeaders.set("Location", rewriteLocation(location, publicUrl));

      if (typeof responseHeaders.getSetCookie === "function") {
        const cookies = responseHeaders.getSetCookie();
        if (cookies.length) {
          responseHeaders.delete("Set-Cookie");
          for (const cookie of cookies) {
            responseHeaders.append("Set-Cookie", rewriteCookieDomain(cookie));
          }
        }
      }

      responseHeaders.set("X-CyberCookie-Route", "academy");
      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        headers: responseHeaders,
      });
    },
  };
}

export default createAcademyProxy();
