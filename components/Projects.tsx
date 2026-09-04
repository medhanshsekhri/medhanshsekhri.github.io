"use client";

import { useState, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Modal from "./Modal";
import ZoomableImages from "./Lightbox";
import { LineReveal } from "./Reveal";
import { responsiveImage } from "@/lib/image";

// Frosted-glass surface (CSS approximation, not Apple Liquid Glass).
// Styling lives in the .glass-panel class in globals.css.
const GLASS_CLASS = "glass-panel";

const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.4 };

// Pointer-driven 3D tilt. Uses motion values (not state) so it never
// re-renders the tree on mouse move. Collapses to static under reduced motion.
function TiltCard({
  onClick,
  ariaLabel,
  className,
  style,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), TILT_SPRING);

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.button
        onClick={onClick}
        onMouseMove={reduce ? undefined : handleMove}
        onMouseLeave={reset}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
        style={{
          ...style,
          ...(reduce ? {} : { rotateX, rotateY }),
        }}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
        {/* HUD targeting brackets: draw in on hover, like a viewfinder lock */}
        <span className="hud-corner hud-corner--tl" aria-hidden />
        <span className="hud-corner hud-corner--tr" aria-hidden />
        <span className="hud-corner hud-corner--bl" aria-hidden />
        <span className="hud-corner hud-corner--br" aria-hidden />
      </motion.button>
    </div>
  );
}

interface Project {
  id: number;
  title: string;
  imageSrc: string | null;
  rotate?: boolean;
  aspect?: number; // displayed width/height, so the card box hugs the image
  summary: string;
  outcome: string;
  tech: string[];
}

const PROJECTS: Project[] = [
  {
    id: 2, title: "Autonomous Radar Scanner",
    imageSrc: "/frontview.webp", aspect: 1.02,
    summary: "Real-time 180° object detection built from scratch in C++, the sensing foundation of an autonomous drone.",
    outcome: "Live visualisation · open-source on GitHub",
    tech: ["C++", "Arduino", "HC-SR04", "Processing"],
  },
  {
    id: 1, title: "Flood-Resistant Station-Keeping House",
    imageSrc: "/Frontview_FRH.webp", aspect: 1.6,
    summary: "Team-led, flood-resistant house that holds position in rising water, delivered on a $170 budget.",
    outcome: "Held position under simulated flood · under budget",
    tech: ["Arduino UNO R3", "MPU-6050", "L298N", "C++"],
  },
  {
    id: 4, title: "CO2 Dragster",
    imageSrc: "/dragster.webp", aspect: 0.75,
    summary: "45g aerodynamic dragster designed in Fusion 360 and CNC-cut from balsa.",
    outcome: "0.49s over 1m · top 5 in year group",
    tech: ["Fusion 360", "Aerodynamics", "CAD"],
  },
  {
    id: 5, title: "Model Rocket",
    imageSrc: "/rocket_upright.webp", aspect: 0.75,
    summary: "Model rocket simulated for stability in OpenRocket, then built and launched.",
    outcome: "97m apogee · clean recovery",
    tech: ["OpenRocket", "Flight Dynamics"],
  },
  {
    id: 6, title: "Balsa Truss Tower",
    imageSrc: "/tower_side.webp", aspect: 2.17,
    summary: "Truss tower optimised to maximise load-to-weight ratio through geometry.",
    outcome: "Predictable failure at the designed weak point",
    tech: ["Structural Analysis", "Load Testing"],
  },
  {
    id: 7, title: "Autonomous Warehouse Rover",
    imageSrc: "/rover_front.webp", aspect: 2.17,
    summary: "EV3 rover that navigates a warehouse-style obstacle course with no human input.",
    outcome: "Completed the full course autonomously",
    tech: ["LEGO EV3", "Ultrasonic", "Colour Sensor"],
  },
];

function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-body border border-border text-muted">
      {label}
    </span>
  );
}

/* Modal gallery photos. Written out rather than derived from the filename:
   the alt text is read aloud by screen readers and also becomes the lightbox
   aria-label, so "Backview FRH" is not good enough. Same {src, alt} shape as
   PHOTOS in WhyMe.tsx. */
const FRH_PHOTOS = [
  { src: "/Frontview_FRH.webp", alt: "Flood-resistant house from the front, hull wrapped and tethered on the workbench" },
  { src: "/Backview_FRH.webp",  alt: "Flood-resistant house from behind, showing the motor wiring and paired thrusters" },
  { src: "/Topview_FRH.webp",   alt: "Flood-resistant house from above with the roof lifted off, showing the Arduino and L298N motor drivers inside" },
];

