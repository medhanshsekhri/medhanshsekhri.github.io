"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import { LineReveal } from "./Reveal";
import { responsiveImage } from "@/lib/image";

// The logo plate is deliberately theme-independent: these products own their
// marks, so the plate keeps its light paper tone in dark mode too. No filter,
// no invert, no themed token here.
const PLATE_BG = "#F5F2ED";
const METRIX_ACCENT = "#C96F52";

interface Hackathon {
  id: "leapfrog" | "metrix";
  name: string;
  descriptor: string;
  status: string;
  liveUrl: string;
  screenshot: string;
  blocks: { heading: string; body: string }[];
  proof: string;
}

const HACKATHONS: Hackathon[] = [
  {
    id: "leapfrog",
    name: "Leapfrog",
    descriptor: "Competitor Intelligence",
    status: "2nd Place",
    liveUrl: "https://leapfroghackathon.lovable.app/",
    screenshot: "/leapfrog_screenshot.webp",
    blocks: [
      {
        heading: "The Problem",
        body: "Local businesses compete street by street. When a nearby cafe launches a loyalty program or a rival gym drops its prices, you find out after it has already cost you customers. The signals are public. They are just scattered across hundreds of posts and stories that no owner has time to track.",
      },
      {
        heading: "The Gap",
        body: "Enterprise platforms like Meltwater and Brandwatch solve this for large companies, at thousands of dollars a month, and still need an analyst to read the output. The only alternative for a small business is scrolling competitor accounts by hand. Nothing sits in between.",
      },
      {
        heading: "The Solution",
        body: "Enter your location and business type, then pick the competitors you want to watch. Leapfrog monitors their activity across Instagram, Facebook and LinkedIn through a scraping pipeline, and a lightweight language model turns it into plain English: what promotions are coming, what content is working, where competitors are gaining ground. Then it tells you what to do about it.",
      },
    ],
    proof:
      "Five of seven Brisbane business owners we interviewed said they would pay for it today.",
  },
  {
    id: "metrix",
    name: "Metrix",
    descriptor: "Financial Intelligence",
    status: "Complete",
    liveUrl: "https://metrix-chi-six.vercel.app/",
    screenshot: "/metrix_screenshot.webp",
    blocks: [
      {
        heading: "The Problem",
        body: "Square knows what you sold. Your rostering app knows who was working. Your invoices know what you paid. Three answers, three systems, none of them talking to each other. So owners cut costs by guessing.",
      },
      {
        heading: "The Gap",
        body: "The tools that do join this data up cost over two thousand dollars a month, and still hand back a dashboard the owner has to interpret alone. Small businesses get the numbers and none of the reading.",
      },
      {
        heading: "The Solution",
        body: "Metrix connects all three sources, then asks what financial freedom actually looks like as a number. For the owner of Kin and Co it was paying herself $85,000 a year. Metrix reads twelve months of history and ranks the three moves that close the biggest part of that gap. It maps labour cost against revenue hour by hour to find the window where the roster costs more than the till brings in. It caught a supplier charging 31 percent above market rate on avocados alone. And it simulates a change before you commit: raise the flat white 15 percent and see where it stops chasing inflation and starts making margin.",
      },
    ],
    proof:
      "Four Square users at the Taiwanese Food Festival all said cutting costs was their hardest problem. None could name which costs.",
  },
];

/* Logo plate: fixed-height paper rectangle. The mark is height-constrained and
   capped to the plate content box, so the 16px vertical padding always holds
   and nothing bleeds past the plate edge. */
function LogoPlate({
  hackathon,
  className,
  logoHeight,
  metrixClassName,
}: {
  hackathon: Hackathon;
  className: string;
  logoHeight: number;
  metrixClassName: string;
}) {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-xl px-6 ${className}`}
      style={{ background: PLATE_BG, paddingTop: 16, paddingBottom: 16 }}
    >
      {hackathon.id === "leapfrog" ? (
        <img
          loading="lazy"
          src="/leapfrog_logo.webp"
          alt="Leapfrog"
          draggable={false}
          style={{ height: logoHeight, maxHeight: "100%", width: "auto", objectFit: "contain" }}
        />
      ) : (
        <span
          aria-label="Metrix"
          className={`block whitespace-nowrap leading-none ${metrixClassName}`}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#000000" }}>M</span>
          <span style={{ color: METRIX_ACCENT }}>X</span>
          <span style={{ color: METRIX_ACCENT }}>.</span>
        </span>
      )}
    </div>
  );
}

/* Demo video: fixed 16:9 shell. Pass a youtubeId or a local videoSrc later and
   the layout is unchanged — the placeholder is swapped inside the same box,
   with the product screenshot already wired up as the poster frame. */
function DemoVideo({
  poster,
  title,
  youtubeId,
  videoSrc,
}: {
  poster: string;
  title: string;
  youtubeId?: string;
  videoSrc?: string;
}) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
      {youtubeId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={`${title} demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : videoSrc ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          controls
          muted
          playsInline
          preload="none"
          poster={poster}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-body text-sm text-muted">Demo video coming soon</p>
        </div>
      )}
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-body border border-border text-muted">
      {label}
    </span>
  );
}

