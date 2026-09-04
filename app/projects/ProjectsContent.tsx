"use client";

import { useState } from "react";
import Link from "next/link";
import { responsiveImage } from "@/lib/image";
import { motion } from "framer-motion";
import { ArrowLeft, Sun, Moon } from "lucide-react";

type Photo = { src: string; alt: string; w: number; h: number };

interface Project {
  title: string;
  description: string; // 2-3 lines, plain and factual
  outcome: string;
  tools: string[];
  github?: string;
  video?: { src: string; label: string };
  photos: Photo[];
}

const PROJECTS: Project[] = [
  {
    title: "Flood-Resistant Station-Keeping House",
    description:
      "A model house that holds position in rising floodwater. I led a seven-person team and owned the electronics and firmware: an Arduino UNO R3 reading an MPU-6050, driving DC motors through an L298N H-bridge on an XPS foam hull.",
    outcome: "Held position under simulated flood conditions, delivered under the $170 budget.",
    tools: ["Arduino UNO R3", "MPU-6050", "L298N", "C++", "XPS Foam", "Tinkercad"],
    photos: [],
  },
  {
    title: "Autonomous Radar Scanner",
    description:
      "A 180° ultrasonic radar built around an Arduino UNO: an HC-SR04 rangefinder on a servo sweeps the field of view while a Processing app renders detections in real time. All sweep and detection logic written from scratch in C++.",
    outcome: "Real-time object mapping across the full 180° sweep with a live radar display.",
    tools: ["C++", "Arduino UNO", "HC-SR04", "SG90 Servo", "Processing"],
    github: "https://github.com/medhanshsekhri/Arduino-Radar-Scanner",
    video: { src: "/video1.mp4", label: "Live sweep" },
    photos: [
      { src: "/frontview.webp",    alt: "Radar scanner, front view",  w: 1050, h: 1032 },
      { src: "/topview.webp",      alt: "Radar scanner, top view",    w: 787,  h: 1002 },
      { src: "/sideview.webp",     alt: "Radar scanner, side view",   w: 1081, h: 858  },
      { src: "/circuit_image.webp", alt: "Radar circuit diagram",     w: 1920, h: 1895 },
    ],
  },
  {
    title: "CO2 Dragster",
    description:
      "A 45 g CO2-powered dragster modelled in Fusion 360 and machined from balsa, shaped to minimise frontal area and drag within competition rules.",
    outcome: "0.49 s over the 1 m track, top 5 in the year group.",
    tools: ["Fusion 360", "Balsa", "CNC", "Aerodynamics"],
    video: { src: "/dragster_video.mp4", label: "Race run" },
    photos: [{ src: "/dragster.webp", alt: "CO2 dragster", w: 1440, h: 1920 }],
  },
  {
    title: "Model Rocket",
    description:
      "Designed and simulated in OpenRocket to verify the stability margin before construction, then built, balanced, and launched on a B6-4 motor.",
    outcome: "97 m apogee, stable flight, clean parachute recovery.",
    tools: ["OpenRocket", "B6-4 Motor", "Flight Dynamics"],
    video: { src: "/rocket_video.mp4", label: "Launch" },
    photos: [{ src: "/rocket_upright.webp", alt: "Model rocket on the pad", w: 1440, h: 1920 }],
  },
  {
    title: "Balsa Truss Tower",
    description:
      "A balsa truss tower built for a structural efficiency competition. Geometry chosen to maximise load-to-weight ratio with predictable load paths; joints pinned and glued with weight tracked through the build.",
    outcome: "Failed exactly at the designed weak point under class load testing.",
    tools: ["Truss Design", "Balsa", "Structural Analysis", "Load Testing"],
    photos: [
      { src: "/tower_side.webp", alt: "Truss tower, side view", w: 885, h: 1920 },
      { src: "/tower_top.webp",  alt: "Truss tower, top view",  w: 885, h: 1920 },
    ],
  },
  {
    title: "Autonomous Warehouse Rover",
    description:
      "A LEGO Mindstorms EV3 rover programmed to clear a warehouse-style obstacle course with no human input: ultrasonic sensor for obstacle detection, colour sensor for line following.",
    outcome: "Completed the full course autonomously.",
    tools: ["LEGO EV3", "EV3-G", "Ultrasonic Sensor", "Colour Sensor"],
    photos: [
      { src: "/rover_front.webp", alt: "Warehouse rover, front view", w: 887, h: 1920 },
      { src: "/rover_side.webp",  alt: "Warehouse rover, side view",  w: 887, h: 1920 },
    ],
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasMedia = project.photos.length > 0 || project.video;

  return (
    <motion.article
      className="glass-panel rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={hasMedia ? "grid md:grid-cols-2" : ""}>
        {hasMedia && (
          <div className="p-4 md:p-5 flex flex-col gap-3">
            {project.video && (
              <video
                className="w-full h-auto block rounded-lg border border-border bg-black"
                src={project.video.src}
                controls
                muted
                playsInline
                preload="none"
                poster={project.photos[0]?.src}
                aria-label={`${project.title}: ${project.video.label}`}
              />
            )}
            <div className={`grid gap-3 ${project.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {project.photos.map((photo) => (
                <div key={photo.src} className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border bg-elevated">
                  <img
                    {...responsiveImage(
                      photo.src,
                      project.photos.length > 1
                        ? "(max-width: 767px) 50vw, 214px"
                        : "(max-width: 767px) 100vw, 440px"
                    )}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 flex flex-col justify-center">
          <p className="font-display italic text-accent text-base mb-3">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="font-display font-semibold text-text leading-tight text-2xl md:text-3xl mb-4">
            {project.title}
          </h2>
          <p className="font-body text-sm md:text-base text-muted leading-relaxed mb-5">
            {project.description}
          </p>

          <div className="border-l-2 border-accent pl-4 mb-6">
            <p className="text-muted text-[10px] uppercase tracking-wider font-body mb-1">Outcome</p>
            <p className="font-body text-sm text-text leading-relaxed">{project.outcome}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="inline-flex px-3 py-1 rounded-full text-xs font-body border border-border text-muted"
              >
                {tool}
              </span>
            ))}
          </div>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start mt-6 px-5 py-2.5 border border-text text-text text-sm font-body rounded-full hover:bg-text hover:text-bg transition-colors"
            >
              View on GitHub ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsContent() {
  const [isDark, setIsDark] = useState<boolean>(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <div className="relative z-10 min-h-screen">
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 md:px-8 h-16 border-b"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          borderColor: "var(--glass-border)",
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-semibold text-text hover:opacity-75 transition-opacity"
          style={{ fontSize: "17px" }}
        >
          <ArrowLeft size={16} /> Medhansh Sekhri
        </Link>
        <button
          onClick={toggleDark}
          suppressHydrationWarning
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted hover:text-text hover:border-accent transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </header>

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

        <div className="flex flex-col gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
