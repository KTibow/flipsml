export const onRequest: PagesFunction = async (context) => {
  const resp = await fetch("https://moulberry.codes/lowestbin.json");
  if (!resp.ok) {
    return new Response(resp.statusText, { status: 500 });
  }
  return new Response(resp.body, { status: 200, headers: { "Content-Type": "application/json" } });
};
