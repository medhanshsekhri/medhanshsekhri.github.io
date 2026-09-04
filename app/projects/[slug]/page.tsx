import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/lib/projects";
import CaseStudy from "./CaseStudy";

// output: "export" needs the full slug list at build time.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// params is a Promise in this Next version and must be awaited; reading
// .slug off it directly yields undefined and every page 404s.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const url = `/projects/${project.slug}/`;
  const image = project.photos[0]?.src ?? "/og.png";

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${project.title} | Medhansh Sekhri`,
      description: project.description,
      url,
      images: [{ url: image, alt: project.photos[0]?.alt ?? project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Medhansh Sekhri`,
      description: project.description,
      images: [image],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  // Neighbours in PROJECTS order, wrapping at both ends so neither the first
  // nor the last case study is a dead end.
  const { length } = PROJECTS;
  const prev = PROJECTS[(index - 1 + length) % length];
  const next = PROJECTS[(index + 1) % length];

  return (
    <CaseStudy
      project={PROJECTS[index]}
      prev={{ slug: prev.slug, title: prev.title }}
      next={{ slug: next.slug, title: next.title }}
    />
  );
}
