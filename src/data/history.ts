export type LegacyStat = {
  label: string;
  value: string;
};

export type LegacyGalleryItem = {
  id: string;
  caption: string;
  image?: string;
  palette: string;
  orientation?: "landscape" | "portrait";
};

export type LegacyYear = {
  year: number;
  theme: string;
  headline: string;
  location: string;
  highlight: string;
  stats: LegacyStat[];
  gallery: LegacyGalleryItem[];
};

export const legacyYears: LegacyYear[] = [
  {
    year: 2024,
    theme: "Aurora Resonance",
    headline: "A sold-out dusk-to-dawn spectacle that merged neon artistry with Sri Lanka's street rhythms.",
    location: "Nelum Pokuna Outdoor Arena",
    highlight: "Introduced the first immersive 270° projection tunnel as guests entered the venue.",
    stats: [
      { label: "Attendees", value: "3,100+" },
      { label: "Performers", value: "28 Acts" },
      { label: "Sponsor Partners", value: "22" },
    ],
    gallery: [
      { id: "2024-1", caption: "Opening light cascade", palette: "from-violet-600 via-fuchsia-500 to-amber-400", orientation: "landscape" },
      { id: "2024-2", caption: "Dance collective finale", palette: "from-amber-500 via-orange-500 to-rose-500" },
      { id: "2024-3", caption: "Neon marketplace", palette: "from-cyan-500 via-blue-500 to-purple-500" },
    ],
  },
  {
    year: 2023,
    theme: "Celestial Pulse",
    headline: "An ode to the night sky where every performance synced to the pulse of a starlit canopy.",
    location: "Galle Face Festival Grounds",
    highlight: "Unveiled the Tantalize drone show with animated constellations narrating our story.",
    stats: [
      { label: "Audience Reach", value: "2.7K Guests" },
      { label: "Stage Hours", value: "09:30 hrs" },
      { label: "Featured Artists", value: "21" },
    ],
    gallery: [
      { id: "2023-1", caption: "Drone constellation reveal", palette: "from-indigo-600 via-slate-700 to-black", orientation: "landscape" },
      { id: "2023-2", caption: "Cultural fusion ensemble", palette: "from-emerald-500 via-teal-500 to-cyan-400" },
      { id: "2023-3", caption: "Midnight crowd wave", palette: "from-purple-500 via-pink-500 to-red-400" },
    ],
  },
  {
    year: 2022,
    theme: "Echoes of Tradition",
    headline: "A reverent celebration honouring decades of Sri Lankan artistry with a modern staging language.",
    location: "Independence Square Pavilion",
    highlight: "Premiered the heritage runway featuring reimagined Kandyan attire set to glitched tabla beats.",
    stats: [
      { label: "Curated Ensembles", value: "12" },
      { label: "Volunteer Crew", value: "180+" },
      { label: "Community Workshops", value: "6" },
    ],
    gallery: [
      { id: "2022-1", caption: "Traditional drumline arrival", palette: "from-amber-600 via-yellow-500 to-gold-500", orientation: "landscape" },
      { id: "2022-2", caption: "Heritage runway walk", palette: "from-rose-500 via-amber-400 to-emerald-400" },
      { id: "2022-3", caption: "Audience fire lanterns", palette: "from-slate-800 via-blue-800 to-black" },
    ],
  },
  {
    year: 2021,
    theme: "Reignite",
    headline: "Our comeback showcase that reignited the stage with intimate sets and immersive storytelling.",
    location: "Colombo Port City Amphitheatre",
    highlight: "Debuted a 180° LED wall with reactive visuals driven by crowd sound levels.",
    stats: [
      { label: "Hybrid Viewers", value: "4.2K Live" },
      { label: "Main Stage", value: "3 Acts" },
      { label: "Pop-up Performances", value: "11" },
    ],
    gallery: [
      { id: "2021-1", caption: "Crowd-light synced moment", palette: "from-blue-600 via-indigo-500 to-purple-600", orientation: "landscape" },
      { id: "2021-2", caption: "Acoustic midnight set", palette: "from-emerald-500 via-lime-400 to-yellow-400" },
      { id: "2021-3", caption: "Immersive LED wall", palette: "from-slate-900 via-indigo-900 to-black" },
    ],
  },
];
