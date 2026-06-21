export type MessagePart =
  | { type: "text"; text: string }
  | { type: "tool"; tool: string; label: string; status: "running" | "done" | "error"; result?: string; duration?: string }
  | { type: "subagent"; name: string; goal: string; status: "running" | "done"; model?: string; duration?: string }
  | { type: "reasoning"; steps: string[]; status: "running" | "done" }
  | { type: "image"; url?: string; caption: string }
  | { type: "actions"; chips: { label: string; primary?: boolean }[] }
  | { type: "consent"; action: string; detail: string; channel?: string; to?: string; reversible?: boolean }
  | { type: "privacy"; routing: "on-device" | "cloud-with-consent"; note: string }
  | { type: "code"; lang: string; code: string; filename?: string }
  | { type: "table"; headers: string[]; rows: string[][] };

const AGENTS = {
  scout:     { name: "Scout",           model: "Perplexity Sonar Pro",  color: "text-emerald-400" },
  analyst:   { name: "Analyst",         model: "o3",                    color: "text-amber-400"   },
  writer:    { name: "Writer",          model: "Claude Sonnet 4",       color: "text-rose-400"    },
  coder:     { name: "Code Composer",   model: "Gemini 2.5 Pro",        color: "text-sky-400"     },
  designer:  { name: "Image Studio",    model: "Imagen 4 Ultra",        color: "text-fuchsia-400" },
  scheduler: { name: "Scheduler",       model: "o3-mini",               color: "text-cyan-400"    },
  memory:    { name: "Memory Weaver",   model: "On-device",             color: "text-violet-400"  },
  privacy:   { name: "Privacy Router",  model: "On-device",             color: "text-emerald-400" },
};

