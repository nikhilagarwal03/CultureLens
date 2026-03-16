import type { ReferenceKind } from "./reference-detection";

export type ReferenceLibraryEntry = {
  key: string;
  name: string;
  aliases: string[];
  kind: ReferenceKind;
  originCulture: string;
  era: string;
  tags: string[];
  summary: string;
};

const REFERENCE_LIBRARY: ReferenceLibraryEntry[] = [
  {
    key: "roman-empire-meme",
    name: "Roman Empire meme",
    aliases: ["roman empire", "how often do you think about the roman empire"],
    kind: "meme",
    originCulture: "Global internet culture",
    era: "2023-ongoing",
    tags: ["tiktok", "history", "viral"],
    summary: "A meme about unexpectedly frequent thoughts about the Roman Empire, popularized through short-form videos.",
  },
  {
    key: "skibidi",
    name: "Skibidi meme",
    aliases: ["skibidi", "skibidi toilet"],
    kind: "meme",
    originCulture: "Global internet culture",
    era: "2023-ongoing",
    tags: ["youtube", "gen-z", "gen-alpha"],
    summary: "A chaotic meme format derived from animated short videos and remix-style online humor.",
  },
  {
    key: "based-slang",
    name: "Based",
    aliases: ["based"],
    kind: "slang",
    originCulture: "English-speaking internet culture",
    era: "2010s-ongoing",
    tags: ["slang", "approval", "social media"],
    summary: "Slang used to signal approval for an opinion seen as bold, authentic, or unapologetic.",
  },
  {
    key: "rizz-slang",
    name: "Rizz",
    aliases: ["rizz", "unspoken rizz"],
    kind: "slang",
    originCulture: "US internet culture",
    era: "2020s",
    tags: ["slang", "dating", "tiktok"],
    summary: "Slang referring to charisma, especially in romantic or flirtatious social interactions.",
  },
  {
    key: "met-gala",
    name: "Met Gala",
    aliases: ["met gala", "metropolitan museum gala"],
    kind: "event",
    originCulture: "United States",
    era: "1948-ongoing",
    tags: ["fashion", "celebrity", "media"],
    summary: "An annual high-profile fashion event that drives online discussion around celebrity styling and themes.",
  },
  {
    key: "super-bowl",
    name: "Super Bowl",
    aliases: ["super bowl", "nfl final", "big game"],
    kind: "event",
    originCulture: "United States",
    era: "1967-ongoing",
    tags: ["sports", "advertising", "mass-media"],
    summary: "The NFL championship game and a major annual cultural moment in the US, beyond sports itself.",
  },
  {
    key: "npc-meme",
    name: "NPC meme",
    aliases: ["npc", "npc meme", "non-player character meme"],
    kind: "meme",
    originCulture: "Gaming and internet culture",
    era: "2018-ongoing",
    tags: ["gaming", "behavior", "tiktok"],
    summary: "A meme framing repetitive or scripted behavior as if someone were a game non-player character.",
  },
  {
    key: "senpai",
    name: "Senpai",
    aliases: ["senpai", "sempai"],
    kind: "slang",
    originCulture: "Japan",
    era: "longstanding",
    tags: ["anime", "language", "social-role"],
    summary: "A Japanese term for a senior or mentor figure, widely used in anime and fandom contexts.",
  },
];

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

export function findReferenceLibraryMatch(text: string): ReferenceLibraryEntry | null {
  const query = normalize(text);
  if (!query) return null;

  for (const entry of REFERENCE_LIBRARY) {
    const names = [entry.name, ...entry.aliases].map(normalize);
    if (names.includes(query)) return entry;
  }

  for (const entry of REFERENCE_LIBRARY) {
    const names = [entry.name, ...entry.aliases].map(normalize);
    if (names.some((name) => query.includes(name) || name.includes(query))) return entry;
  }

  return null;
}

export function formatReferenceLibraryHint(entry: ReferenceLibraryEntry): string {
  return [
    `Library match: ${entry.name}.`,
    `Kind: ${entry.kind}.`,
    `Origin: ${entry.originCulture}.`,
    `Era: ${entry.era}.`,
    `Tags: ${entry.tags.join(", ")}.`,
    `Reference summary: ${entry.summary}`,
  ].join(" ");
}

export function getReferenceLibrarySize(): number {
  return REFERENCE_LIBRARY.length;
}
