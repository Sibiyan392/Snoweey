import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return json({ error: "no file provided" }, 400);
    }

    // Validate it's an image
    if (!file.type || !file.type.startsWith("image/")) {
      return json({ error: "only image files allowed" }, 400);
    }

    // 8 MB limit
    if (file.size > 8 * 1024 * 1024) {
      return json({ error: "file too large (max 8MB)" }, 400);
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext) ? ext : "jpg";
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

    const store = getStore("snoweey-images");

    // Convert to ArrayBuffer for reliable storage
    const arrayBuffer = await file.arrayBuffer();
    await store.set(id, arrayBuffer, {
      metadata: { contentType: file.type || "image/jpeg" }
    });

    return json({ url: `/api/image?id=${id}` });
  } catch (err) {
    console.error("Upload error:", err);
    return json({ error: "upload failed: " + err.message }, 500);
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export const config = { path: "/api/upload" };