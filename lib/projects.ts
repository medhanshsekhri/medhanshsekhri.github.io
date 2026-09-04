/**
 * Single source of truth for the six projects.
 *
 * Reconciled from three previously independent copies that had drifted:
 *   - components/Projects.tsx      PROJECTS (homepage cards)
 *   - components/Projects.tsx      ProjectModalContent (per-id JSX)
 *   - app/projects/ProjectsContent.tsx  a second PROJECTS array
 *
 * Where versions disagreed the more specific wording won; every conflict is
 * listed in the accompanying report rather than resolved silently.
 *
 * Array order is the homepage order: entry 0 is the "Latest build" feature.
 * photos[0] is the card image for each project.
 */

export interface ProjectPhoto {
  src: string;
  alt: string;
}

export interface ProjectVideo {
  src: string;
  poster: string;
  label?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Intentionally blank: to be filled in a later pass, not invented here. */
  date: string;
  summary: string;
  outcome: string;
  challenge: string;
  approach: string;
  result: string;
  tech: string[];
  github?: string;
  video?: ProjectVideo;
  photos: ProjectPhoto[];
}

export const PROJECTS: Project[] = [
  {
    slug: "autonomous-radar-scanner",
    title: "Autonomous Radar Scanner",
    date: "",
    summary:
      "A 180° ultrasonic radar built around an Arduino UNO: an HC-SR04 rangefinder on a servo sweeps the field of view while a Processing app renders detections in real time. All sweep and detection logic written from scratch in C++.",
    outcome:
      "Real-time object mapping across the full 180° sweep with a live radar display.",
    challenge:
      "Debugging embedded hardware with no prior experience. Staying methodical when nothing worked and every path seemed like a dead end.",
    approach:
      "Taught myself C++ from scratch. Wrote all sweep and detection logic. Resolved a critical servo mounting failure. Built a live radar visualisation UI in Processing.",
    result:
      "Fully functioning radar scanner with live UI. Real-time object mapping at 180°. Code is public on GitHub.",
    tech: [
      "C++",
      "Arduino UNO",
      "HC-SR04",
      "SG90 Servo",
      "Processing",
      "Embedded Systems",
    ],
    github: "https://github.com/medhanshsekhri/Arduino-Radar-Scanner",
    video: { src: "/video1.mp4", poster: "/frontview.webp", label: "Live sweep" },
    photos: [
      { src: "/frontview.webp", alt: "Radar scanner, front view" },
      { src: "/topview.webp", alt: "Radar scanner, top view" },
      { src: "/sideview.webp", alt: "Radar scanner, side view" },
      {
        src: "/topview2.webp",
        alt: "Radar scanner wiring: the HC-SR04 sensor and Arduino held beside the breadboard",
      },
      { src: "/circuit_image.webp", alt: "Radar circuit diagram" },
    ],
  },
  {
    slug: "flood-resistant-house",
    title: "Flood-Resistant Station-Keeping House",
    date: "",
    summary:
      "A model house that holds position in rising floodwater. I led a seven-person team and owned the electronics and firmware: an Arduino UNO R3 reading an MPU-6050, driving DC motors through an L298N H-bridge on an XPS foam hull.",
    outcome:
      "Held position under simulated flood conditions, delivered under the $170 AUD budget.",
    challenge:
      "Coordinating a team of seven across disciplines with no prior experience. Keeping the project on budget while meeting all structural and electrical constraints.",
    approach:
      "Led the team, delegated tasks, and personally owned the electrical and firmware subsystems. Designed the motor control circuit and wrote the Arduino navigation code.",
    result:
      "A flood-resistant, station-keeping house that held position under simulated flood conditions. Delivered under budget with all subsystems functional.",
    tech: [
      "Arduino UNO R3",
      "MPU-6050",
      "L298N H-Bridge",
      "C++",
      "12V DC Motors",
      "XPS Foam",
      "Corflute",
      "3D Printing",
      "Tinkercad",
    ],
    github: "https://github.com/medhanshsekhri/FloodResistantHouse",
    video: { src: "/Video_FRH.mp4", poster: "/Frontview_FRH.webp" },
    photos: [
      {
        src: "/Frontview_FRH.webp",
        alt: "Flood-resistant house from the front, hull wrapped and tethered on the workbench",
      },
      {
        src: "/Backview_FRH.webp",
        alt: "Flood-resistant house from behind, showing the motor wiring and paired thrusters",
      },
      {
        src: "/Topview_FRH.webp",
        alt: "Flood-resistant house from above with the roof lifted off, showing the Arduino and L298N motor drivers inside",
      },
    ],
  },
  {
    slug: "co2-dragster",
    title: "CO2 Dragster",
    date: "",
    summary:
      "A 45 g CO2-powered dragster modelled in Fusion 360 and machined from balsa, shaped to minimise frontal area and drag within competition rules.",
    outcome: "0.49 s over the 1 m track, top 5 in the year group.",
    challenge:
      "Full car designed in Fusion 360. Optimised for aerodynamics and minimum frontal area within competition constraints.",
    approach:
      "Hand-finished and sanded from balsa wood. Weighted and balanced to hit the 45 g target.",
    result:
      "0.49 seconds over 1 metre. Placed top 5 in year group. Outperformed heavier designs through aerodynamic efficiency.",
    tech: ["Fusion 360", "Balsa Wood", "CNC", "Aerodynamics", "CAD"],
    video: {
      src: "/dragster_video.mp4",
      poster: "/dragster.webp",
      label: "Race run",
    },
    photos: [{ src: "/dragster.webp", alt: "CO2 dragster" }],
  },
  {
    slug: "model-rocket",
    title: "Model Rocket",
    date: "",
    summary:
      "Designed and simulated in OpenRocket to verify the stability margin before construction, then built, balanced, and launched on a B6-4 motor.",
    outcome: "97 m apogee, stable flight, clean parachute recovery.",
    challenge:
      "Designed in OpenRocket. Simulated flight trajectory and stability margin before construction.",
    approach:
      "Built from a kit with custom fin alignment. Balanced and verified stable before launch. Recovery system tested and deployed.",
    result: "Successful launch to 97 m apogee. Stable flight, clean recovery.",
    tech: ["OpenRocket", "B6-4 Motor", "Flight Dynamics", "Recovery Systems"],
    video: { src: "/rocket_video.mp4", poster: "/rocket.webp", label: "Launch" },
    photos: [
      { src: "/rocket_upright.webp", alt: "Model rocket on the pad" },
      { src: "/rocket.webp", alt: "Model rocket" },
    ],
  },
  {
    slug: "balsa-truss-tower",
    title: "Balsa Truss Tower",
    date: "",
    summary:
      "A balsa truss tower built for a structural efficiency competition. Geometry chosen to maximise load-to-weight ratio with predictable load paths; joints pinned and glued with weight tracked through the build.",
    outcome: "Failed exactly at the designed weak point under class load testing.",
    challenge:
      "Applied truss geometry principles to minimise material use while maximising load capacity.",
    approach:
      "Cut and assembled from balsa strip stock. Joints pinned and glued with careful weight tracking.",
    result:
      "Competitive load-to-weight ratio in class testing. Failure mode was predictable and at the designed weak point.",
    tech: ["Truss Design", "Balsa Wood", "Structural Analysis", "Load Testing"],
    photos: [
      { src: "/tower_side.webp", alt: "Truss tower, side view" },
      { src: "/tower_top.webp", alt: "Truss tower, top view" },
    ],
  },
  {
    slug: "autonomous-warehouse-rover",
    title: "Autonomous Warehouse Rover",
    date: "",
    summary:
      "A LEGO Mindstorms EV3 rover programmed to clear a warehouse-style obstacle course with no human input: ultrasonic sensor for obstacle detection, colour sensor for line following.",
    outcome: "Completed the full course autonomously.",
    challenge:
      "Navigate a warehouse-style obstacle course without human input using onboard sensors.",
    approach:
      "Programmed in EV3-G. Ultrasonic sensor for obstacle detection, colour sensor for line following.",
    result:
      "Completed the full course autonomously. Demonstrated sensor fusion and conditional decision-making.",
    tech: [
      "LEGO Mindstorms EV3",
      "EV3-G",
      "Ultrasonic Sensor",
      "Colour Sensor",
      "Autonomous Navigation",
    ],
    photos: [
      { src: "/rover_front.webp", alt: "Warehouse rover, front view" },
      { src: "/rover_side.webp", alt: "Warehouse rover, side view" },
    ],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
