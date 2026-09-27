import { ArrowRight, ArrowUpRight, GithubLogo, LinkedinLogo, FilePdf, Star } from "@phosphor-icons/react/dist/ssr";
import { ContributionHeatmap } from "@/app/components/ContributionHeatmap";
import { LanguageBars } from "@/app/components/LanguageBars";
import { GITHUB_USER, getContributions, getRepoSummary } from "@/app/lib/github";
import { ChatWidget } from "@/app/components/ChatWidget";
import { ConsoleEasterEgg } from "@/app/components/ConsoleEasterEgg";
import { CopyEmail } from "@/app/components/CopyEmail";
import { FieldObserver } from "@/app/components/FieldObserver";
import { HeroTyper } from "@/app/components/HeroTyper";
import { IntegrationMap, type Specialty } from "@/app/components/IntegrationMap";
import { Nav } from "@/app/components/Nav";
import { CursorScrubVideo } from "@/app/components/CursorScrubVideo";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { Skills, type Skill } from "@/app/components/Skills";

const EMAIL = "anisurk24@gmail.com";

export default function Home() {
  return (
    <>
      <FieldObserver />
      <Nav />
      <main>
        <Hero />
        <About />
        <SkillsSection />
        <Stack />
        <WhatIDo />
        <Work />
        <GitHub />
        <Contact />
      </main>
      <ChatWidget />
      <ConsoleEasterEgg />
    </>
  );
}

const shell = "mx-auto w-full max-w-[1400px] px-5 md:px-10";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="display mb-12 max-w-[16ch] text-balance text-[clamp(2.75rem,6.5vw,5.5rem)] md:mb-16">
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section
      id="top"
      data-field="stone"
      className="relative flex min-h-[100dvh] flex-col overflow-clip pt-16 md:pt-[72px]"
    >
      <div className={`${shell} relative z-10 grid flex-1 items-center gap-10 pb-10 pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12 lg:pb-16`}>
        <div>
        <p className="fade-up text-xl leading-snug md:text-2xl" style={{ ["--i" as string]: 0 }}>
          Hello, I&apos;m Anisur Khan.
          <br />
          I build
        </p>

        <h1 className="display mt-5 text-[11vw] sm:text-[clamp(3.4rem,8.3vw,6.5rem)] lg:text-[clamp(3.6rem,6.3vw,7rem)] md:mt-7">
          <span className="rise" style={{ ["--i" as string]: 1 }}>
            <span>Integrations.</span>
          </span>
          <span className="rise" style={{ ["--i" as string]: 2 }}>
            <span>Payment flows.</span>
          </span>
          <span className="rise" style={{ ["--i" as string]: 3 }}>
            <span>
              <HeroTyper phrases={["AI tools.", "Claude agents.", "MCP servers."]} />
            </span>
          </span>
        </h1>

        <p
          className="fade-up mt-8 max-w-[34rem] text-lg leading-relaxed md:text-xl"
          style={{ ["--i" as string]: 5 }}
        >
          Five years shipping React and Java/Spring features that connect SaaS
          products to Salesforce, QuickBooks, HubSpot, and payment processors.
        </p>

        <div className="fade-up mt-9" style={{ ["--i" as string]: 6 }}>
          <a href={`mailto:${EMAIL}`} className="btn btn-accent">
            Email me
            <ArrowRight size={18} weight="bold" className="btn-arrow" />
          </a>
        </div>
        </div>

        {/* 3D portrait: the cursor anywhere on the page scrubs the video. */}
        <div className="hero-drift flex w-full flex-col items-center lg:items-end">
          <div className="portrait-in aspect-[4/5] w-[min(100%,24rem)] overflow-hidden rounded-2xl bg-[#ee6e3e] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] lg:w-[min(100%,calc(min(72dvh,660px)*0.8))]">
            <CursorScrubVideo
              src="/hero-scrub.mp4"
              poster="/hero-scrub-poster.webp"
              trackingArea="window"
              axis="horizontal"
              smoothing={0.18}
              label="A 3D-rendered Anisur Khan in a black jacket and tan quarter-zip, smiling"
            />
          </div>
          <p className="muted mt-3 hidden text-sm [@media(hover:hover)_and_(pointer:fine)]:block">
            Move your cursor across the page.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const FACTS = [
  { k: "Based in", v: "Sacramento, CA" },
  { k: "Experience", v: "5+ years. Software Engineer II at CRETelligent (Dec 2020 to Jun 2026), and a Senior Integrations Developer on contract since April 2026" },
  { k: "Education", v: "App Academy (1500+ hour immersive). UC Davis, B.S. Biology" },
  { k: "Looking for", v: "Senior full-stack and integrations roles, including contract" },
];

