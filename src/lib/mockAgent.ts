export type MessagePart =
  | { type: "text"; text: string }
  | { type: "tool"; tool: string; label: string; status: "running" | "done" | "error"; result?: string; duration?: string }
  | { type: "subagent"; name: string; goal: string; status: "running" | "done"; model?: string; duration?: string }
  | { type: "reasoning"; steps: string[]; status: "running" | "done" }
  | { type: "image"; url?: string; caption: string };

const AGENTS = {
  scout: { name: "Scout", model: "Perplexity Sonar", color: "text-emerald-400" },
  analyst: { name: "Analyst", model: "o3-mini", color: "text-amber-400" },
  writer: { name: "Writer", model: "Claude 3.5 Sonnet", color: "text-rose-400" },
  coder: { name: "Code Composer", model: "Gemini 2.5 Pro", color: "text-sky-400" },
  designer: { name: "Image Studio", model: "Gemini 2.0 Flash", color: "text-fuchsia-400" },
  scheduler: { name: "Scheduler", model: "o3-mini", color: "text-cyan-400" },
};

const TEMPLATES: { match: RegExp; reply: (m: string) => { parts: MessagePart[]; text: string } }[] = [
  {
    match: /research|compare|competitor|analy/i,
    reply: () => ({
      text: "Orchestrated a multi-agent research pipeline. Here's the synthesized intelligence.",
      parts: [
        { type: "reasoning", steps: [
          "Decomposed query into 3 sub-tasks: search, compare, synthesize",
          "Routed search to Perplexity Sonar (live web), comparison to o3-mini (structured reasoning)",
          "Merged outputs with confidence weighting and cross-validation",
        ], status: "done" },
        { type: "subagent", name: AGENTS.scout.name, goal: "Search & scrape 14 competitor sites", status: "done", model: AGENTS.scout.model, duration: "3.2s" },
        { type: "subagent", name: AGENTS.analyst.name, goal: "Compare pricing, positioning, and UX benchmarks", status: "done", model: AGENTS.analyst.model, duration: "2.8s" },
        { type: "tool", tool: "web", label: "Searched 14 sources across the live web", status: "done", result: "linear.app, height.app, notion.so, asana.com, clickup.com, monday.com, trello.com, jira.atlassian.com", duration: "3.2s" },
        { type: "text", text: "**Executive Summary**\n\n• **Linear** — dominates on speed, keyboard-first UX, and developer culture. $15/user/mo.\n• **Height** — ships AI triage at $8/user/mo; best value for smaller teams.\n• **Notion Projects** — wins on adjacency to docs and wikis. $12/user/mo.\n• **ClickUp** — feature-bloated but cheapest at $7/user/mo.\n\nWant me to draft a one-page brief, a slide deck, or a competitive battlecard?" },
      ],
    }),
  },
  {
    match: /email|gmail|reply|draft|inbox|send.*mail/i,
    reply: () => ({
      text: "Drafted and queued in your outbox. I'll send it when you confirm.",
      parts: [
        { type: "reasoning", steps: [
          "Identified thread from Maya Chen in Gmail",
          "Recalled tone preference: warm, concise, zero exclamation marks",
          "Routed drafting to Claude 3.5 Sonnet for tone calibration",
        ], status: "done" },
        { type: "tool", tool: "gmail", label: "Located thread and drafted reply", status: "done", result: "maya.chen@company.com — 'Re: Friday sync'", duration: "1.4s" },
        { type: "tool", tool: "memory", label: "Recalled tone & context preferences", status: "done", result: "warm, concise, no exclamation marks; prefers bullet points", duration: "0.2s" },
        { type: "text", text: "> Hey Maya — thanks for the nudge. Friday works on my end; I'll send a calendar invite shortly.\n>\n> Here's what I'll prep beforehand:\n> • Agenda outline\n> • Q3 metrics deck\n>\n> Say **'send it'** and I'll dispatch. Say **'edit'** and I'll rewrite." },
      ],
    }),
  },
  {
    match: /image|picture|draw|generate.*image|edit.*photo|visual/i,
    reply: () => ({
      text: "Generated via Image Studio with Gemini 2.0 Flash. I can iterate on mood, palette, or composition.",
      parts: [
        { type: "reasoning", steps: [
          "Parsed image prompt: composition, style, mood, dimensions",
          "Routed to Gemini 2.0 Flash Image with safety filter",
          "Post-processed for color grading and aspect ratio",
        ], status: "done" },
        { type: "subagent", name: AGENTS.designer.name, goal: "Generate hero image with style constraints", status: "done", model: AGENTS.designer.model, duration: "4.1s" },
        { type: "image", caption: "Hero image — generated 4.1s", url: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { type: "text", text: "Generated at 1536×768. Want me to:\n• **Upscale** to 3072×1536?\n• **Restyle** with a different mood (cinematic, flat, 3D)?\n• **Edit** specific elements (swap objects, adjust lighting)?" },
      ],
    }),
  },
  {
    match: /schedule|meeting|calendar|book|find.*time/i,
    reply: () => ({
      text: "Cross-referenced 3 calendars, focus blocks, and travel buffers. Here are the best slots.",
      parts: [
        { type: "reasoning", steps: [
          "Checked 3 calendars (work, personal, shared) + your focus blocks",
          "Applied travel buffer rules (45 min pre-flight)",
          "Ranked by least context-switch cost",
        ], status: "done" },
        { type: "tool", tool: "calendar", label: "Queried 3 calendars + travel buffers", status: "done", result: "No conflicts found. 2 focus blocks protected.", duration: "1.8s" },
        { type: "subagent", name: AGENTS.scheduler.name, goal: "Find optimal meeting window with minimal context-switch", status: "done", model: AGENTS.scheduler.model, duration: "1.8s" },
        { type: "text", text: "**Recommended slots** (all times PST):\n\n1. **Tue 10:30** — after deep-work block, buffer before lunch\n2. **Wed 14:00** — post-lunch energy, no conflicts\n3. **Thu 09:15** — early momentum, minimal prep needed\n\nWhich one? I'll send the invite and draft the agenda." },
      ],
    }),
  },
  {
    match: /remember|note|save|store|keep.*mind/i,
    reply: (m) => ({
      text: "Saved to your persistent memory. I'll surface this context across all future conversations.",
      parts: [
        { type: "tool", tool: "memory", label: "Indexed to vector memory store", status: "done", result: m.slice(0, 120), duration: "0.4s" },
        { type: "text", text: "Stored in the **general** knowledge graph. I'll recall this when relevant — no need to repeat it." },
      ],
    }),
  },
  {
    match: /code|write.*code|build.*app|debug|program|function|api/i,
    reply: () => ({
      text: "Routed to Code Composer with 200k context. Here's the implementation.",
      parts: [
        { type: "reasoning", steps: [
          "Parsed intent: generate code, identify language, framework, and patterns",
          "Routed to Gemini 2.5 Pro (200k context) for full-file generation",
          "Validated syntax and type safety with static analysis",
        ], status: "done" },
        { type: "subagent", name: AGENTS.coder.name, goal: "Generate production-ready code with type safety", status: "done", model: AGENTS.coder.model, duration: "5.7s" },
        { type: "tool", tool: "code", label: "Syntax validated, types inferred", status: "done", result: "Zero errors, 3 warnings (minor)", duration: "5.7s" },
        { type: "text", text: "**Generated a TypeScript utility with full type safety:**\n\n```typescript\nexport function parseConfig<T>(raw: unknown): T {\n  // validated at runtime with Zod\n  return schema.parse(raw);\n}\n```\n\nWant me to write tests, add docs, or scaffold the entire project?" },
      ],
    }),
  },
  {
    match: /whatsapp|message|sms|text|imessage|telegram|signal|raft/i,
    reply: () => ({
      text: "Message queued via Raft network. Delivered to the right channel without a relay.",
      parts: [
        { type: "reasoning", steps: [
          "Detected channel preference: iMessage (primary), WhatsApp (fallback)",
          "Routed via Raft agent network — no Mac relay required",
          "End-to-end encrypted via Raft protocol",
        ], status: "done" },
        { type: "tool", tool: "imessage", label: "Dispatched via Raft agent network", status: "done", result: "Delivered · read receipt pending", duration: "0.8s" },
        { type: "text", text: "Message sent via **iMessage Bridge** (no Mac relay).\n\nAlso configured as fallback on **WhatsApp Cloud API** if iMessage unavailable.\n\nWant delivery tracking or a scheduled follow-up?" },
      ],
    }),
  },
  {
    match: /slack|discord|team.*chat|channel/i,
    reply: () => ({
      text: "Posted to Slack with rich formatting and threaded context.",
      parts: [
        { type: "tool", tool: "slack", label: "Posted to #product-updates", status: "done", result: "Thread created · 2 reactions", duration: "1.1s" },
        { type: "text", text: "Posted with rich Block Kit formatting and a thread for follow-up.\n\nI can also:\n• Summarize channel activity\n• Draft standup updates\n• Auto-react based on sentiment" },
      ],
    }),
  },
];

const FALLBACK = (m: string): { text: string; parts: MessagePart[] } => ({
  text: "Orchestrating the best model for this task.",
  parts: [
    { type: "reasoning", steps: [
      "Analyzed query intent and complexity",
      "Routed to Gemini 3 Flash for fast reasoning",
      "Standing by for sub-agent delegation if needed",
    ], status: "done" },
    { type: "tool", tool: "reason", label: "Routed to Gemini 3 Flash for reasoning", status: "done", duration: "0.9s" },
    { type: "text", text: `Here's how I'd approach **"${m.slice(0, 80)}"**:\n\n1. **Clarify** the goal in one sentence.\n2. **Pull** any relevant memory, files, or context.\n3. **Delegate** long-running parts to a sub-agent.\n\nWant me to take the first step now, or just talk it through?` },
  ],
});

export function mockReply(message: string): { text: string; parts: MessagePart[] } {
  for (const t of TEMPLATES) if (t.match.test(message)) return t.reply(message);
  return FALLBACK(message);
}

export function makeThreadTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 40) return trimmed;
  return trimmed.slice(0, 38).trimEnd() + "…";
}

export function getAgentMeta(name: string) {
  return Object.values(AGENTS).find(a => a.name === name) ?? { name, model: "Unknown", color: "text-muted-foreground" };
}
