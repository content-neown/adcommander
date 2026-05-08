import type { SearchSource } from "@/types";

interface BraveResult {
  title: string;
  url: string;
  description: string;
  age?: string;
}

interface BraveResponse {
  web?: {
    results: BraveResult[];
  };
}

export async function searchWeb(query: string, count = 5): Promise<SearchSource[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;

  if (!apiKey) {
    console.warn("BRAVE_SEARCH_API_KEY not set — skipping web search");
    return [];
  }

  try {
    const url = new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.set("q", query);
    url.searchParams.set("count", String(count));
    url.searchParams.set("freshness", "pm"); // past month

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Brave search failed:", res.status);
      return [];
    }

    const data: BraveResponse = await res.json();
    return (data.web?.results ?? []).map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.description,
    }));
  } catch (e) {
    console.error("Search error:", e);
    return [];
  }
}

export function buildSearchQuery(stage: string, brief: { product: string; objective: string }): string {
  const queries: Record<string, string> = {
    ideation:  `Meta Ads ${brief.objective} creative strategy 2025 best practices`,
    scripts:   `Meta Ads high converting ad copy hooks ${brief.product} examples`,
    structure: `Meta Andromeda AI campaign structure optimization ROAS 2025`,
    creative:  `Meta Ads creative formats performance ${brief.objective} 2025`,
    launch:    `Meta Ads launch checklist CAPI Pixel setup 2025 best practices`,
  };
  return queries[stage] ?? `Meta Ads optimization ${brief.product} ${brief.objective} 2025`;
}

export function formatSourcesForPrompt(sources: SearchSource[]): string {
  if (!sources.length) return "";
  return `\n\nRECENT WEB INTELLIGENCE (use these to add current, specific insights):\n${sources
    .map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet}\nSource: ${s.url}`)
    .join("\n\n")}`;
}
