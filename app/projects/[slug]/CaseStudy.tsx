"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { responsiveImage } from "@/lib/image";
import ZoomableImages from "@/components/Lightbox";
import Footer from "@/components/Footer";
import ProjectsChrome from "../ProjectsChrome";

const PHOTO_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 264px";

/** Just enough of a neighbouring project to link to it. */
export interface ProjectLink {
  slug: string;
  title: string;
}

function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-body border border-border text-muted">
      {label}
    </span>
  );
}

/**
 * The case study that used to live in ProjectModalContent, now a real page.
 * Client component only so the photo grid keeps click-to-zoom; everything it
 * renders comes from the project record.
 */
export default function CaseStudy({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: ProjectLink;
  next: ProjectLink;
}) {
  // Labels come from the project so each keeps its original framing.
  const columns = [
    { heading: project.headings[0], body: project.challenge },
    { heading: project.headings[1], body: project.approach },
    { heading: project.headings[2], body: project.result },
  ];

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <ProjectsChrome backHref="/projects/" backLabel="Projects" />

      <main id="main-content" className="flex-1 w-full max-w-4xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <h1
          className="font-display font-semibold text-text mb-3"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.05 }}
        >
          {project.title}
          <span className="text-accent">.</span>
        </h1>

        <p className="text-muted font-body text-base leading-relaxed mb-6 max-w-2xl">
          {project.description}
        </p>

        <p className="font-body text-sm text-muted leading-relaxed mb-12">
          <span className="text-accent">&rarr;&nbsp;</span>
          {project.outcome}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">
                {col.heading}
              </h2>
              <p className="text-muted font-body text-sm leading-relaxed">
                {col.body}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tech.map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>

        <ZoomableImages>
          {project.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {project.photos.map((photo) => {
                // 4:5 boxes suit the portrait sources most of these photos
                // are. Anything that must not be cropped - a diagram, or a
                // source far taller than the box - opts out via `fit`.
                const contain = photo.fit === "contain";
                return (
                  <div
                    key={photo.src}
                    className="aspect-[4/5] rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      loading="lazy"
                      {...responsiveImage(photo.src, PHOTO_SIZES)}
                      alt={photo.alt}
                      className={`w-full h-full ${
                        contain ? "object-contain p-3" : "object-cover"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </ZoomableImages>

        {project.video && (
          <div className="rounded-lg overflow-hidden mb-8 border border-border">
            <video
              controls
              muted
              playsInline
              preload="none"
              poster={project.video.poster}
              aria-label={
                project.video.label
                  ? `${project.title}: ${project.video.label}`
                  : `${project.title} video`
              }
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "70vh",
                objectFit: "contain",
                background: "#000",
                display: "block",
              }}
            >
              <source src={project.video.src} type="video/mp4" />
            </video>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-text text-text text-sm font-body hover:bg-text hover:text-bg transition-colors rounded"
            >
              View on GitHub &#8599;
            </a>
          )}
          <Link
            href="/projects/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted text-sm font-body hover:text-text hover:border-text transition-colors rounded"
          >
            All projects
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Somewhere to go next: the neighbouring projects in the
            lib/projects.ts order, wrapping at both ends. */}
        <nav
          aria-label="More projects"
          className="mt-14 pt-8 border-t border-dashed border-border grid sm:grid-cols-2 gap-6"
        >
          <Link
            href={`/projects/${prev.slug}/`}
            className="group flex items-start gap-3"
          >
            <ArrowLeft
              size={15}
              className="mt-[3px] shrink-0 text-muted transition-all duration-300 group-hover:text-accent group-hover:-translate-x-1"
            />
            <span>
              <span className="block font-body text-[10px] uppercase tracking-[0.22em] text-muted mb-1">
                Previous
              </span>
              <span className="block font-display font-semibold text-lg text-text leading-snug transition-colors duration-300 group-hover:text-accent">
                {prev.title}
              </span>
            </span>
          </Link>

          <Link
            href={`/projects/${next.slug}/`}
            className="group flex items-start gap-3 sm:flex-row-reverse sm:text-right"
          >
            <ArrowRight
              size={15}
              className="mt-[3px] shrink-0 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-1"
            />
            <span>
              <span className="block font-body text-[10px] uppercase tracking-[0.22em] text-muted mb-1">
                Next
              </span>
              <span className="block font-display font-semibold text-lg text-text leading-snug transition-colors duration-300 group-hover:text-accent">
                {next.title}
              </span>
            </span>
          </Link>
        </nav>

        <div className="mt-12 glass-panel rounded-2xl p-7 md:p-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display font-semibold text-text text-2xl md:text-3xl leading-tight">
              Get in touch<span className="text-accent">.</span>
            </h2>
            <p className="font-body text-sm text-muted leading-relaxed mt-2 max-w-md">
              I&apos;m after internships and project work in autonomous systems
              and aerospace.
            </p>
          </div>
          <Link
            href="/#contact"
            className="inline-flex shrink-0 items-center gap-2.5 px-5 py-2.5 border border-text text-text text-sm font-body hover:bg-text hover:text-bg transition-colors rounded"
          >
            Contact
            <ArrowRight size={13} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
