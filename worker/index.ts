/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher;
}

const worker: ExportedHandler<Env> = {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname == "/ah") {
      const resp = await fetch("https://moulberry.codes/lowestbin.json");
      if (!resp.ok) {
        return new Response(`Moulberry is ${resp.status}ing`, { status: 500 });
      }

      return new Response(resp.body, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
