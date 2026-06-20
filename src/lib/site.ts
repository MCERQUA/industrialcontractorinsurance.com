// Industrial Contractor Insurance — site identity + content schema

import type { LucideIcon } from "lucide-react";

/* ============================================================
   AGENCY IDENTITY — SHARED across all CCA sites. Do NOT change.
   ============================================================ */
export const SITE = {
  name: "Industrial Contractor Insurance",
  legalName: "Industrial Contractor Insurance by Contractors Choice Agency",
  domain: "industrialcontractorinsurance.com",
  url: "https://industrialcontractorinsurance.com",
  tagline: "Insurance for Industrial Contractors, Plant Maintenance, and Pipeline Crews",
  description:
    "Specialized insurance for industrial contractors — general liability, workers' compensation, industrial GL, commercial auto, contractors pollution liability, umbrella, tools & equipment, and contractor bonds. A-rated carriers. 15-minute quotes.",
  phone: "844-967-5247",
  phoneAlt: "855-336-7189",
  phoneHref: "tel:+18449675247",
  email: "josh@contractorschoiceagency.com",
  founded: 2005,
  npn: "8608479",
  address: {
    street: "12220 E Riggs Road, Suite #105",
    city: "Chandler",
    state: "AZ",
    zip: "85249",
    country: "US",
  },
  hours: "Mon–Fri 8 AM–6 PM MST",
  claimsSla: "2-hour response",
  quoteSla: "15-minute quotes",
  statesLicensed: 50,
};

/* ============================================================
   BRAND NICHE IDENTITY
   ============================================================ */
export const BRAND = {
  brandShort: "Industrial Contractor Insurance",
  brandSub: "Heavy Industry Coverage",
  nicheShort: "industrial contractor",
  nichePlural: "industrial contractors",
  operator: "industrial contractor",
  operatorPlural: "industrial contractors",
  niche1: "general liability",
  niche2: "workers' compensation",
  niche3: "contractors pollution liability",
  regionPill: "Texas · Louisiana · Ohio · National",
};

/* ============================================================
   NAVIGATION
   ============================================================ */
