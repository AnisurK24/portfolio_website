// Server component. Pulls recent public events from the GitHub REST API and
// renders a compact strip. Cached for 30 minutes via Next fetch revalidation.

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { title: string; html_url: string };
    commits?: { message: string }[];
  };
};

type DisplayEvent = {
  id: string;
  when: string;
  label: string;
  repo: string;
  url?: string;
};

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function toDisplay(e: GitHubEvent): DisplayEvent | null {
  const repo = e.repo.name.replace(/^AnisurK24\//, "");
  const when = formatRelative(e.created_at);
  switch (e.type) {
    case "PushEvent": {
      const commits = e.payload.commits?.length ?? 0;
      const word = commits === 1 ? "commit" : "commits";
      return {
        id: e.id,
        when,
        label: `Pushed ${commits} ${word}`,
        repo,
        url: `https://github.com/${e.repo.name}`,
      };
    }
    case "PullRequestEvent": {
      if (!e.payload.pull_request) return null;
      const action = e.payload.action ?? "updated";
      return {
        id: e.id,
        when,
        label: `${action[0]!.toUpperCase()}${action.slice(1)} PR: ${e.payload.pull_request.title}`,
        repo,
        url: e.payload.pull_request.html_url,
      };
    }
    case "CreateEvent": {
      const refType = e.payload.ref_type ?? "ref";
      return {
        id: e.id,
        when,
        label: `Created ${refType}`,
        repo,
        url: `https://github.com/${e.repo.name}`,
      };
    }
    case "WatchEvent": {
      return {
        id: e.id,
        when,
        label: "Starred",
        repo,
        url: `https://github.com/${e.repo.name}`,
      };
    }
    case "PublicEvent": {
      return {
        id: e.id,
        when,
        label: "Made public",
        repo,
        url: `https://github.com/${e.repo.name}`,
      };
    }
    default:
      return null;
  }
}

export async function GitHubActivity() {
  let events: DisplayEvent[] = [];
  let error: string | null = null;
  try {
    const res = await fetch(
      "https://api.github.com/users/AnisurK24/events/public?per_page=15",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 1800 },
      },
    );
    if (res.ok) {
      const data = (await res.json()) as GitHubEvent[];
      events = data.map(toDisplay).filter((x): x is DisplayEvent => x !== null).slice(0, 5);
    } else {
      error = `GitHub API ${res.status}`;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load activity";
  }

  if (error || events.length === 0) {
    return null;
  }

  return (
    <div className="mb-20 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] p-4 reveal is-visible">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[color:var(--color-fg-subtle)]">
          Recent GitHub activity
        </h2>
        <a
          href="https://github.com/AnisurK24"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[color:var(--color-fg-subtle)] hover:text-[color:var(--color-accent)]"
        >
          @AnisurK24 →
        </a>
      </div>
      <ul className="space-y-1.5 text-sm">
        {events.map((e) => (
          <li key={e.id} className="flex items-baseline gap-3">
            <span className="w-16 shrink-0 text-xs text-[color:var(--color-fg-subtle)]">
              {e.when}
            </span>
            <span className="flex-1 text-[color:var(--color-fg-muted)]">
              {e.label}{" "}
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--color-fg)] hover:text-[color:var(--color-accent)]"
              >
                {e.repo}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
