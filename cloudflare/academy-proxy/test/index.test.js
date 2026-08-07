import assert from "node:assert/strict";
import test from "node:test";
import { createAcademyProxy, isAcademyPath } from "../src/index.js";

test("matches the Academy boundary without claiming similar main-site paths", () => {
  assert.equal(isAcademyPath("/academy"), true);
  assert.equal(isAcademyPath("/academy/dashboard"), true);
  assert.equal(isAcademyPath("/academy/_next/static/app.js"), true);
  assert.equal(isAcademyPath("/academy/api/session"), true);
  assert.equal(isAcademyPath("/academy-news"), false);
});

test("proxies nested routes and query strings without changing the path", async () => {
  let upstreamRequest;
  const proxy = createAcademyProxy(async (request) => {
    upstreamRequest = request;
    return new Response("academy", { headers: { "Content-Type": "text/plain" } });
  });

  const response = await proxy.fetch(
    new Request("https://cybercookie.org/academy/investigation/INC-2291?tab=timeline"),
  );

  assert.equal(
    upstreamRequest.url,
    "https://aestrea-academy.cybercookie.org/academy/investigation/INC-2291?tab=timeline",
  );
  assert.equal(upstreamRequest.headers.get("X-Forwarded-Host"), "cybercookie.org");
  assert.equal(response.headers.get("X-CyberCookie-Route"), "academy");
  assert.equal(await response.text(), "academy");
});

test("preserves POST bodies for Academy API routes", async () => {
  let body;
  const proxy = createAcademyProxy(async (request) => {
    body = await request.text();
    return Response.json({ ok: true });
  });

  const response = await proxy.fetch(new Request("https://cybercookie.org/academy/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson: 4 }),
  }));

  assert.equal(body, '{"lesson":4}');
  assert.equal(response.status, 200);
});

test("rewrites upstream redirects to the public CyberCookie origin", async () => {
  const proxy = createAcademyProxy(async () => new Response(null, {
    status: 307,
    headers: { Location: "https://aestrea-academy.cybercookie.org/academy/dashboard" },
  }));

  const response = await proxy.fetch(new Request("https://cybercookie.org/academy"));
  assert.equal(response.headers.get("Location"), "https://cybercookie.org/academy/dashboard");
});

test("passes non-Academy paths through unchanged", async () => {
  let received;
  const proxy = createAcademyProxy(async (request) => {
    received = request.url;
    return new Response("main site");
  });

  const response = await proxy.fetch(new Request("https://cybercookie.org/academy-news"));
  assert.equal(received, "https://cybercookie.org/academy-news");
  assert.equal(await response.text(), "main site");
});
