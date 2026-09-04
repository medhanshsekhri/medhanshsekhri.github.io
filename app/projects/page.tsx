import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/projects";
import { responsiveImage } from "@/lib/image";
import ProjectsChrome from "./ProjectsChrome";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Structures, vehicles, and autonomous systems built by Medhansh Sekhri: an Arduino radar scanner, a flood-resistant station-keeping house, a CO2 dragster, a model rocket, a balsa truss tower, and an autonomous warehouse rover.",
  alternates: { canonical: "/projects/" },
  openGraph: {
    type: "website",
    title: "Projects | Medhansh Sekhri",
    description:
      "Structures, vehicles, and autonomous systems: radar scanning, flood-resistant housing, rocketry, and autonomous rovers.",
    url: "/projects/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Medhansh Sekhri - Projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Medhansh Sekhri",
    description:
      "Structures, vehicles, and autonomous systems: radar scanning, flood-resistant housing, rocketry, and autonomous rovers.",
    images: ["/og.png"],
  },
};

const CARD_SIZES = "(max-width: 767px) 100vw, 320px";

export default function ProjectsIndexPage() {
  return (
    <div className="relative z-10 min-h-screen">
      <ProjectsChrome />

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <h1
          className="font-display font-semibold text-text mb-3"
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
        >
          Projects<span className="text-accent">.</span>
        </h1>
        <p className="font-body text-muted text-base leading-relaxed max-w-xl mb-12">
          Structures, vehicles, and autonomous systems.
        </p>

        <div className="flex flex-col gap-6">
          {PROJECTS.map((project, i) => {
            const cover = project.photos[0];
            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}/`}
                className="group glass-panel rounded-2xl overflow-hidden grid md:grid-cols-[320px_1fr] transition-colors hover:border-white/40"
              >
                {cover && (
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[220px] overflow-hidden">
                    <img
                      loading="lazy"
                      {...responsiveImage(cover.src, CARD_SIZES)}
                      alt={cover.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                )}

                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <p className="font-display italic text-accent text-base mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-display font-semibold text-text leading-tight text-2xl md:text-3xl mb-3 transition-colors duration-300 group-hover:text-accent">
                    {project.title}
                  </h2>
                  <p className="font-body text-sm md:text-base text-muted leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="border-l-2 border-accent pl-4 mb-5">
                    <p className="text-muted text-[10px] uppercase tracking-wider font-body mb-1">
                      Outcome
                    </p>
                    <p className="font-body text-sm text-text leading-relaxed">
                      {project.outcome}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex px-3 py-1 rounded-full text-xs font-body border border-border text-muted"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2.5 text-sm font-body font-medium text-text">
                    Read the case study
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border transition-colors duration-300 group-hover:bg-text group-hover:border-text group-hover:text-bg">
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-300 group-hover:translate-x-[1.5px]"
                      />
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
