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
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${project.title} | Medhansh Sekhri`,
      description: project.summary,
      url,
      images: [{ url: image, alt: project.photos[0]?.alt ?? project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Medhansh Sekhri`,
      description: project.summary,
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
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
}
