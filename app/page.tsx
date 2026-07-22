import { ChatWidget } from "@/app/components/ChatWidget";
import { CommandPalette } from "@/app/components/CommandPalette";
import { ConsoleEasterEgg } from "@/app/components/ConsoleEasterEgg";
import { GitHubActivity } from "@/app/components/GitHubActivity";
import { GlowCard } from "@/app/components/GlowCard";
import { ScrollReveal } from "@/app/components/ScrollReveal";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Typewriter } from "@/app/components/Typewriter";

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <span id="__top__" />
        <Header />
        <Hero />
        <About />
        <Specialties />
        <GitHubActivity />
        <Work />
        <Stack />
        <Contact />
        <Footer />
      </main>
      <CommandPalette />
      <ChatWidget />
      <ConsoleEasterEgg />
    </>
  );
}

function Header() {
  return (
    <nav className="mb-16 flex items-center justify-between text-sm">
      <a
        href="#__top__"
        className="font-medium tracking-tight text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] transition-colors"
      >
        ak
      </a>
      <div className="flex items-center gap-5 text-[color:var(--color-fg-muted)]">
        <a href="#work" className="hover:text-[color:var(--color-fg)] transition-colors">Work</a>
        <a href="#stack" className="hover:text-[color:var(--color-fg)] transition-colors">Stack</a>
        <a href="#contact" className="hover:text-[color:var(--color-fg)] transition-colors">Contact</a>
        <a
          href="/Anisur_Khan_Resume.pdf"
          className="rounded-full border border-[color:var(--color-border)] px-3 py-1 hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition-colors"
        >
          Resume
        </a>
        <ThemeToggle />
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <ScrollReveal as="section" className="mb-20">
      <div className="mb-6 flex items-center gap-2 text-sm text-[color:var(--color-fg-muted)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Open to senior full-stack and integrations roles
      </div>
      <h1 className="mb-6 text-4xl font-medium tracking-tight sm:text-5xl">
        Anisur Khan
      </h1>
      <p className="text-lg leading-relaxed text-[color:var(--color-fg-muted)] sm:text-xl">
        Full-stack engineer in Sacramento, CA.{" "}
        <span className="text-[color:var(--color-fg)]">
          I build{" "}
          <Typewriter
            phrases={[
              "SaaS integrations.",
              "Salesforce and QuickBooks pipelines.",
              "production React + Java services.",
              "Claude-based AI tooling.",
            ]}
            className="text-[color:var(--color-accent)]"
          />
        </span>{" "}
        Five years shipping work across React, Java, and MongoDB platforms.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-[color:var(--color-fg-subtle)]">
        <span>Press</span>
        <kbd className="rounded border border-[color:var(--color-border-soft)] px-1.5 py-0.5">⌘K</kbd>
        <span>for commands, or open the chat to ask my AI anything.</span>
      </div>
    </ScrollReveal>
  );
}

function About() {
  return (
    <ScrollReveal as="section" className="mb-20">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-[color:var(--color-fg-subtle)]">
        About
      </h2>
      <div className="space-y-5 text-base leading-relaxed text-[color:var(--color-fg-muted)]">
        <p>
          Most recently at <span className="text-[color:var(--color-fg)]">CRETelligent</span>,
          a commercial real estate due diligence SaaS, where I spent 5+ years
          building the Radius platform. I shipped 100+ pull requests in the
          last 18 months across five services, owning end-to-end work from
          React frontends through Java/Spring backends.
        </p>
        <p>
          My specialty is the integration layer between SaaS products.
          I&apos;ve built and maintained connections to{" "}
          <span className="text-[color:var(--color-fg)]">
            Salesforce, QuickBooks, HubSpot, USAePay, Quire, Regrid, Pendo, and
            Mailgun
          </span>
          . Most recent work was a self-service subscription rebuild covering
          multi-step email verification, payment processing, and downstream
          accounting sync.
        </p>
        <p>
          Lately I&apos;ve been building AI tooling for my own workflow.
          I run a Claude-based automation system locally (Claude Code with
          custom hooks, skills, and MCP servers) and I&apos;m shipping a
          multi-agent meeting transcript analyzer as my next public project.
        </p>
      </div>
    </ScrollReveal>
  );
}

function Specialties() {
  const items = [
    {
      title: "SaaS integrations",
      body: "Designing and shipping the layer that connects products to Salesforce, QuickBooks, HubSpot, payment processors, and third-party reporting APIs.",
    },
    {
      title: "Full-stack feature delivery",
      body: "End-to-end ownership across React/TypeScript frontends and Java/Spring backends. Comfortable across the stack from UI states to async order flows.",
    },
    {
      title: "AI tooling and orchestration",
      body: "Building practical Claude-based automations: multi-agent pipelines, structured output validation, retry logic, and MCP-style tool integration.",
    },
    {
      title: "Code review and mentorship",
      body: "Frequent reviewer across 5 service repos. Comfortable raising real concerns in PRs while keeping merge velocity high.",
    },
  ];

  return (
    <ScrollReveal as="section" className="mb-20">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-[color:var(--color-fg-subtle)]">
        What I do
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <GlowCard
            key={item.title}
            className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-5"
          >
            <h3 className="mb-2 text-base font-medium text-[color:var(--color-fg)]">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
              {item.body}
            </p>
          </GlowCard>
        ))}
      </div>
    </ScrollReveal>
  );
}

type Project = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  github?: string;
  status?: string;
};

