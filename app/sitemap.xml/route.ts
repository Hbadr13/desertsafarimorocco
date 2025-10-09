import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Category, Tour, Package } from "@/lib/models";

const LANGS = ["en", "fr", "es"];
const SITE_URL = 'https://desertsafarismarrakech.com';
export async function GET() {
    const db = await getDatabase();
    const categories = await db.collection<Category>("categories").find({}).toArray();
    const tours = await db.collection<Tour>("tours").find({}).toArray();
    const packages = await db.collection<Package>("packages").find({}).toArray();

    let urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

    const now = new Date().toISOString();

    LANGS.forEach(lang => {
        urls.push({ loc: `${SITE_URL}/${lang}`, lastmod: now, changefreq: "daily", priority: "1.0" });
        urls.push({ loc: `${SITE_URL}/${lang}/categories`, lastmod: now, changefreq: "weekly", priority: "0.9" });
        urls.push({ loc: `${SITE_URL}/${lang}/about`, lastmod: now, changefreq: "yearly", priority: "0.5" });
        urls.push({ loc: `${SITE_URL}/${lang}/contact`, lastmod: now, changefreq: "yearly", priority: "0.5" });
    });

    // Category pages
    categories.forEach(category => {
        LANGS.forEach(lang => {
            urls.push({
                loc: `${SITE_URL}/${lang}/categories/${category.slug}`,
                lastmod: now,
                changefreq: "weekly",
                priority: "0.8"
            });
        });
    });

    // Tour pages
    tours.forEach(tour => {
        LANGS.forEach(lang => {
            urls.push({
                loc: `${SITE_URL}/${lang}/tours/${tour.slug}`,
                lastmod: tour.updatedAt ? tour.updatedAt.toISOString() : now,
                changefreq: "weekly",
                priority: "0.7"
            });
        });
    });

    // Package pages
    packages.forEach(pkg => {
        LANGS.forEach(lang => {
            urls.push({
                loc: `${SITE_URL}/${lang}/packages/${pkg.slug}`,
                lastmod: pkg.updatedAt ? pkg.updatedAt.toISOString() : now,
                changefreq: "weekly",
                priority: "0.9"
            });
        });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`).join('')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml"
        }
    });
}