const RADAR_PHOTOS = [
  { src: "/frontview.webp", alt: "Radar scanner, front view" },
  { src: "/topview.webp",   alt: "Radar scanner, top view" },
  { src: "/sideview.webp",  alt: "Radar scanner, side view" },
  { src: "/topview2.webp",  alt: "Radar scanner wiring: the HC-SR04 sensor and Arduino held beside the breadboard" },
];

function ProjectModalContent({ id }: { id: number }) {
  if (id === 1) return (
    <div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Flood-Resistant Station-Keeping House</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">Team leader across structural, electrical, and software subsystems within a $170 AUD budget.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Challenge", body: "Coordinating a team of seven across disciplines with no prior experience. Keeping the project on budget while meeting all structural and electrical constraints." },
          { heading: "What I Did", body: "Led the team, delegated tasks, and personally owned the electrical and firmware subsystems. Designed the motor control circuit and wrote the Arduino navigation code." },
          { heading: "Result", body: "A flood-resistant, station-keeping house that held position under simulated flood conditions. Delivered under budget with all subsystems functional." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">
        {["Arduino UNO", "C++", "L298N H-Bridge", "12V DC Motors", "3D Printing", "Tinkercad", "XPS Foam", "Corflute"].map((t) => <TechPill key={t} label={t} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {FRH_PHOTOS.map((photo) => (
          <div key={photo.src} className="aspect-square rounded-lg overflow-hidden border border-border">
            <img loading="lazy" {...responsiveImage(photo.src, "(max-width: 639px) 100vw, 264px")} alt={photo.alt} className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
          </div>
        ))}
      </div>
      <div className="rounded-lg overflow-hidden mb-8 border border-border">
        <video controls muted playsInline preload="none" poster="/Frontview_FRH.webp" style={{width:"100%",height:"auto",maxHeight:"70vh",objectFit:"contain",background:"#000",display:"block"}}>
          <source src="/Video_FRH.mp4" type="video/mp4" />
        </video>
      </div>
      <a href="https://github.com/medhanshsekhri/FloodResistantHouse" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-text text-text text-sm font-body hover:bg-text hover:text-bg transition-colors rounded">
        View on GitHub ↗
      </a>
    </div>
  );

  if (id === 2) return (
    <div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Radar Scanner</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">Real-time 180° object detection built from scratch. The sensing foundation of an autonomous drone.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Challenge", body: "Debugging embedded hardware with no prior experience. Staying methodical when nothing worked and every path seemed like a dead end." },
          { heading: "What I Did", body: "Taught myself C++ from scratch. Wrote all sweep and detection logic. Resolved a critical servo mounting failure. Built a live radar visualisation UI in Processing." },
          { heading: "Result", body: "Fully functioning radar scanner with live UI. Real-time object mapping at 180°. Code is public on GitHub." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">
        {["Arduino UNO", "C++", "HC-SR04", "SG90 Servo", "Processing", "Embedded Systems"].map((t) => <TechPill key={t} label={t} />)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {RADAR_PHOTOS.map((photo) => (
          <div key={photo.src} className="aspect-square rounded-lg overflow-hidden border border-border">
            <img loading="lazy" {...responsiveImage(photo.src, "(max-width: 639px) 100vw, 264px")} alt={photo.alt} className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
          </div>
        ))}
      </div>
      <div className="mb-10">
        <div className="rounded-lg overflow-hidden mb-4 border border-border">
          <video controls muted playsInline preload="none" poster="/frontview.webp" style={{width:"100%",height:"auto",maxHeight:"70vh",objectFit:"contain",background:"#000",display:"block"}}>
            <source src="/video1.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rounded-lg overflow-hidden border border-border flex items-center justify-center p-4" style={{height:200}}>
          <img loading="lazy" {...responsiveImage("/circuit_image.webp", "203px")} alt="Circuit diagram" className="w-full h-full object-contain" onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        </div>
      </div>
      <a href="https://github.com/medhanshsekhri/Arduino-Radar-Scanner" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-text text-text text-sm font-body hover:bg-text hover:text-bg transition-colors rounded">
        View on GitHub ↗
      </a>
    </div>
  );

  if (id === 4) return (
    <div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">CO2 Dragster</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">45g, 0.49s over 1m. Designed in Fusion 360, CNC machined from balsa wood. Placed top 5 in year group.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Design", body: "Full car designed in Fusion 360. Optimised for aerodynamics and minimum frontal area within competition constraints." },
          { heading: "Build", body: "Hand-finished and sanded from balsa wood. Weighted and balanced to hit the 45g target." },
          { heading: "Result", body: "0.49 seconds over 1 metre. Placed top 5 in year group. Outperformed heavier designs through aerodynamic efficiency." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">{["Fusion 360","Balsa Wood","Aerodynamics","CAD"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div className="mb-8">
        <div className="rounded-lg overflow-hidden mb-3 border border-border">
          <video controls muted playsInline preload="none" poster="/dragster.webp" style={{width:"100%",height:"auto",maxHeight:"70vh",objectFit:"contain",background:"#000",display:"block"}}>
            <source src="/dragster_video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rounded-lg overflow-hidden border border-border" style={{height:200,background:"var(--dragster-img-bg,#f5f5f5)",padding:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img loading="lazy" {...responsiveImage("/dragster.webp", "150px")} alt="CO2 Dragster" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        </div>
      </div>
    </div>
  );

  if (id === 5) return (
    <div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Model Rocket</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">97m apogee. B6-4 motor. Designed in OpenRocket, built and launched safely.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Design", body: "Designed in OpenRocket. Simulated flight trajectory and stability margin before construction." },
          { heading: "Build", body: "Built from a kit with custom fin alignment. Balanced and verified stable before launch. Recovery system tested and deployed." },
          { heading: "Result", body: "Successful launch to 97m apogee. Stable flight, clean recovery." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">{["OpenRocket","B6-4 Motor","Flight Dynamics","Recovery Systems"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div className="mb-8">
        <video controls muted playsInline preload="none" poster="/rocket.webp" style={{width:"100%",height:"auto",maxHeight:"70vh",objectFit:"contain",borderRadius:8,marginBottom:8,background:"#000",display:"block"}}>
          <source src="/rocket_video.mp4" type="video/mp4" />
        </video>
        <img loading="lazy" {...responsiveImage("/rocket.webp", "(max-width: 767px) 100vw, 816px")} alt="Model Rocket" style={{width:"100%",borderRadius:8}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
      </div>
    </div>
  );

  if (id === 6) return (
    <div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Balsa Truss Tower</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">Structural efficiency competition. Designed to maximise load-to-weight ratio using truss geometry.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Approach", body: "Applied truss geometry principles to minimise material use while maximising load capacity." },
          { heading: "Build", body: "Cut and assembled from balsa strip stock. Joints pinned and glued with careful weight tracking." },
          { heading: "Result", body: "Competitive load-to-weight ratio in class testing. Failure mode was predictable and at the designed weak point." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">{["Truss Design","Balsa Wood","Structural Analysis","Load Testing"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div style={{display:"flex",gap:12}}>
        <img loading="lazy" {...responsiveImage("/tower_top.webp", "402px")} alt="Tower top" style={{flex:1,height:260,objectFit:"cover",borderRadius:8,minWidth:0}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        <img loading="lazy" {...responsiveImage("/tower_side.webp", "402px")} alt="Tower side" style={{flex:1,height:260,objectFit:"cover",borderRadius:8,minWidth:0}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
      </div>
    </div>
  );

  if (id === 7) return (
    <div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mb-3">Autonomous Warehouse Rover</h2>
      <p className="text-muted font-body text-base leading-relaxed mb-10">LEGO Mindstorms EV3 rover programmed to navigate an obstacle course autonomously using sensor feedback.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { heading: "Task", body: "Navigate a warehouse-style obstacle course without human input using onboard sensors." },
          { heading: "Approach", body: "Programmed in EV3-G. Ultrasonic sensor for obstacle detection, colour sensor for line following." },
          { heading: "Result", body: "Completed the full course autonomously. Demonstrated sensor fusion and conditional decision-making." },
        ].map((col) => (
          <div key={col.heading}>
            <h3 className="font-body font-semibold text-text text-xs uppercase tracking-wider mb-3">{col.heading}</h3>
            <p className="text-muted font-body text-sm leading-relaxed">{col.body}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-10">{["LEGO Mindstorms EV3","EV3-G","Ultrasonic Sensor","Colour Sensor","Autonomous Navigation"].map((t) => <TechPill key={t} label={t} />)}</div>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <img loading="lazy" {...responsiveImage("/rover_front.webp", "92px")} alt="Rover front" style={{maxHeight:200,width:"auto",objectFit:"contain",borderRadius:8}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
        <img loading="lazy" {...responsiveImage("/rover_side.webp", "92px")} alt="Rover side" style={{maxHeight:200,width:"auto",objectFit:"contain",borderRadius:8}} onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}} />
      </div>
    </div>
  );

  return null;
}

// Slot widths for the card images, used to pick between the 1x and 2x files.
const FEATURED_SIZES = "(max-width: 767px) 100vw, 50vw";
const CARD_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw";

function ProjectImage({ project, cover }: { project: Project; cover?: boolean }) {
  if (!project.imageSrc) {
    // No photos: a flat schematic tile listing the hardware, like a parts callout.
    return (
      <div className="absolute inset-0 flex items-center justify-center blueprint-tile">
        <div className="text-center px-6">
          {project.tech.map((t) => (
            <p
              key={t}
              className="font-body text-xs uppercase tracking-[0.28em] text-muted leading-loose"
            >
              {t}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return (
    <img loading="lazy"
      {...responsiveImage(project.imageSrc, cover ? FEATURED_SIZES : CARD_SIZES)}
      alt={project.title}
      className={`absolute inset-0 w-full h-full ${cover ? "object-cover" : "object-contain p-4"}`}
      draggable={false}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

/* Outcome line: the measured result, led by an accent arrow */
function OutcomeLine({ text, className }: { text: string; className?: string }) {
  return (
    <p className={`font-body text-xs text-muted leading-relaxed ${className ?? ""}`}>
      <span className="text-accent">→&nbsp;</span>
      {text}
    </p>
  );
}

export default function Projects() {
  const [modalId, setModalId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [featured, ...rest] = PROJECTS;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 px-6 md:px-16"
    >
      <div className="mb-10 md:mb-12">
        <LineReveal>
          <h2
            className="font-display font-semibold text-text"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Projects<span className="text-accent">.</span>
          </h2>
        </LineReveal>
      </div>

      {/* Latest flagship */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <TiltCard
          onClick={() => setModalId(featured.id)}
          ariaLabel={`Open ${featured.title}`}
          className={`group w-full grid md:grid-cols-2 rounded-2xl overflow-hidden text-left transition-colors focus:outline-none hover:border-white/40 ${GLASS_CLASS}`}
        >
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <ProjectImage project={featured} cover />
            </div>
          </div>
          <div className="p-7 md:p-10 flex flex-col justify-center">
            <p className="font-display italic text-accent mb-3" style={{ fontSize: "1.15rem", lineHeight: 1.1 }}>
              Latest build
            </p>
            <h3 className="font-display font-semibold leading-tight text-3xl lg:text-4xl text-text transition-colors duration-300 group-hover:text-accent">
              {featured.title}
            </h3>
            <p className="font-body text-sm md:text-base text-muted leading-relaxed mt-4">
              {featured.summary}
            </p>
            <OutcomeLine text={featured.outcome} className="mt-4" />
            <div className="flex flex-wrap gap-2 mt-5">
              {featured.tech.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </div>
            <span className="inline-flex items-center gap-2.5 text-sm font-body font-medium text-text mt-7">
              Open case study
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border transition-colors duration-300 group-hover:bg-text group-hover:border-text group-hover:text-bg">
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-[1.5px]" />
              </span>
            </span>
          </div>
        </TiltCard>
      </motion.div>

      {/* Uniform grid: consistent cards, each rises into view on its own beat */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((p, i) => (
          <motion.div
            key={p.id}
            className="h-full"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard
              onClick={() => setModalId(p.id)}
              ariaLabel={`Open ${p.title}`}
              className={`group flex flex-col w-full h-full text-left rounded-2xl overflow-hidden transition-colors focus:outline-none hover:border-white/40 ${GLASS_CLASS}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  <ProjectImage project={p} />
                </div>
              </div>
              <div className="p-5 border-t border-[var(--glass-border)] flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-semibold leading-snug text-xl text-text transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </h3>
                  <span className="font-display italic text-sm text-accent pt-1">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3 pt-1.5">
                  <OutcomeLine text={p.outcome} />
                  <ArrowRight
                    size={15}
                    className="shrink-0 mb-0.5 text-muted opacity-0 -translate-x-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent"
                  />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalId !== null} onClose={() => setModalId(null)} label="Project case study">
        {modalId !== null && (
          <ZoomableImages>
            <ProjectModalContent id={modalId} />
          </ZoomableImages>
        )}
      </Modal>
    </section>
  );
}
