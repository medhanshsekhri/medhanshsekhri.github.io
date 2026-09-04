import type { MetadataRoute } from "next";

const SITE_URL = "https://medhanshsekhri.github.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
