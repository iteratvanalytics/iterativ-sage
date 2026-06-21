export type MessagePart =
  | { type: "text"; text: string }
  | { type: "tool"; tool: string; label: string; status: "running" | "done" | "error"; result?: string }
  | { type: "subagent"; name: string; goal: string; status: "running" | "done" };

const TEMPLATES: { match: RegExp; reply: (m: string) => { parts: MessagePart[]; text: string } }[] = [
  {
    match: /research|compare|competitor|analy/i,
    reply: () => ({
      text: "I dispatched two sub-agents to run this in parallel. Here's what they found.",
      parts: [
        { type: "subagent", name: "Scout", goal: "Search & scrape competitor sites", status: "done" },
        { type: "subagent", name: "Analyst", goal: "Compare pricing & positioning", status: "done" },
        { type: "tool", tool: "web", label: "Searched 14 sources across the web", status: "done", result: "linear.app, height.app, notion.so, asana.com, …" },
        { type: "text", text: "**Summary**\n\n• Linear leads on speed and keyboard UX.\n• Height ships AI triage at a lower price point.\n• Notion Projects wins on adjacency to docs.\n\nWant me to draft a one-page brief or a slide deck?" },
      ],
    }),
  },
  {
    match: /email|gmail|reply|draft/i,
    reply: () => ({
      text: "Drafted in Gmail and waiting in your drafts folder.",
      parts: [
        { type: "tool", tool: "gmail", label: "Opened Gmail and located the thread", status: "done" },
        { type: "tool", tool: "memory", label: "Recalled your tone preferences", status: "done", result: "warm, concise, no exclamation marks" },
        { type: "text", text: "**Draft preview**\n\n> Hey Maya — thanks for the nudge. Friday works on my end; I'll send a calendar invite shortly. Anything you want me to prep beforehand?\n\nSay 'send it' and I will." },
      ],
    }),
  },
  {
    match: /image|picture|draw|generate.*image|edit.*photo/i,
    reply: () => ({
      text: "Routed to the image model. Here's a first pass.",
      parts: [
        { type: "tool", tool: "image", label: "Generated image with gemini-3-image", status: "done" },
        { type: "text", text: "I can iterate — tell me what to change (mood, palette, composition)." },
      ],
    }),
  },
  {
    match: /schedule|meeting|calendar|book/i,
    reply: () => ({
      text: "Found three slots that work for everyone.",
      parts: [
        { type: "tool", tool: "calendar", label: "Checked 3 calendars + your focus blocks", status: "done" },
        { type: "text", text: "**Tue 10:30 · Wed 14:00 · Thu 09:15** — which one do you want me to send?" },
      ],
    }),
  },
  {
    match: /remember|note|save/i,
    reply: (m) => ({
      text: "Got it — I'll keep that in mind across our chats.",
      parts: [
        { type: "tool", tool: "memory", label: "Saved to long-term memory", status: "done", result: m.slice(0, 120) },
      ],
    }),
  },
];

const FALLBACK = (m: string): { text: string; parts: MessagePart[] } => ({
  text: "Thinking through this for you.",
  parts: [
    { type: "tool", tool: "reason", label: "Routed to gemini-3-flash for reasoning", status: "done" },
    { type: "text", text: `Here's how I'd approach **"${m.slice(0, 80)}"**:\n\n1. Clarify the goal in one sentence.\n2. Pull in any relevant memory or files.\n3. Hand off the long-running parts to a sub-agent.\n\nWant me to take the first step now, or just talk it through?` },
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