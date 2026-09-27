import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return new Response("Missing id", { status: 400 });

  // Prevent path traversal
  if (id.includes("/") || id.includes("..")) {
    return new Response("Invalid id", { status: 400 });
  }

  try {
    const store = getStore("snoweey-images");
    const blob = await store.get(id, { type: "arrayBuffer" });

    if (!blob) return new Response("Not found", { status: 404 });

    const meta = await store.getMetadata(id);
    const contentType = meta?.metadata?.contentType || "image/jpeg";

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (err) {
    console.error("Image serve error:", err);
    return new Response("Error", { status: 500 });
  }
};

export const config = { path: "/api/image" };