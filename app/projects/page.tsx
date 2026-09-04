import type { Metadata } from "next";
import ProjectsContent from "./ProjectsContent";

// This route is a server component purely so it can own its metadata; every
// interactive part lives in ProjectsContent, which is the client boundary.
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

export default function ProjectsPage() {
  return <ProjectsContent />;
}
