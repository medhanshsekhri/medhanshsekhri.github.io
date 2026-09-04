"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { responsiveImage } from "@/lib/image";
import ZoomableImages from "@/components/Lightbox";
import ProjectsChrome from "../ProjectsChrome";

const PHOTO_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 264px";

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
export default function CaseStudy({ project }: { project: Project }) {
  const columns = [
    { heading: "Challenge", body: project.challenge },
    { heading: "Approach", body: project.approach },
    { heading: "Result", body: project.result },
  ];

  return (
    <div className="relative z-10 min-h-screen">
      <ProjectsChrome backHref="/projects/" backLabel="Projects" />

      <main className="max-w-4xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <h1
          className="font-display font-semibold text-text mb-3"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.05 }}
        >
          {project.title}
          <span className="text-accent">.</span>
        </h1>

        <p className="text-muted font-body text-base leading-relaxed mb-6 max-w-2xl">
          {project.summary}
        </p>

        <p className="font-body text-sm text-muted leading-relaxed mb-12">
          <span className="text-accent">→&nbsp;</span>
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
              {project.photos.map((photo) => (
                <div
                  key={photo.src}
                  className="aspect-square rounded-lg overflow-hidden border border-border"
                >
                  <img
                    loading="lazy"
                    {...responsiveImage(photo.src, PHOTO_SIZES)}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
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
              View on GitHub ↗
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
      </main>
    </div>
  );
}
