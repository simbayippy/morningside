export const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Legal",
  "Media",
  "Non-profit",
  "Government",
  "Other",
] as const;

export type Industry = (typeof INDUSTRY_OPTIONS)[number];
