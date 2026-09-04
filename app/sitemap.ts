import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";

const SITE_URL = "https://medhanshsekhri.github.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    // One entry per project, so adding a project to lib/projects.ts is enough.
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}/`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