export const NAV_LINKS = [
  { href: "/services", label: "Coverage" },
  { href: "/coverage", label: "Coverage Area" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/* ============================================================
   SERVICES
   ============================================================ */
export const SERVICES: {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  keywords?: string[];
}[] = [
  {
    slug: "general-liability",
    title: "General Liability Insurance",
    short: "GL",
    description: "Third-party bodily injury, property damage, and completed-operations liability for industrial contractors working in plants, refineries, and heavy industrial facilities.",
    icon: "ShieldCheck",
    keywords: ["industrial contractor general liability insurance", "plant contractor liability"],
  },
  {
    slug: "workers-compensation",
    title: "Workers' Compensation",
    short: "Workers' Comp",
    description: "High-hazard workers' comp for industrial contractors — crane operators, ironworkers, pipefitters, riggers, and plant maintenance crews with proper industrial class codes.",
    icon: "HardHat",
    keywords: ["industrial contractor workers compensation", "plant maintenance workers comp"],
  },
  {
    slug: "industrial-gl",
    title: "Industrial General Liability",
    short: "Industrial GL",
    description: "Specialty GL for industrial facilities, oil & gas, refinery, and chemical plant contractors — covering the unique hazards of industrial site work that standard GL excludes.",
    icon: "Factory",
    keywords: ["industrial GL insurance", "refinery contractor insurance", "oil and gas contractor insurance"],
  },
  {
    slug: "commercial-auto",
    title: "Commercial Auto Insurance",
    short: "Commercial Auto",
    description: "Coverage for the heavy-duty trucks, service vehicles, cranes, and specialized equipment transporters industrial contractors operate on and off job sites.",
    icon: "Truck",
    keywords: ["industrial contractor commercial auto", "heavy equipment transport insurance"],
  },
  {
    slug: "contractors-pollution",
    title: "Contractors Pollution Liability",
    short: "Pollution Liability",
    description: "Environmental coverage for industrial contractors working in refineries, chemical plants, and hazardous material environments — covering third-party claims from pollutant releases during operations.",
    icon: "Droplets",
    keywords: ["contractors pollution liability insurance", "industrial pollution coverage", "CPL insurance"],
  },
  {
    slug: "umbrella",
    title: "Commercial Umbrella Insurance",
    short: "Umbrella",
    description: "Excess liability coverage above underlying GL, auto, and workers' comp — providing the high limits industrial plant owners and energy companies require on their contractor certificates.",
    icon: "Umbrella",
    keywords: ["industrial contractor umbrella insurance", "high limit contractor liability"],
  },
  {
    slug: "tools-equipment",
    title: "Tools & Equipment Insurance",
    short: "Tools & Equipment",
    description: "Coverage for the specialized tools, portable equipment, scaffolding, and rigging gear industrial contractors bring to job sites — against theft, damage, and breakdown.",
    icon: "Wrench",
    keywords: ["tools and equipment insurance", "contractor equipment insurance", "industrial equipment coverage"],
  },
  {
    slug: "bonds",
    title: "Contractor Bonds & Surety",
    short: "Bonds",
    description: "Performance bonds, payment bonds, license bonds, and maintenance bonds for industrial contractors required by plant owners, operators, and government agencies.",
    icon: "FileSignature",
    keywords: ["industrial contractor bonds", "performance bond contractor", "surety bond industrial"],
  },
];

/* ============================================================
   LOCATIONS
   ============================================================ */
export const LOCATIONS: {
  slug: string;
  name: string;
  region: string;
  blurb: string;
}[] = [
  { slug: "texas", name: "Texas", region: "Houston · Beaumont · Corpus Christi", blurb: "The largest industrial contractor market in the U.S. — refinery, petrochemical, LNG, and pipeline contractor insurance for the Gulf Coast and Permian Basin." },
  { slug: "louisiana", name: "Louisiana", region: "New Orleans · Baton Rouge · Lake Charles", blurb: "Gulf Coast chemical plant, refinery, and offshore support contractor insurance — covering the dense industrial corridor between Baton Rouge and New Orleans." },
  { slug: "ohio", name: "Ohio", region: "Cleveland · Columbus · Toledo", blurb: "Industrial contractor insurance for steel, automotive, chemical, and manufacturing plant maintenance crews across Ohio's industrial heartland." },
  { slug: "california", name: "California", region: "Los Angeles · Richmond · Torrance", blurb: "Refinery, port, and industrial facility contractor insurance for California's industrial markets — written to California-specific environmental and workers' comp requirements." },
  { slug: "west-virginia", name: "West Virginia", region: "Charleston · Huntington · Morgantown", blurb: "Chemical plant, gas processing, and pipeline contractor insurance for the Mountain State's industrial and energy sectors." },
  { slug: "illinois", name: "Illinois", region: "Chicago · East St. Louis · Joliet", blurb: "Industrial and manufacturing contractor insurance for Illinois plant maintenance firms, steel fabricators, and industrial service contractors." },
  { slug: "pennsylvania", name: "Pennsylvania", region: "Philadelphia · Pittsburgh · Allentown", blurb: "Industrial contractor insurance for Pennsylvania's chemical, steel, refining, and manufacturing plant maintenance sector." },
  { slug: "national", name: "Nationwide", region: "All 50 States", blurb: "Industrial contractor insurance written in all 50 states — whether your crews travel to refineries in Texas, chemical plants in Louisiana, or industrial facilities anywhere in the country." },
];

/* ============================================================
   STATS
   ============================================================ */
export const STATS: { value: number; suffix: string; label: string; prefix?: string }[] = [
  { value: 850, suffix: "+", label: "Industrial contractors and plant maintenance crews insured" },
  { value: 20, suffix: "+", label: "Years placing industrial contractor programs" },
  { value: 15, suffix: " min", label: "Average quote turnaround" },
  { value: 50, suffix: "", label: "States licensed & writing" },
];

/* ============================================================
   TESTIMONIALS
   ============================================================ */
export const TESTIMONIALS: { quote: string; name: string; role: string; location: string }[] = [
  {
    quote: "We work in refineries all over the Gulf Coast. Most agents couldn't get us the CPL limits the plant owners required. CCA found markets that understood the exposure and got us proper coverage in days.",
    name: "Ray T.",
    role: "Operations Manager, Industrial Maintenance Contractor",
    location: "Beaumont, TX",
  },
  {
    quote: "Our crews work in chemical plants — the GL exposure is completely different from commercial construction. Josh understood what we needed and built a program that actually covers our work.",
    name: "Karen M.",
    role: "Owner, Plant Maintenance Services",
    location: "Baton Rouge, LA",
  },
  {
    quote: "After getting declined twice over our OSHA history, we brought our situation to CCA. They placed us with an E&S market that understood industrial hazard work. Claims response has been excellent.",
    name: "Derek P.",
    role: "President, Industrial Service Contractors",
    location: "Pittsburgh, PA",
  },
];

/* ============================================================
   CREDENTIALS (for TrustBar, About, etc.)
   ============================================================ */
export const CREDENTIALS = [
  { label: "Licensed in all 50 states", icon: "MapPin" },
  { label: "Founded 2005 — 20+ years", icon: "CalendarCheck" },
  { label: "Industrial contractor specialists", icon: "Factory" },
  { label: "15-minute quote turnaround", icon: "Timer" },
  { label: "2-hour claims response", icon: "Zap" },
  { label: "A.M. Best A+ carrier partners", icon: "Award" },
] as const;