function About() {
  return (
    <section id="about" data-field="olive" className="py-28 md:py-40">
      <div className={`${shell} grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
        <ScrollReveal className="self-start lg:sticky lg:top-28">
          <figure className="wipe overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile.jpg"
              alt="Anisur Khan standing on a city street, in profile"
              width={1080}
              height={1350}
              loading="lazy"
              className="h-auto w-full"
            />
          </figure>
        </ScrollReveal>

        <div className="lg:pt-4">
          <ScrollReveal>
            <p className="max-w-[30ch] text-[clamp(1.75rem,3vw,2.6rem)] font-medium leading-[1.15] tracking-[-0.02em]">
              I work on the layer most people never see: the part where your
              product talks to Salesforce, QuickBooks, and a payment processor,
              and the numbers still match at the end of the month.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="muted mt-10 max-w-[60ch] text-lg leading-relaxed">
              For five and a half years I built the Radius platform at
              CRETelligent, a commercial real estate due diligence SaaS. In my
              last 18 months there I shipped 100+ pull requests across five
              services, from React frontends to Java/Spring backends. Since April
              2026 I have run a portfolio of production HubSpot integrations
              on contract, as a Senior Integrations Developer. Lately I build Claude-based
              tools that check their own output before a person ever reads it.
            </p>
          </ScrollReveal>
          <dl className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FACTS.map((f, i) => (
              <ScrollReveal key={f.k} delay={i * 60}>
                <dt className="muted text-sm font-medium">{f.k}</dt>
                <dd className="mt-1.5 text-lg leading-snug">{f.v}</dd>
              </ScrollReveal>
            ))}
          </dl>
        </div>

      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const SKILLS: Skill[] = [
  {
    name: "SaaS integrations",
    where: "CRETelligent, Radius platform",
    proof:
      "Built the layer between Radius and Salesforce: auto-push for proposals, vendor lifecycle sync with the Connect platform, Quire document routing, and sync that survives bulk loads.",
  },
  {
    name: "HubSpot integrations",
    where: "Senior Integrations Developer, contract, April 2026 to present",
    proof:
      "Took over production syncs into HubSpot from SchoolMint, Infinite Campus, NetSuite, and SFTP feeds: designed observability across services, put every bulk data change behind a dry run or a rollback log, and removed the failure behind about 6,900 rejected upserts per run.",
  },
  {
    name: "Payments and billing",
    where: "CRETelligent, Q1 to Q2 2026",
    proof:
      "Rebuilt self-service subscriptions end to end: USAePay integration with credit-card surcharge logic, a Starter monthly tier, legal-terms gating, and asynchronous payment orchestration.",
  },
  {
    name: "Data sync and reconciliation",
    where: "CRETelligent, QuickBooks pipeline",
    proof:
      "Mapped subscription titles to QuickBooks products, synced invoices from the asynchronous order flow, and reconciled USAePay payments against the books.",
  },
  {
    name: "Full-stack features",
    where: "CRETelligent, Software Engineer I",
    proof:
      "Built Teams Management end to end: a React UI with a RadiusMap component in order-tracker, plus a Java TeamDao with full CRUD and admin-role permissions.",
  },
  {
    name: "Shipping under pressure",
    where: "CRETelligent, June 2026",
    proof:
      "When Google Maps deprecated its Drawing Library, I led the parcel draw tool rebuild: pinned the Maps JS API, added backend alerting, and shipped across three services in four days.",
  },
  {
    name: "Performance tuning",
    where: "CRETelligent, connect-service",
    proof:
      "Moved S3 file handling to the CRT-based S3AsyncClient, added the aws-crt dependency, and refactored the AwsStorage class around it.",
  },
  {
    name: "LLM orchestration",
    where: "transcript-insights, open source",
    proof:
      "Three Claude agents run in parallel, each validated against a Zod schema with targeted retries, then checked against the transcript so no quote or deadline is invented.",
  },
  {
    name: "Code review",
    where: "Five service repos",
    proof:
      "A frequent reviewer across five services and the person teammates asked about frontend work and the parts of the codebase I knew best.",
  },
];

function SkillsSection() {
  return (
    <section id="skills" data-field="ink" className="py-28 md:py-40">
      <div className={shell}>
        <ScrollReveal>
          <SectionTitle>Skills, with receipts.</SectionTitle>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Skills items={SKILLS} />
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STACK = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Java", "SQL", "HTML", "CSS"], span: "lg:col-span-4" },
  { label: "Frontend", items: ["React", "Next.js", "Redux", "Angular", "Tailwind CSS", "Material UI"], span: "lg:col-span-4" },
  { label: "Backend", items: ["Node.js", "Express", "Java (Spring, WebClient)", "REST", "GraphQL"], span: "lg:col-span-4" },
  { label: "Data and infra", items: ["MongoDB", "PostgreSQL", "AWS S3 (CRT)", "Docker", "Git", "GitHub Actions"], span: "lg:col-span-5" },
  { label: "AI and tooling", items: ["Claude API", "Claude Code", "MCP servers", "GitHub Copilot", "Aikido (SAST)", "Playwright"], span: "lg:col-span-7" },
];

const INTEGRATIONS = ["HubSpot", "Salesforce", "QuickBooks", "NetSuite", "USAePay", "SchoolMint", "Infinite Campus", "Quire", "Regrid", "Pendo", "Mailgun", "Google Maps"];

function Stack() {
  return (
    <section id="stack" data-field="graphite" className="py-28 md:py-40">
      <div className={shell}>
        <ScrollReveal>
          <SectionTitle>The stack I reach for.</SectionTitle>
        </ScrollReveal>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Integrations: the feature cell */}
          <ScrollReveal className="lg:col-span-12">
            <div className="rounded-2xl bg-[var(--color-coral)] p-7 text-[var(--color-ink)] md:p-10">
              <h3 className="text-sm font-semibold">Integrations shipped to production</h3>
              <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2">
                {INTEGRATIONS.map((name) => (
                  <li key={name} className="display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.05]">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {STACK.map((g, i) => (
            <ScrollReveal key={g.label} delay={i * 60} className={g.span}>
              <div className="h-full rounded-2xl bg-[color-mix(in_oklab,var(--color-paper)_6%,transparent)] p-7 md:p-8">
                <h3 className="muted text-sm font-semibold">{g.label}</h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-[color-mix(in_oklab,currentColor_22%,transparent)] px-3.5 py-1.5 text-[15px] font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const SPECIALTIES: Specialty[] = [
  {
    title: "Connect products to the systems they run on",
    body: "CRMs, ERPs, school enrollment systems, document tools, parcel data, and email, synced on schedules and resilient to bulk loads.",
    nodes: ["salesforce", "hubspot", "schoolmint", "infinitecampus", "netsuite", "quire", "regrid", "pendo", "mailgun"],
  },
  {
    title: "Move money correctly",
    body: "Card payments, surcharges, subscription tiers, and invoices that reconcile with accounting.",
    nodes: ["usaepay", "quickbooks"],
  },
  {
    title: "Own features end to end",
    body: "From React and TypeScript screens to Java/Spring services, async flows, and the database underneath.",
    nodes: "all",
  },
  {
    title: "Build AI tools that check their own work",
    body: "Claude agents with schema validation, retries, and grounding checks, wired together with hooks, skills, and MCP servers.",
    nodes: ["claude"],
  },
];

function WhatIDo() {
  return (
    <section id="what-i-do" data-field="umber" className="py-28 md:py-40">
      <div className={shell}>
        <ScrollReveal>
          <SectionTitle>What I do.</SectionTitle>
        </ScrollReveal>
        <IntegrationMap specialties={SPECIALTIES} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

type Project = {
  title: string;
  context: string;
  summary: string;
  points: string[];
  tags: string[];
  links?: { label: string; href: string }[];
  note?: string;
  tint: string;
};

const PROJECTS: Project[] = [
  {
    title: "Self-service subscriptions and payments",
    context: "CRETelligent, Radius platform, 2026",
    summary:
      "Rebuilt how customers sign up and pay, across a React frontend and a Java/Spring backend.",
    points: [
      "Multi-step email verification before account creation",
      "USAePay integration with credit-card surcharge logic and legal-terms gating",
      "Starter monthly billing tier and asynchronous payment orchestration",
      "Invoice sync into QuickBooks from the async order flow",
    ],
    tags: ["React", "Java", "Spring", "USAePay", "QuickBooks"],
    note: "Private codebase",
    tint: "#2a2724",
  },
  {
    title: "CRM and accounting integration layer",
    context: "CRETelligent, Radius platform, 2020 to 2026",
    summary:
      "The connective tissue between Radius and the business systems around it.",
    points: [
      "Salesforce auto-push for proposals and vendor lifecycle sync with the Connect platform",
      "Salesforce to Quire document routing and sync that survives bulk loads",
      "QuickBooks product mapping and payment reconciliation against USAePay",
      "Integrations with HubSpot, Regrid, Pendo, and Mailgun",
    ],
    tags: ["Java", "Spring", "Salesforce", "HubSpot", "QuickBooks", "Quire"],
    note: "Private codebase",
    tint: "#30352a",
  },
  {
    title: "Taking over a HubSpot integration portfolio",
    context: "Senior Integrations Developer, contract, April 2026 to present",
    summary:
      "Stepped in as successor to the outgoing lead developer on production Node.js syncs that feed HubSpot from school enrollment systems, NetSuite, and SFTP sales feeds.",
    points: [
      "Mapped ownership and continuity risk across ten production integrations, flagging single points of support",
      "Designed cross-service sync observability: a shared status writer, an authenticated status endpoint, and a HubSpot app banner",
      "Gated bulk data changes behind dry runs and rollback logs, including a 3,213-contact cleanup and a 43,700-deal backfill",
      "Caught a copied stage mapping that would have recorded every declined applicant as a won deal",
      "Removed a failure class: E.164 phone normalization cleared about 6,900 rejected upserts per run",
      "Cut alert noise: the hourly ops digest now fires only on real failures",
    ],
    tags: ["Node.js", "HubSpot API", "HubSpot UI extensions", "SchoolMint", "Infinite Campus", "NetSuite", "SFTP", "systemd"],
    note: "Client codebases, private",
    tint: "#2b2f35",
  },
  {
    title: "transcript-insights",
    context: "Open source, TypeScript",
    summary:
      "A meeting transcript analyzer where three Claude agents read the same transcript in parallel, in about ten seconds.",
    points: [
      "Agents for decisions and action items, business context, and interpersonal dynamics",
      "Zod schema validation, with the exact error fed back to the model on retry",
      "Grounding check: invented quotes, people, or deadlines get sent back for correction",
      "71 tests, an architecture doc, and committed sample output",
    ],
    tags: ["TypeScript", "Claude API", "Zod", "Multi-agent"],
    links: [{ label: "Source", href: "https://github.com/AnisurK24/transcript-insights" }],
    tint: "#1f2b28",
  },
  {
    title: "Claude Code automation system",
    context: "Personal tooling, daily use",
    summary:
      "The local system I run my own work through, built on Claude Code.",
    points: [
      "Custom hooks that log sessions and keep a daily record of work",
      "Skills for recurring workflows like meeting notes and PR descriptions",
      "MCP servers that connect the agent to mail, documents, and a browser",
    ],
    tags: ["Claude Code", "Hooks", "Skills", "MCP"],
    tint: "#2f2a33",
  },
  {
    title: "This site",
    context: "Next.js 15 on Netlify",
    summary:
      "A portfolio with a chat that answers questions about me, grounded in my resume and streamed from Claude.",
    points: [
      "Server route streams Claude responses; the API key never reaches the browser",
      "Rate limiting that holds across serverless instances, backed by Netlify Blobs",
      "Grounding rules that keep the model from inventing roles, dates, or contact details",
    ],
    tags: ["Next.js", "TypeScript", "Claude API", "Netlify"],
    links: [{ label: "Source", href: "https://github.com/AnisurK24/portfolio_website" }],
    tint: "#1d1f1c",
  },
];

function Work() {
  return (
    <section id="work" data-field="ink" className="py-28 md:py-40">
      <div className={shell}>
        <ScrollReveal>
          <SectionTitle>Selected work.</SectionTitle>
        </ScrollReveal>

        <ol className="grid gap-6">
          {PROJECTS.map((p, i) => (
            <li
              key={p.title}
              className="stack-card"
              style={{ ["--i" as string]: i }}
            >
              <article
                className="grid gap-8 rounded-2xl p-7 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.5)] md:p-10 2xl:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14"
                style={{ background: p.tint }}
              >
                <div className="flex flex-col">
                  <p className="muted text-sm font-medium">{p.context}</p>
                  <h3 className="display mt-3 text-[clamp(2rem,4.2vw,3.5rem)] leading-[0.98]">
                    {p.title}
                  </h3>
                  <p className="muted mt-5 max-w-[44ch] text-lg leading-relaxed">{p.summary}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
                    {p.links?.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-coral)] underline-offset-4 hover:underline"
                      >
                        {l.label}
                        <ArrowUpRight size={16} weight="bold" />
                      </a>
                    ))}
                    {p.note && <span className="muted text-sm">{p.note}</span>}
                  </div>
                </div>
                <div>
                  <ul className="grid gap-3">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[16px] leading-relaxed xl:text-[17px]">
                        <span aria-hidden className="mt-[0.68em] h-[2px] w-4 shrink-0 rounded-full bg-[var(--color-coral)]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-[color-mix(in_oklab,currentColor_22%,transparent)] px-3 py-1 text-sm font-medium"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const PINNED = ["transcript-insights", "portfolio_website"];

async function GitHub() {
  const [contrib, summary] = await Promise.all([getContributions(), getRepoSummary()]);
  const profile = `https://github.com/${GITHUB_USER}`;
  const pinned = summary ? PINNED.map((n) => summary.repos.find((r) => r.name === n)).filter((r) => r !== undefined) : [];

  const stats = [
    contrib && { k: "Contributions, last 12 months", v: contrib.total.toLocaleString("en-US") },
    contrib && { k: "Active days", v: String(contrib.activeDays) },
    summary && { k: "Public repositories", v: String(summary.publicRepos) },
  ].filter((x): x is { k: string; v: string } => Boolean(x));

  return (
    <section id="github" data-field="olive" className="py-28 md:py-40">
      <div className={shell}>
        <ScrollReveal>
          <SectionTitle>On GitHub.</SectionTitle>
        </ScrollReveal>

        {stats.length > 0 && (
          <ScrollReveal>
            <dl className="mb-12 grid grid-cols-2 gap-x-8 gap-y-6 md:mb-16 md:grid-cols-3">
              {stats.map((s) => (
                <div key={s.k}>
                  <dt className="muted text-sm font-medium">{s.k}</dt>
                  <dd className="display mt-1 text-[clamp(2rem,3.6vw,3rem)] tabular-nums">{s.v}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        )}

        {contrib && (
          <ScrollReveal>
            <h3 className="mb-5 text-lg font-semibold">Contribution activity</h3>
            <ContributionHeatmap days={contrib.days} />
          </ScrollReveal>
        )}

        <div className="mt-16 grid gap-14 md:mt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          {summary && summary.languages.length > 0 && (
            <ScrollReveal>
              <h3 className="mb-6 text-lg font-semibold">Languages in public repos</h3>
              <LanguageBars languages={summary.languages} frameworks={summary.frameworks} />
            </ScrollReveal>
          )}

          <ScrollReveal delay={100}>
            <h3 className="mb-6 text-lg font-semibold">Pinned repositories</h3>
            <ul className="grid gap-4">
              {pinned.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl bg-[color-mix(in_oklab,var(--color-paper)_6%,transparent)] p-6 transition-colors hover:bg-[color-mix(in_oklab,var(--color-paper)_10%,transparent)]"
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="text-lg font-semibold">{r.name}</span>
                      <ArrowUpRight size={18} weight="bold" className="shrink-0 text-[var(--color-coral)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    {r.description && <span className="muted mt-2 block leading-relaxed">{r.description}</span>}
                    <span className="muted mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                      {r.language && <span>{r.language}</span>}
                      <span className="inline-flex items-center gap-1"><Star size={14} weight="fill" aria-hidden /> {r.stars}</span>
                      <span>Updated {new Date(r.pushedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={profile}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 font-semibold underline decoration-[var(--color-coral)] decoration-2 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-current"
            >
              <GithubLogo size={20} className="text-[var(--color-coral)]" /> View all on GitHub
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <section id="contact" data-field="coral" className="pb-10 pt-28 md:pt-40">
      <div className={shell}>
        <ScrollReveal>
          <h2 className="display max-w-[12ch] text-balance text-[clamp(3.25rem,9vw,8.5rem)]">
            Have a role in mind?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="mt-8 max-w-[40ch] text-xl leading-relaxed">
            I&apos;m open to senior full-stack and integrations roles, including
            contract. Email is the fastest way to reach me.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <a
            href={`mailto:${EMAIL}`}
            className="display mt-12 inline-block break-all text-[clamp(1.9rem,5.6vw,5rem)] underline decoration-2 underline-offset-[0.14em] transition-[text-decoration-color] hover:decoration-transparent"
          >
            {EMAIL}
          </a>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CopyEmail email={EMAIL} />
            <a href="https://github.com/AnisurK24" target="_blank" rel="noopener noreferrer" className="btn border border-current">
              <GithubLogo size={20} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/anisur-khan-88a00182/" target="_blank" rel="noopener noreferrer" className="btn border border-current">
              <LinkedinLogo size={20} /> LinkedIn
            </a>
            <a href="/Anisur_Khan_Resume.pdf" className="btn border border-current">
              <FilePdf size={20} /> Resume
            </a>
          </div>
        </ScrollReveal>

        <footer className="mt-28 flex flex-col gap-2 border-t border-[color-mix(in_oklab,currentColor_25%,transparent)] pt-6 text-sm font-medium sm:flex-row sm:justify-between md:mt-40">
          <p>© 2026 Anisur Khan</p>
          <p>
            Built with Next.js and the Claude API.{" "}
            <a
              href="https://github.com/AnisurK24/portfolio_website"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              View source
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
