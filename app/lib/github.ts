// GitHub data for the "On GitHub" section. Fetched on the server and cached
// for six hours, so visitors never hit GitHub directly. Every function
// returns null on failure; the section renders a plain profile link instead.
//
// Set GITHUB_TOKEN on the host to raise the API rate limit. It is optional:
// the unauthenticated limit (60 requests/hour) covers one refresh.

export const GITHUB_USER = "AnisurK24";
const REVALIDATE = 60 * 60 * 6;

function headers(): HeadersInit {
  const h: Record<string, string> = { "User-Agent": "anisurkhan.com" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type Contributions = {
  days: ContributionDay[];
  total: number;
  activeDays: number;
  longestStreak: number;
};

// The public contributions page lists each day as a <td> (date, level) plus a
// tooltip with the count ("3 contributions on May 4th."). It includes private
// contributions, which this profile is set to show.
export async function getContributions(): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: headers(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const counts = new Map<string, number>();
    for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const n = /^(\d[\d,]*) contributions?/.exec(m[2]);
      counts.set(m[1], n ? Number(n[1].replace(/,/g, "")) : 0);
    }

    const days: ContributionDay[] = [];
    for (const m of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
      const tag = m[0];
      const date = /data-date="([\d-]+)"/.exec(tag)?.[1];
      const id = /id="([^"]+)"/.exec(tag)?.[1];
      const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? 0) as ContributionDay["level"];
      if (!date || !id) continue;
      days.push({ date, count: counts.get(id) ?? 0, level });
    }
    if (days.length < 300) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    let longestStreak = 0;
    let run = 0;
    for (const d of days) {
      run = d.count > 0 ? run + 1 : 0;
      longestStreak = Math.max(longestStreak, run);
    }

    return {
      days,
      total: days.reduce((s, d) => s + d.count, 0),
      activeDays: days.filter((d) => d.count > 0).length,
      longestStreak,
    };
  } catch {
    return null;
  }
}

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  url: string;
};

export type LanguageShare = { name: string; bytes: number; share: number };

export type FrameworkCount = { name: string; repos: number };

export type RepoSummary = {
  publicRepos: number;
  repos: Repo[];
  languages: LanguageShare[];
  frameworks: FrameworkCount[];
};

// GitHub reports languages, not runtimes or libraries, so Node.js and React
// never show up in language data. Detect them from each repo's package.json
// instead. A package.json alone isn't enough for Node.js (browser apps use npm
// just to build), so Node needs a declared engine or a server-side dependency.
const NODE_DEPS = ["express", "@types/node", "next", "nodemon", "tsx", "ts-node", "fastify", "koa"];
type Pkg = { dependencies?: Record<string, string>; devDependencies?: Record<string, string>; engines?: { node?: string } };
const FRAMEWORKS: [string, (deps: Record<string, string>, pkg: Pkg) => boolean][] = [
  ["Node.js", (d, pkg) => Boolean(pkg.engines?.node) || NODE_DEPS.some((n) => n in d)],
  ["React", (d) => "react" in d],
  ["Express", (d) => "express" in d],
  ["Next.js", (d) => "next" in d],
  ["Redux", (d) => "redux" in d || "@reduxjs/toolkit" in d],
  ["Claude API", (d) => "@anthropic-ai/sdk" in d],
];

async function detectFrameworks(repo: string): Promise<string[]> {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/HEAD/package.json`, {
      headers: { "User-Agent": "anisurkhan.com" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const pkg = (await res.json()) as Pkg;
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    return FRAMEWORKS.filter(([, test]) => test(deps, pkg)).map(([name]) => name);
  } catch {
    return [];
  }
}

type ApiRepo = {
  name: string;
  fork: boolean;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  html_url: string;
  languages_url: string;
};

export async function getRepoSummary(): Promise<RepoSummary | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, {
      headers: headers(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const own = ((await res.json()) as ApiRepo[]).filter((r) => !r.fork);

    const totals = new Map<string, number>();
    await Promise.all(
      own.map(async (r) => {
        const lr = await fetch(r.languages_url, { headers: headers(), next: { revalidate: REVALIDATE } });
        if (!lr.ok) return;
        const langs = (await lr.json()) as Record<string, number>;
        for (const [name, bytes] of Object.entries(langs)) {
          totals.set(name, (totals.get(name) ?? 0) + bytes);
        }
      }),
    );

    const perRepo = await Promise.all(own.map((r) => detectFrameworks(r.name)));
    const frameworkCounts = new Map<string, number>();
    for (const list of perRepo) for (const f of list) frameworkCounts.set(f, (frameworkCounts.get(f) ?? 0) + 1);
    const frameworks = FRAMEWORKS.map(([name]) => ({ name, repos: frameworkCounts.get(name) ?? 0 })).filter((f) => f.repos > 0);

    const sum = [...totals.values()].reduce((a, b) => a + b, 0);
    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    // Top five, the rest folded into "Other" so the chart stays readable.
    const top = sorted.slice(0, 5).map(([name, bytes]) => ({ name, bytes, share: bytes / sum }));
    const otherBytes = sorted.slice(5).reduce((a, [, b]) => a + b, 0);
    if (otherBytes > 0) top.push({ name: "Other", bytes: otherBytes, share: otherBytes / sum });

    return {
      publicRepos: own.length,
      repos: own.map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        url: r.html_url,
      })),
      languages: sum > 0 ? top : [],
      frameworks,
    };
  } catch {
    return null;
  }
}
