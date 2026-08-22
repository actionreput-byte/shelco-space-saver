import { createFileRoute } from "@tanstack/react-router";
import { SERVICES } from "@/lib/services-data";
import { BLOG_POSTS } from "@/lib/blog-data";

const SITE = "https://shelco-space-saver.lovable.app";

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls: { loc: string; priority: string; lastmod: string }[] = [
    { loc: `${SITE}/`, priority: "1.0", lastmod: today },
    { loc: `${SITE}/services`, priority: "0.9", lastmod: today },
    { loc: `${SITE}/shop`, priority: "0.8", lastmod: today },
    { loc: `${SITE}/blog`, priority: "0.8", lastmod: today },
    { loc: `${SITE}/get-app`, priority: "0.5", lastmod: today },
    ...SERVICES.map((s) => ({
      loc: `${SITE}/services/${s.slug}`,
      priority: "0.9",
      lastmod: today,
    })),
    ...BLOG_POSTS.map((p) => ({
      loc: `${SITE}/blog/${p.slug}`,
      priority: "0.7",
      lastmod: p.date,
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