function Descriptor({ text, className }: { text: string; className?: string }) {
  return (
    <p
      className={`font-body uppercase text-accent ${className ?? ""}`}
      style={{ letterSpacing: "0.22em" }}
    >
      {text}
    </p>
  );
}

function HackathonModalContent({ hackathon }: { hackathon: Hackathon }) {
  return (
    <div>
      <LogoPlate
        hackathon={hackathon}
        className="h-24"
        logoHeight={72}
        metrixClassName="text-[56px]"
      />

      <h2 className="font-display text-4xl md:text-5xl font-semibold text-text mt-8 mb-2">
        {hackathon.name}
      </h2>
      <Descriptor text={hackathon.descriptor} className="text-[11px] mb-8" />

      <div className="flex flex-col" style={{ gap: 20 }}>
        {hackathon.blocks.map((block) => (
          <div key={block.heading}>
            <h3
              className="font-body uppercase text-accent mb-2 text-[11px]"
              style={{ letterSpacing: "0.18em" }}
            >
              {block.heading}
            </h3>
            <p className="text-muted font-body text-sm leading-relaxed">{block.body}</p>
          </div>
        ))}
      </div>

      <p className="font-body italic text-sm text-muted leading-relaxed" style={{ marginTop: 16 }}>
        {hackathon.proof}
      </p>

      <div className="mt-8">
        <DemoVideo poster={hackathon.screenshot} title={hackathon.name} />
      </div>

      <div className="mt-8">
        <a
          href={hackathon.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-text text-text text-sm font-body hover:bg-text hover:text-bg transition-colors rounded"
        >
          View live ↗
        </a>
      </div>
    </div>
  );
}

function HackathonCard({ hackathon, onOpen }: { hackathon: Hackathon; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label={`Open ${hackathon.name}`}
      className="group glass-panel relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left cursor-pointer transition-[transform,border-color] duration-300 ease-out focus:outline-none hover:-translate-y-1 hover:border-white/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0 shimmer" aria-hidden />
        <img
          {...responsiveImage(hackathon.screenshot, "(max-width: 900px) 100vw, 50vw")}
          alt={`${hackathon.name} interface`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <LogoPlate
          hackathon={hackathon}
          className="h-[68px] min-[900px]:h-20"
          logoHeight={64}
          metrixClassName="text-[36px] min-[900px]:text-[44px]"
        />

        <h3 className="font-display font-semibold leading-snug text-xl text-text transition-colors duration-300 group-hover:text-accent mt-5">
          {hackathon.name}
        </h3>
        <Descriptor text={hackathon.descriptor} className="text-[11px] mt-2" />

        <div className="mt-4">
          <StatusPill label={hackathon.status} />
        </div>
      </div>

      {/* HUD targeting brackets, matching the project cards */}
      <span className="hud-corner hud-corner--tl" aria-hidden />
      <span className="hud-corner hud-corner--tr" aria-hidden />
      <span className="hud-corner hud-corner--bl" aria-hidden />
      <span className="hud-corner hud-corner--br" aria-hidden />
    </button>
  );
}

export default function Hackathons() {
  const [openId, setOpenId] = useState<Hackathon["id"] | null>(null);
  const active = HACKATHONS.find((h) => h.id === openId) ?? null;

  return (
    <section id="hackathons" className="py-24 px-6 md:px-16">
      <div className="mb-5">
        <LineReveal>
          <h2
            className="font-display font-semibold text-text"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
          >
            Hackathons<span className="text-accent">.</span>
          </h2>
        </LineReveal>
      </div>

      <p className="font-body text-muted text-sm md:text-base leading-relaxed max-w-2xl mb-10 md:mb-12">
        Two products built under time pressure. One looks outward at the market. The other
        looks inward at the books.
      </p>

      <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-2 min-[900px]:gap-8">
        {HACKATHONS.map((h, i) => (
          <motion.div
            key={h.id}
            className="h-full"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            <HackathonCard hackathon={h} onOpen={() => setOpenId(h.id)} />
          </motion.div>
        ))}
      </div>

      <Modal isOpen={active !== null} onClose={() => setOpenId(null)} swipeToClose label="Hackathon case study">
        {active && <HackathonModalContent hackathon={active} />}
      </Modal>
    </section>
  );
}