const TEMPLATES: { match: RegExp; reply: (m: string) => { parts: MessagePart[]; text: string } }[] = [
  // ─── Research / competitor / analysis ───────────────────────────────────────
  {
    match: /research|compare|competitor|analy|brief|one.pager|market/i,
    reply: () => ({
      text: "Orchestrated a multi-agent research pipeline. Here's the synthesized intelligence.",
      parts: [
        { type: "privacy", routing: "cloud-with-consent", note: "Web research runs cloud-side (non-personal data). Your draft stays local until you route it." },
        { type: "reasoning", steps: [
          "Decomposed query into 3 parallel tasks: search, compare, synthesize",
          "Dispatched Scout → Perplexity Sonar Pro (live web index, no hallucination on facts)",
          "Dispatched Analyst → o3 (structured reasoning, cross-validation of pricing)",
          "Merged with confidence weighting — conflicting data flagged, not averaged away",
        ], status: "done" },
        { type: "subagent", name: AGENTS.scout.name,   goal: "Search & extract 14 live competitor sites",          status: "done", model: AGENTS.scout.model,   duration: "3.2s" },
        { type: "subagent", name: AGENTS.analyst.name, goal: "Compare pricing, positioning, UX benchmarks",        status: "done", model: AGENTS.analyst.model, duration: "2.8s" },
        { type: "tool", tool: "web", label: "Searched 14 sources across the live web", status: "done", result: "linear.app · height.app · notion.so · asana.com · clickup.com · monday.com · trello.com", duration: "3.2s" },
        { type: "text", text: "**Executive Summary**\n\n• **Linear** — dominates on speed, keyboard-first UX, and developer culture. $15/user/mo.\n• **Height** — ships AI triage at $8/user/mo; best value for smaller teams.\n• **Notion Projects** — wins on adjacency to docs and wikis. $12/user/mo.\n• **ClickUp** — feature-bloated but cheapest at $7/user/mo.\n\n> Scout flagged a pricing conflict on ClickUp — confirmed $7 via their public checkout, not the $5 listed in some reviews." },
        { type: "actions", chips: [
          { label: "Draft one-pager", primary: true },
          { label: "Build slide deck" },
          { label: "Make battlecard" },
          { label: "Deeper on Linear" },
        ]},
      ],
    }),
  },

  // ─── Email / inbox / reply ───────────────────────────────────────────────────
  {
    match: /email|gmail|reply|draft|inbox|send.*mail|triage|unread/i,
    reply: () => ({
      text: "Drafted and queued. Awaiting your confirmation before anything is sent.",
      parts: [
        { type: "privacy", routing: "on-device", note: "Email content summarised on-device. Only the draft text (not your inbox) goes to Claude for tone calibration." },
        { type: "reasoning", steps: [
          "Identified thread from Maya Chen — subject: 'Re: Friday sync'",
          "Recalled tone preference from memory: warm, concise, zero exclamation marks",
          "Routed drafting to Claude Sonnet 4 with de-identified brief",
          "Draft reviewed against calendar — Friday is confirmed clear",
        ], status: "done" },
        { type: "tool", tool: "gmail",  label: "Located thread · drafted reply",         status: "done", result: "maya.chen@company.com — 'Re: Friday sync'",                           duration: "1.4s" },
        { type: "tool", tool: "memory", label: "Recalled tone & context preferences",     status: "done", result: "warm, concise, no exclamation marks; prefers bullet points",           duration: "0.2s" },
        { type: "tool", tool: "calendar", label: "Confirmed Friday is clear",             status: "done", result: "No conflicts · deep-work block ends at 10am",                          duration: "0.6s" },
        { type: "text", text: "> Hey Maya — thanks for the nudge. Friday works for me; I'll send a calendar invite shortly.\n>\n> Here's what I'll prep beforehand:\n> • Agenda outline\n> • Q3 metrics deck\n\nThis is queued — **not sent yet**. Say the word." },
        { type: "consent", action: "Send email to Maya Chen", detail: "Re: Friday sync — 2 sentences + bullet list", channel: "Gmail", to: "maya.chen@company.com", reversible: false },
        { type: "actions", chips: [
          { label: "Send it", primary: true },
          { label: "Edit draft" },
          { label: "Make it firmer" },
          { label: "Make it softer" },
        ]},
      ],
    }),
  },

  // ─── Image generation ────────────────────────────────────────────────────────
  {
    match: /image|picture|draw|generate.*image|edit.*photo|visual|hero|poster|banner/i,
    reply: () => ({
      text: "Generated via Image Studio with Imagen 4 Ultra. I can iterate on mood, palette, or composition.",
      parts: [
        { type: "reasoning", steps: [
          "Parsed prompt: composition, style, mood, output dimensions (1536×768)",
          "Routed to Imagen 4 Ultra — safety filter applied, no retained training",
          "Post-processed: colour grading + aspect-ratio crop",
        ], status: "done" },
        { type: "subagent", name: AGENTS.designer.name, goal: "Generate hero image with style constraints", status: "done", model: AGENTS.designer.model, duration: "4.1s" },
        { type: "image", caption: "Hero image — Imagen 4 Ultra · 1536×768 · 4.1s", url: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { type: "text", text: "Generated at 1536×768. Want me to:" },
        { type: "actions", chips: [
          { label: "Upscale to 4K",    primary: true },
          { label: "Cinematic mood" },
          { label: "Flat / minimal" },
          { label: "3D render style" },
          { label: "Save to Photos" },
        ]},
      ],
    }),
  },

  // ─── Calendar / scheduling ───────────────────────────────────────────────────
  {
    match: /schedule|meeting|calendar|book.*time|find.*slot|reschedule|invite/i,
    reply: () => ({
      text: "Cross-referenced 3 calendars, focus blocks, and travel buffers. Best windows below.",
      parts: [
        { type: "reasoning", steps: [
          "Checked 3 calendars (work, personal, shared) + your focus blocks (09–11am daily)",
          "Applied 45-min travel buffer rule for off-site meetings",
          "Ranked by least context-switch cost and energy profile",
        ], status: "done" },
        { type: "tool", tool: "calendar", label: "Queried 3 calendars + travel buffers", status: "done", result: "No conflicts · 2 focus blocks protected", duration: "1.8s" },
        { type: "subagent", name: AGENTS.scheduler.name, goal: "Find optimal window with minimal context-switch", status: "done", model: AGENTS.scheduler.model, duration: "1.8s" },
        { type: "table", headers: ["Slot", "Day", "Notes"], rows: [
          ["10:30 am", "Tuesday",   "After deep-work block · buffer before lunch"],
          ["2:00 pm",  "Wednesday", "Post-lunch energy · no conflicts"],
          ["9:15 am",  "Thursday",  "Early momentum · minimal prep"],
        ]},
        { type: "consent", action: "Send calendar invite", detail: "30-min meeting · your preferred slot", channel: "Google Calendar", reversible: true },
        { type: "actions", chips: [
          { label: "Book Tuesday 10:30", primary: true },
          { label: "Book Wednesday 2pm" },
          { label: "Book Thursday 9:15" },
          { label: "Draft agenda first" },
        ]},
      ],
    }),
  },

  // ─── Memory / save ───────────────────────────────────────────────────────────
  {
    match: /remember|note|save.*memory|keep.*mind|don't forget|store this/i,
    reply: (m) => ({
      text: "Saved to your persistent memory. I'll surface this across all future conversations.",
      parts: [
        { type: "privacy", routing: "on-device", note: "Memory is stored locally and encrypted. Nothing leaves your device." },
        { type: "tool", tool: "memory", label: "Indexed to local memory store", status: "done", result: m.slice(0, 120), duration: "0.4s" },
        { type: "text", text: "Stored in the **general** knowledge graph. I'll recall this when relevant — no need to repeat it.\n\nYou can view, edit, or erase this any time in the Memory tab." },
        { type: "actions", chips: [
          { label: "Set category" },
          { label: "View my memory" },
          { label: "Undo save" },
        ]},
      ],
    }),
  },

  // ─── Code / debugging / build ────────────────────────────────────────────────
  {
    match: /code|write.*code|build.*app|debug|program|function|api|typescript|python|sql|refactor/i,
    reply: () => ({
      text: "Routed to Code Composer with 200k context. Here's the implementation.",
      parts: [
        { type: "reasoning", steps: [
          "Parsed intent: generate TypeScript utility, identify patterns and constraints",
          "Routed to Gemini 2.5 Pro (200k context window) for full-file generation",
          "Validated with static analysis — zero errors, 3 minor warnings",
          "Type safety confirmed: strict mode, no any, full inference",
        ], status: "done" },
        { type: "subagent", name: AGENTS.coder.name, goal: "Generate production-ready code with full type safety", status: "done", model: AGENTS.coder.model, duration: "5.7s" },
        { type: "tool", tool: "code", label: "Syntax validated · types inferred", status: "done", result: "0 errors · 3 warnings (minor)", duration: "5.7s" },
        { type: "code", lang: "typescript", filename: "parseConfig.ts", code: `import { z } from "zod";

const schema = z.object({
  endpoint: z.string().url(),
  timeout:  z.number().min(100).max(30_000).default(5000),
  retries:  z.number().min(0).max(5).default(3),
});

export type Config = z.infer<typeof schema>;

export function parseConfig(raw: unknown): Config {
  return schema.parse(raw); // throws ZodError on invalid input
}` },
        { type: "text", text: "Zero-dependency, fully typed, throws a descriptive error on invalid input." },
        { type: "actions", chips: [
          { label: "Write tests",    primary: true },
          { label: "Add JSDoc" },
          { label: "Scaffold project" },
          { label: "Explain line-by-line" },
        ]},
      ],
    }),
  },

  // ─── WhatsApp / messaging ────────────────────────────────────────────────────
  {
    match: /whatsapp|imessage|telegram|signal|message.*send|send.*message|text.*them/i,
    reply: () => ({
      text: "Message drafted and ready. I'll only send it when you confirm.",
      parts: [
        { type: "reasoning", steps: [
          "Detected channel preference: iMessage (primary) · WhatsApp (fallback)",
          "Confirmed recipient from contacts — no ambiguity",
          "Message drafted · awaiting consent before dispatch",
        ], status: "done" },
        { type: "tool", tool: "imessage", label: "Draft ready via Raft agent network", status: "done", result: "Pending your confirmation", duration: "0.4s" },
        { type: "text", text: "Ready to send:\n> **\"The build's done — deploying now. Will ping you when live.\"**\n\nSending to: **Alex (iMessage)**" },
        { type: "consent", action: "Send iMessage to Alex", detail: "\"The build's done — deploying now.\"", channel: "iMessage · Raft network", reversible: false },
        { type: "actions", chips: [
          { label: "Send it", primary: true },
          { label: "Edit message" },
          { label: "Use WhatsApp instead" },
          { label: "Schedule for later" },
        ]},
      ],
    }),
  },

  // ─── Slack / team channels ───────────────────────────────────────────────────
  {
    match: /slack|discord|team.*chat|channel|standup|post.*update/i,
    reply: () => ({
      text: "Drafted for Slack with Block Kit formatting. Awaiting your go-ahead.",
      parts: [
        { type: "tool", tool: "slack", label: "Drafted for #product-updates", status: "done", result: "Block Kit · threaded context", duration: "1.1s" },
        { type: "text", text: "**Draft for #product-updates:**\n\n> 🚀 **Sage v0.17 shipped** — The Reach Release\n> • iMessage bridge (no Mac relay)\n> • Background sub-agents\n> • On-device memory encryption\n>\n> Full changelog → [link]" },
        { type: "consent", action: "Post to #product-updates", detail: "Sage v0.17 release announcement", channel: "Slack", reversible: true },
        { type: "actions", chips: [
          { label: "Post it",    primary: true },
          { label: "Edit copy" },
          { label: "Add thread" },
          { label: "Try #general" },
        ]},
      ],
    }),
  },

  // ─── Morning brief / daily summary ──────────────────────────────────────────
  {
    match: /brief me|morning brief|what.*today|daily.*summary|what.*on.*today|my day/i,
    reply: () => ({
      text: "Good morning. Here's your day, assembled from 4 local sources — no personal data left your device.",
      parts: [
        { type: "privacy", routing: "on-device", note: "Calendar, email summary, and memory queried entirely on-device. Only the news feed is fetched from the web." },
        { type: "tool", tool: "calendar", label: "Today's calendar — 3 events", status: "done", result: "Standup 9am · Design review 2pm · 1:1 with Alex 4pm", duration: "0.3s" },
        { type: "tool", tool: "gmail",    label: "Priority inbox — 2 need replies", status: "done", result: "Maya Chen (Friday sync) · Legal (contract deadline tomorrow)", duration: "0.5s" },
        { type: "tool", tool: "memory",   label: "Context retrieved",               status: "done", result: "Q3 review prep ongoing · Prefer 25-min buffer before calls",  duration: "0.1s" },
        { type: "tool", tool: "web",      label: "News digest",                     status: "done", result: "3 items from monitored topics",                                duration: "1.2s" },
        { type: "text", text: "**Your Monday**\n\n⏰ **Standup at 9am** — 14 minutes from now\n📧 **2 priority emails** — Maya Chen and Legal\n🎯 **Focus block** 11am–1pm (protected)\n📊 **Design review** 2pm — your deck is prepped\n\n📰 **In the news:** Model routing benchmarks drop · New privacy regulation · SA load-shedding schedule updated" },
        { type: "actions", chips: [
          { label: "Draft reply to Maya",    primary: true },
          { label: "Skip to Legal email" },
          { label: "Prep standup notes" },
          { label: "What's in my news?" },
        ]},
      ],
    }),
  },

  // ─── Travel / trip planning ──────────────────────────────────────────────────
  {
    match: /travel|trip|flight|hotel|nairobi|cape town|itinerary|plan.*days/i,
    reply: () => ({
      text: "Drafted a 2-day Nairobi itinerary built around your Thursday meeting. Sub-agents handled flight and hotel research.",
      parts: [
        { type: "privacy", routing: "cloud-with-consent", note: "Itinerary research runs cloud-side (non-personal). Calendar event details stayed on-device." },
        { type: "subagent", name: "Flight Scout",   goal: "Find NBO flights around Thursday meeting",   status: "done", model: "Perplexity Sonar", duration: "4.2s" },
        { type: "subagent", name: "Hotel Scout",    goal: "Compare hotels near CBD under $180/night",  status: "done", model: "Perplexity Sonar", duration: "3.8s" },
        { type: "subagent", name: AGENTS.writer.name, goal: "Assemble final itinerary with buffers",   status: "done", model: AGENTS.writer.model, duration: "2.1s" },
        { type: "text", text: "**2-day Nairobi itinerary (around Thursday 10am meeting)**\n\n**Wednesday**\n• Arrive JKIA · Check-in Tribe Hotel ($165/night, highly rated)\n• Karen Blixen Museum · Carnivore for dinner\n\n**Thursday**\n• ⚠️ Meeting 10am–12pm (protected)\n• Giraffe Centre · Nairobi National Park afternoon\n• Depart JKIA 8pm\n\n> 3 flights shortlisted · 2 hotels compared · Uber transit estimated throughout" },
        { type: "actions", chips: [
          { label: "Edit itinerary",    primary: true },
          { label: "See flights" },
          { label: "Compare hotels" },
          { label: "Add to calendar" },
          { label: "Message driver" },
        ]},
      ],
    }),
  },

  // ─── Meeting capture / transcription ────────────────────────────────────────
  {
    match: /capture.*meeting|transcribe|record.*meeting|meeting.*notes|follow.?up/i,
    reply: () => ({
      text: "Meeting captured and processed on-device. Here's the summary and action items.",
      parts: [
        { type: "privacy", routing: "on-device", note: "Transcription and summarisation ran entirely on-device. Audio and transcript are local-only unless you export." },
        { type: "tool", tool: "reason", label: "On-device STT transcription",  status: "done", result: "41 min · 3 speakers identified",                 duration: "12s" },
        { type: "tool", tool: "memory", label: "Decisions and AIs extracted",   status: "done", result: "4 decisions · 7 action items · 3 owners",       duration: "0.8s" },
        { type: "text", text: "**Q3 Design Review — 41 min**\n\n**Decisions made:**\n1. Ship mobile nav redesign in sprint 22\n2. Delay desktop until after user testing\n3. Alex owns the motion spec\n4. Budget approved for Figma Enterprise\n\n**Action items:**\n• [You] Share updated deck by EOD → **Today**\n• [Alex] Motion spec draft → **Thu**\n• [Maya] Schedule user tests → **Fri**\n• [You] Notify stakeholders → pending your send" },
        { type: "consent", action: "Send follow-up email to all attendees", detail: "Meeting summary + 7 action items with owners", channel: "Gmail", reversible: false },
        { type: "actions", chips: [
          { label: "Send follow-up",    primary: true },
          { label: "Edit summary" },
          { label: "Export transcript" },
          { label: "Add tasks to Linear" },
        ]},
      ],
    }),
  },

  // ─── Difficult reply / strategy ──────────────────────────────────────────────
  {
    match: /push.*back|difficult|push back|hard.*message|how.*respond|strategic.*reply|tension/i,
    reply: () => ({
      text: "Read the thread. Here are 3 strategically distinct reply approaches — pick or blend.",
      parts: [
        { type: "privacy", routing: "on-device", note: "Thread read locally. Only a de-identified brief (no names, no amounts) is sent for drafting assistance." },
        { type: "reasoning", steps: [
          "Identified competing goals: preserve relationship vs. hold the boundary",
          "Flagged emotional stakes — going slow, no auto-send",
          "Drafted 3 distinct strategies with explicit trade-offs",
        ], status: "done" },
        { type: "text", text: "**Option A — Hold firm** *(recommended)*\n> Thanks for this. My position hasn't changed — I need the revised timeline in writing before we proceed. Happy to discuss on a call this week.\n\n*Trade-off: Clear but may feel cold. Best if the relationship can absorb it.*\n\n---\n\n**Option B — Concede & redirect**\n> I hear you. I can move on X if we lock in Y as a condition. Let's get that in writing.\n\n*Trade-off: Shows flexibility; risks precedent.*\n\n---\n\n**Option C — Buy time**\n> I want to give this proper thought — can I come back to you by Thursday?\n\n*Trade-off: Buys space; may read as avoidance.*" },
        { type: "actions", chips: [
          { label: "Send Option A",    primary: true },
          { label: "Send Option B" },
          { label: "Send Option C" },
          { label: "Blend A + C" },
          { label: "Make it warmer" },
        ]},
      ],
    }),
  },

  // ─── GitHub / CI / PR ────────────────────────────────────────────────────────
  {
    match: /github|ci|pull request|pr|deploy|build.*pass|branch|commit|regression/i,
    reply: () => ({
      text: "Queried GitHub. CI is green on the Sage branch — 1 PR needs your review.",
      parts: [
        { type: "tool", tool: "code", label: "GitHub: checked CI on `sage/feature-memory`", status: "done", result: "✅ All 47 checks passed · 4m 12s", duration: "1.3s" },
        { type: "text", text: "**CI Status: ✅ All clear**\n\nBranch: `sage/feature-memory`\nLast commit: `feat: add atomic memory ops` (2h ago)\n47/47 checks passing · 4m 12s build time\n\n**Open PRs (1 needs review):**\n• `#283` — Fix privacy router on cold start → 2 comments, no blocking issues" },
        { type: "actions", chips: [
          { label: "Review PR #283",    primary: true },
          { label: "Re-run checks" },
          { label: "Merge when ready" },
          { label: "Post status to Slack" },
        ]},
      ],
    }),
  },

  // ─── Build custom skill ──────────────────────────────────────────────────────
  {
    match: /make.*skill|build.*skill|create.*workflow|custom.*automation|every.*friday|weekly.*skill/i,
    reply: () => ({
      text: "Built your custom skill. It's private, local, and scoped to only the permissions it needs.",
      parts: [
        { type: "privacy", routing: "on-device", note: "Skills are private and local by default — never published to a shared hub unless you explicitly export one." },
        { type: "tool", tool: "memory", label: "Skill saved to private library", status: "done", result: "Weekly Digest · runs every Friday 5pm", duration: "0.3s" },
        { type: "text", text: "**Skill: Weekly Digest** ✅ Created\n\n📋 **What it does:** Every Friday at 5pm, summarises your week's notes into a status update draft, then asks you to approve before sending.\n\n🔐 **Permissions scoped:**\n• ✅ Read Notes (this week's)\n• ✅ Draft message (no auto-send)\n• ❌ Access calendar or email\n\n⏱ **Schedule:** Fridays · 5:00pm\n🔒 **Visibility:** Private · local only" },
        { type: "actions", chips: [
          { label: "Run it now",    primary: true },
          { label: "Edit schedule" },
          { label: "Adjust scope" },
          { label: "View skills library" },
        ]},
      ],
    }),
  },

  // ─── Vision / camera / receipt ───────────────────────────────────────────────
  {
    match: /photo|camera|receipt|split.*bill|scan|read.*this|what.*is.*this|ocr/i,
    reply: () => ({
      text: "Read the bill and split it three ways. Want me to send each person their amount?",
      parts: [
        { type: "privacy", routing: "on-device", note: "Vision processing ran on-device. Image is discarded after this task unless you save it." },
        { type: "tool", tool: "image", label: "On-device OCR · bill parsed", status: "done", result: "Total: R847.50 · 3 items identified", duration: "1.1s" },
        { type: "table", headers: ["Item", "Amount", "Split (÷3)"], rows: [
          ["Mains × 3",    "R510.00", "R170.00 / person"],
          ["Drinks × 4",  "R220.00", "R73.33 / person"],
          ["10% tip",     "R117.50", "R39.17 / person"],
          ["**Total**",   "**R847.50**", "**R282.50 / person**"],
        ]},
        { type: "actions", chips: [
          { label: "Message amounts to table",    primary: true },
          { label: "Log as receipt" },
          { label: "Adjust tip %" },
          { label: "Remove a person" },
        ]},
      ],
    }),
  },

  // ─── Health / medication ─────────────────────────────────────────────────────
  {
    match: /medication|meds|remind.*medicine|appointment.*prep|doctor|health|symptoms/i,
    reply: () => ({
      text: "Reminders set. I've also started an appointment prep list — all health notes stay on-device, in your vault.",
      parts: [
        { type: "privacy", routing: "on-device", note: "All health notes stay on-device in the vault. Nothing is shared without your explicit consent." },
        { type: "tool", tool: "calendar", label: "Medication reminders set · 3 daily", status: "done", result: "8am · 1pm · 8pm reminders created", duration: "0.4s" },
        { type: "tool", tool: "memory",   label: "Appointment prep started",             status: "done", result: "Thursday appointment · questions list",  duration: "0.2s" },
        { type: "text", text: "**Reminders set** ✅\n• 8:00am, 1:00pm, 8:00pm daily\n\n**Appointment prep (Thursday):**\nI've started a questions list — add anything you want to raise:\n• [ ] Duration of symptoms\n• [ ] Any changes since last visit\n• [ ] Questions about current prescription\n\n⚠️ *Sage helps with logistics only — I won't diagnose, dose, or advise on treatment. That's your clinician's call.*" },
        { type: "actions", chips: [
          { label: "Add a question",    primary: true },
          { label: "View prep list" },
          { label: "Set pre-appointment reminder" },
        ]},
      ],
    }),
  },

  // ─── Privacy / data / what do you know ──────────────────────────────────────
  {
    match: /what.*remember|what.*know.*me|my data|privacy|erase|export.*data|forget/i,
    reply: () => ({
      text: "Here's everything I'm holding about you — inspectable, editable, and erasable at any time.",
      parts: [
        { type: "privacy", routing: "on-device", note: "Memory is user-inspectable and user-editable. Deletion is real deletion — no soft-delete or shadow copy." },
        { type: "tool", tool: "memory", label: "Memory index retrieved", status: "done", result: "23 entries · 6 categories · last updated 2h ago", duration: "0.2s" },
        { type: "text", text: "**What I'm holding (23 entries):**\n\n🎯 **Preferences (8)** — tone, email length, meeting buffers, focus hours\n👤 **People (5)** — Maya Chen, Alex, co-founder, landlord, accountant\n📁 **Projects (4)** — Q3 review, Sage dev, travel plan, lease renewal\n💡 **Knowledge (3)** — programming style, writing voice, preferred models\n🔄 **Workflows (2)** — Weekly Digest skill, inbox triage schedule\n📝 **General (1)** — misc notes\n\n**Skills with active permissions (3):**\n• Gmail — read, draft (no auto-send)\n• Calendar — read, write with consent\n• Weekly Digest — read Notes, draft only\n\nFull export and per-entry erasure are in the Memory tab." },
        { type: "actions", chips: [
          { label: "Open Memory tab",    primary: true },
          { label: "Export all data" },
          { label: "Erase everything" },
          { label: "Review permissions" },
        ]},
      ],
    }),
  },
];

// ─── Fallback ────────────────────────────────────────────────────────────────
const FALLBACK = (m: string): { text: string; parts: MessagePart[] } => ({
  text: "Orchestrating the best model for this task.",
  parts: [
    { type: "reasoning", steps: [
      "Analysed query intent and complexity",
      "Checked memory for relevant prior context",
      "Routed to Gemini 2.5 Flash for fast reasoning",
      "Standing by for sub-agent delegation if needed",
    ], status: "done" },
    { type: "tool", tool: "reason", label: "Routed to Gemini 2.5 Flash", status: "done", duration: "0.9s" },
    { type: "text", text: `Here's how I'd approach **"${m.slice(0, 80)}"**:\n\n1. **Clarify** the goal in one sentence.\n2. **Pull** any relevant memory, files, or context.\n3. **Delegate** long-running parts to a sub-agent.\n\nWant me to take the first step now, or talk it through?` },
    { type: "actions", chips: [
      { label: "Start now",    primary: true },
      { label: "Talk it through" },
      { label: "Research first" },
    ]},
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