function Work() {
  const projects: Project[] = [
    {
      title: "transcript-insights",
      summary:
        "Multi-agent meeting transcript analyzer. Three specialized Claude agents run in parallel on a transcript and produce structured outputs: decisions and action items, business context, and interpersonal dynamics. Schema-validated, with retry on validation failures.",
      tags: ["TypeScript", "Claude API", "Multi-agent", "Zod"],
      github: "https://github.com/AnisurK24/transcript-insights",
      status: "In progress",
    },
    {
      title: "CRETelligent Radius integrations",
      summary:
        "Production work for a CRE due diligence SaaS. Built the self-service subscription rebuild, Salesforce auto-push for proposals and vendor lifecycle sync, QuickBooks invoice and product reconciliation, and led the response when Google Maps deprecated the Drawing Library mid-quarter.",
      tags: ["React", "Java", "Spring", "MongoDB", "Salesforce", "USAePay"],
      status: "Private repos",
    },
    {
      title: "GridAlgoPathfinder",
      summary:
        "Interactive visualizer for BFS and DFS pathfinding. Lets you place start and end points, draw obstacles, adjust grid size, and watch the algorithms search.",
      tags: ["JavaScript", "DOM", "Algorithms"],
      href: "https://anisurk24.github.io/GridAlgoPathfinder/",
      github: "https://github.com/AnisurK24/GridAlgoPathfinder",
    },
  ];

  return (
    <ScrollReveal as="section" className="mb-20">
      <div id="work" />
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-[color:var(--color-fg-subtle)]">
        Selected work
      </h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <GlowCard
            key={project.title}
            as="article"
            className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-6 transition-colors hover:border-[color:var(--color-fg-subtle)]"
          >
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-medium text-[color:var(--color-fg)]">
                {project.title}
              </h3>
              {project.status && (
                <span className="text-xs text-[color:var(--color-fg-subtle)]">
                  {project.status}
                </span>
              )}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
              {project.summary}
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:var(--color-border-soft)] px-2.5 py-0.5 text-xs text-[color:var(--color-fg-subtle)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4 text-sm">
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-accent)] hover:underline"
                >
                  Live →
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-accent)] hover:underline"
                >
                  Source →
                </a>
              )}
            </div>
          </GlowCard>
        ))}
      </div>
    </ScrollReveal>
  );
}

function Stack() {
  const groups = [
    {
      label: "Languages",
      items: ["TypeScript", "JavaScript", "Java", "SQL", "HTML", "CSS"],
    },
    {
      label: "Frontend",
      items: ["React", "Next.js", "Redux", "Angular", "Tailwind CSS", "Material UI"],
    },
    {
      label: "Backend",
      items: ["Node.js", "Express", "Java (Spring + WebClient)", "REST", "GraphQL"],
    },
    {
      label: "Data and infra",
      items: ["MongoDB", "PostgreSQL", "AWS (S3 CRT)", "Docker", "Git", "GitHub Actions"],
    },
    {
      label: "Integrations shipped",
      items: [
        "Salesforce",
        "QuickBooks",
        "HubSpot",
        "USAePay",
        "Quire",
        "Regrid",
        "Pendo",
        "Mailgun",
      ],
    },
    {
      label: "AI and tooling",
      items: [
        "Anthropic Claude API",
        "Claude Code",
        "MCP servers",
        "GitHub Copilot",
        "Aikido (SAST)",
        "Playwright",
      ],
    },
  ];

  return (
    <ScrollReveal as="section" className="mb-20">
      <div id="stack" />
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-[color:var(--color-fg-subtle)]">
        Stack
      </h2>
      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="w-44 shrink-0 text-sm text-[color:var(--color-fg-muted)]">
              {group.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-bg-elevated)] px-2.5 py-1 text-xs text-[color:var(--color-fg)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

function Contact() {
  return (
    <ScrollReveal as="section" className="mb-20">
      <div id="contact" />
      <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-[color:var(--color-fg-subtle)]">
        Contact
      </h2>
      <p className="mb-6 text-base leading-relaxed text-[color:var(--color-fg-muted)]">
        Best way to reach me is email. Open to senior full-stack and integrations
        roles, including contract.
      </p>
      <ul className="space-y-2 text-sm">
        <li>
          <a
            href="mailto:anisurk24@gmail.com"
            className="group inline-flex items-center gap-3 text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            <span className="w-20 text-[color:var(--color-fg-subtle)]">Email</span>
            anisurk24@gmail.com
          </a>
        </li>
        <li>
          <a
            href="https://github.com/AnisurK24"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            <span className="w-20 text-[color:var(--color-fg-subtle)]">GitHub</span>
            github.com/AnisurK24
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/anisur-khan-88a00182/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            <span className="w-20 text-[color:var(--color-fg-subtle)]">LinkedIn</span>
            anisur-khan
          </a>
        </li>
        <li>
          <a
            href="/Anisur_Khan_Resume.pdf"
            className="group inline-flex items-center gap-3 text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            <span className="w-20 text-[color:var(--color-fg-subtle)]">Resume</span>
            Download PDF
          </a>
        </li>
      </ul>
    </ScrollReveal>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-[color:var(--color-border-soft)] pt-6 text-xs text-[color:var(--color-fg-subtle)]">
      <p>
        Built with Next.js, Tailwind, and the Claude API. View the{" "}
        <a
          href="https://github.com/AnisurK24/portfolio_website"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--color-accent)] transition-colors"
        >
          source
        </a>
        .
      </p>
    </footer>
  );
}
