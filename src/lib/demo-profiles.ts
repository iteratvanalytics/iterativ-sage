/**
 * 5 fully-realised demo personas for complete feature demonstrations.
 * Each persona includes: profile, threads, memories, skills, agents.
 * Switching a persona swaps the user context so the entire app feels
 * lived-in.
 */

export interface PersonaProfile {
  id: string;
  name: string;
  role: string;
  location: string;
  plan: "PRO" | "Plus" | "Free";
  tagline: string;
  avatar: string;
}

export interface PersonaThread {
  title: string;
  preview: string;
  updated_at: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export interface PersonaMemory {
  content: string;
  category: string;
  created_at: string;
}

export interface PersonaSkill {
  id: string;
  name: string;
  desc: string;
  status: "installed" | "connected" | "pending" | "available";
  color: string;
}

export interface PersonaAgent {
  id: string;
  name: string;
  goal: string;
  status: "running" | "scheduled" | "done" | "paused";
  model: string;
  progress: number;
  eta: string;
  lastOutput: string;
  privacy: "on-device" | "cloud-with-consent";
  subagents: {
    name: string;
    model: string;
    goal: string;
    status: "done" | "running";
    duration?: string;
  }[];
}

export interface DemoPersona {
  profile: PersonaProfile;
  threads: PersonaThread[];
  memories: PersonaMemory[];
  skills: PersonaSkill[];
  agents: PersonaAgent[];
}

export const PERSONAS: DemoPersona[] = [
  // ─── 1. ZARA MTHEMBU — Creative Director ───────────────────────────
  {
    profile: {
      id: "zara-mthembu",
      name: "Zara Mthembu",
      role: "Creative Director, The Brave Collective",
      location: "Johannesburg",
      plan: "PRO",
      tagline: "Turning chaos into campaigns since 2019",
      avatar:
        "https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    threads: [
      {
        title: "Nando's brief — Q3 campaign",
        preview: "Draft three concept directions: fire, family, and flavour-forward...",
        updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "I need three concept directions for the Nando's Q3 campaign. Budget is R2.4M. Focus on Gen Z and family dining.",
          },
          {
            role: "assistant",
            content:
              "**Concept A: Fire Forward** — Hero the PERi-PERi flame as a character. Fast cuts, street culture, influencer-led.\n\n**Concept B: Family Table** — Sunday lunch scenes, multi-generational, nostalgia-driven.\n\n**Concept C: Flavour Lab** — Behind-the-scenes kitchen science, ASMR, TikTok format.\n\nWant me to draft scripts for any of these?",
          },
        ],
      },
      {
        title: "Competitor watch — Chicken Licken",
        preview: "They dropped a new 'Soul Sister' spot. Let me analyse the creative...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Analyse the new Chicken Licken 'Soul Sister' campaign. What's the insight? How should we respond?",
          },
          {
            role: "assistant",
            content:
              "**Insight:** Nostalgia + humour + family identity. The 'Soul Sister' reframe makes the meal feel like a ritual.\n\n**Our response:** Nando's should double down on *authenticity* — real families, real fire, no scripting. Think: 'Your PERi-PERi story' UGC campaign.",
          },
        ],
      },
      {
        title: "Voice note — taxi rank shoot",
        preview: "Transcribed: 'The light at Bree Street at 5pm is golden, we should...'",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        messages: [
          { role: "user", content: "[Voice note]" },
          {
            role: "assistant",
            content:
              "**Transcribed:** 'The light at Bree Street at 5pm is golden, we should scout there for the B-roll. Also, the taxi drivers are surprisingly cooperative — ask them about the 'Dunusa' dance for the BTS.'\n\nWant me to add this to the shoot brief?",
          },
        ],
      },
      {
        title: "Client email — Woolies pitch follow-up",
        preview: "Drafted a follow-up with the three deliverables and timeline...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Draft a follow-up email to the Woolies team. We need to confirm the pitch date and deliverables.",
          },
          {
            role: "assistant",
            content:
              "Drafted. Subject: 'Woolies Q3 — Ready to present'\n\n'Hi Sarah, Following our call, we're locked and loaded for the 14th. Three deliverables: (1) brand strategy, (2) creative platform, (3) production roadmap. Let me know if you need anything else before we lock the boardroom.'\n\nSend, or tone it softer?",
          },
        ],
      },
      {
        title: "Soweto fashion week logistics",
        preview: "Venue confirmed at Uncle Merv's. Need to lock the sound engineer...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Help me plan the Soweto Fashion Week after-party. 200 people, budget R50k, needs to feel premium but township.",
          },
          {
            role: "assistant",
            content:
              "**Venue:** Uncle Merv's in Vilakazi Street — confirmed, holds 220, has the rooftop.\n\n**Sound:** Still need to lock the engineer. I can reach out to Kwaito Sound Co.\n\n**Food:** Kota bar + craft gin station. On-brand, on-budget.\n\nWant me to draft the vendor outreach?",
          },
        ],
      },
    ],
    memories: [
      {
        content: "Allergic to shellfish — always check catering menus",
        category: "health",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      },
      {
        content: "Prefers morning briefs at 06:30 before school run",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
      {
        content: "Nando's account lead: Sarah Pillay, sarah@nandos.co.za",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
      {
        content: "Daughter Thandi's birthday is 14 March — wants a horse-riding party",
        category: "family",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      },
      {
        content: "Creative voice: punchy, South African, no corporate speak",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      },
      {
        content: "Favourite competitors to watch: Chicken Licken, KFC, Roman's Pizza",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      },
      {
        content: "Drives a VW Tiguan, parks at Rosebank Mall, gym at 17:00",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      },
      {
        content: "Woolies pitch team: Sizwe (strategy), Lerato (design), Jabu (production)",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ],
    skills: [
      {
        id: "meeting",
        name: "Meeting Capture",
        desc: "Auto-transcribe meetings & extract action items",
        status: "installed",
        color: "bg-emerald-500/20 text-emerald-400",
      },
      {
        id: "research",
        name: "Deep Research",
        desc: "Multi-source research with citations",
        status: "connected",
        color: "bg-primary/20 text-primary",
      },
      {
        id: "email",
        name: "Email Triage",
        desc: "Auto-classify, draft replies, schedule sends",
        status: "installed",
        color: "bg-rose-500/20 text-rose-400",
      },
      {
        id: "creative",
        name: "Creative Brief Builder",
        desc: "Turn voice notes into structured briefs",
        status: "installed",
        color: "bg-amber-500/20 text-amber-400",
      },
      {
        id: "privacy",
        name: "Privacy Audit",
        desc: "Scan & prune data access",
        status: "installed",
        color: "bg-cyan-500/20 text-cyan-400",
      },
      {
        id: "custom",
        name: "Custom Skill",
        desc: "Build your own with natural language",
        status: "available",
        color: "bg-muted text-muted-foreground",
      },
    ],
    agents: [
      {
        id: "1",
        name: "Competitor Watch",
        goal: "Daily summary of competitor creative campaigns",
        status: "running",
        model: "Perplexity Sonar",
        progress: 67,
        eta: "2m",
        lastOutput: "Chicken Licken dropped 'Soul Sister' — nostalgia play, strong engagement",
        privacy: "cloud-with-consent",
        subagents: [
          {
            name: "Scout A",
            model: "Perplexity Sonar",
            goal: "Monitor Chicken Licken social",
            status: "done",
            duration: "1.2s",
          },
          {
            name: "Scout B",
            model: "Perplexity Sonar",
            goal: "Monitor KFC social",
            status: "running",
          },
          {
            name: "Analyst",
            model: "Claude Sonnet 4",
            goal: "Synthesise creative insights",
            status: "running",
          },
        ],
      },
      {
        id: "2",
        name: "Creative Pipeline",
        goal: "Turn Friday voice notes into Monday briefs",
        status: "scheduled",
        model: "Gemini 2.5 Pro",
        progress: 0,
        eta: "Monday 08:00",
        lastOutput: "Scheduled — will process 4 voice notes from this week",
        privacy: "on-device",
        subagents: [
          {
            name: "Transcriber",
            model: "On-device",
            goal: "Transcribe voice notes",
            status: "done",
          },
          {
            name: "Structurer",
            model: "Gemini 2.5 Pro",
            goal: "Build brief template",
            status: "done",
          },
        ],
      },
      {
        id: "3",
        name: "Nando's Q3 Tracker",
        goal: "Track deliverables and client feedback",
        status: "running",
        model: "Claude Sonnet 4",
        progress: 34,
        eta: "5m",
        lastOutput: "Script draft 2 of 3 complete — awaiting feedback on Concept A",
        privacy: "cloud-with-consent",
        subagents: [
          {
            name: "Brief Keeper",
            model: "Claude Sonnet 4",
            goal: "Maintain brief version history",
            status: "done",
            duration: "2.1s",
          },
          {
            name: "Feedback Tracker",
            model: "Claude Sonnet 4",
            goal: "Log client feedback threads",
            status: "running",
          },
        ],
      },
    ],
  },

  // ─── 2. THABO NKOSI — Software Engineer ────────────────────────────
  {
    profile: {
      id: "thabo-nkosi",
      name: "Thabo Nkosi",
      role: "Senior Engineer, Yoco",
      location: "Cape Town",
      plan: "PRO",
      tagline: "Building the future of payments, one PR at a time",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    threads: [
      {
        title: "PR #2847 — payment retry logic",
        preview: "The exponential backoff looks solid. One concern on the timeout...",
        updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Review PR #2847 — payment retry logic. Focus on the exponential backoff and idempotency keys.",
          },
          {
            role: "assistant",
            content:
              "**Reviewed.** Backoff looks solid: 2s, 4s, 8s, 16s with jitter. One concern: the timeout on line 147 is 30s but the gateway SLA is 15s. Could stall retries.\n\nIdempotency keys are correctly hashed with `user_id + timestamp + request_id`. LGTM after the timeout fix.",
          },
        ],
      },
      {
        title: "Architecture doc — fraud detection",
        preview: "Drafted the ADR for the new rules engine. Need to decide on...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Draft an ADR for the new fraud detection rules engine. We need to decide between Drools and a custom DSL.",
          },
          {
            role: "assistant",
            content:
              "**ADR-042: Fraud Rules Engine**\n\n**Option A: Drools** — Mature, complex, heavy JVM dependency.\n**Option B: Custom DSL** — Lightweight, fits our Go stack, needs 2-3 weeks to build.\n\n**Recommendation:** Custom DSL. Our rules are simple (thresholds, velocity, geo), and Drools is overkill. I can draft the grammar.",
          },
        ],
      },
      {
        title: "Standup prep — async notes",
        preview: "Yesterday: merged webhook refactor. Today: review Thandi's auth PR...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Draft my standup notes. Yesterday I merged the webhook refactor and paired with Thandi on auth.",
          },
          {
            role: "assistant",
            content:
              "**Yesterday:** Merged webhook refactor (PR #2842). Paired with Thandi on auth middleware — blocked on OAuth scope issue.\n\n**Today:** Review Thandi's auth PR (#2851). Start on the fraud ADR.\n\n**Blockers:** OAuth scope — need Siya from platform to confirm.\n\nWant me to DM Siya?",
          },
        ],
      },
      {
        title: "Deploy notes — staging rollback",
        preview: "The rollback was clean. Root cause: missing env var for...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        messages: [
          {
            role: "user",
            content: "Document the staging rollback from yesterday. Root cause and follow-up.",
          },
          {
            role: "assistant",
            content:
              "**Incident:** Staging deploy failed at 14:32. Rollback completed at 14:45.\n\n**Root cause:** Missing `FRAUD_API_KEY` env var — the new config wasn't in the staging vault.\n\n**Follow-up:** Add the key to the vault, add a pre-deploy env check to CI. Ticket created: OPS-892.",
          },
        ],
      },
      {
        title: "Learn: Rust for systems programming",
        preview: "Chapter 3 — ownership. The borrowing rules are starting to click...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Explain Rust ownership like I'm learning C. I understand pointers but the borrow checker is confusing.",
          },
          {
            role: "assistant",
            content:
              "Think of ownership like a library book: only one person can have it at a time. If you lend it (borrow), the borrower can't keep it. When the owner is done, the book goes back to the library (drop).\n\nThe borrow checker is just the librarian saying 'no, you can't have two mutable loans at once.'",
          },
        ],
      },
    ],
    memories: [
      {
        content: "Uses dark mode for all IDEs, terminal is Alacritty + tmux",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      },
      {
        content: "Gym at 06:00, standup at 09:30, focus block 10:00-12:00",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
      {
        content: "Tech lead: Siya Mabena, reports every Tuesday",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      },
      {
        content: "Brother is studying at UCT — computer science, second year",
        category: "family",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      },
      {
        content: "Favourite podcast: Command Line Heroes, Darknet Diaries",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      },
      {
        content: "Stack: Go, PostgreSQL, Redis, Kafka, Kubernetes",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
      {
        content: "Load-shedding zone: Stage 3 today, UPS for router + monitor",
        category: "home",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        content: "Code review style: kind but direct, always suggest alternatives",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      },
    ],
    skills: [
      {
        id: "meeting",
        name: "Meeting Capture",
        desc: "Auto-transcribe meetings & extract action items",
        status: "installed",
        color: "bg-emerald-500/20 text-emerald-400",
      },
      {
        id: "research",
        name: "Deep Research",
        desc: "Multi-source research with citations",
        status: "installed",
        color: "bg-primary/20 text-primary",
      },
      {
        id: "agent",
        name: "Agent Orchestrator",
        desc: "Spawn & monitor background sub-agents",
        status: "installed",
        color: "bg-amber-500/20 text-amber-400",
      },
      {
        id: "code",
        name: "Code Review Bot",
        desc: "Review open PRs, flag regressions",
        status: "installed",
        color: "bg-cyan-500/20 text-cyan-400",
      },
      {
        id: "privacy",
        name: "Privacy Audit",
        desc: "Scan & prune data access",
        status: "installed",
        color: "bg-violet-500/20 text-violet-400",
      },
      {
        id: "custom",
        name: "Custom Skill",
        desc: "Build your own with natural language",
        status: "available",
        color: "bg-muted text-muted-foreground",
      },
    ],
    agents: [
      {
        id: "1",
        name: "Code Review Bot",
        goal: "Review all open PRs, flag regressions",
        status: "running",
        model: "Gemini 2.5 Pro",
        progress: 45,
        eta: "3m",
        lastOutput: "7 PRs reviewed · 2 regressions found in auth middleware",
        privacy: "on-device",
        subagents: [
          {
            name: "PR Reader",
            model: "Gemini 2.5 Pro",
            goal: "Read PR diffs",
            status: "done",
            duration: "5.7s",
          },
          {
            name: "Reviewer",
            model: "Gemini 2.5 Pro",
            goal: "Flag issues & suggest",
            status: "running",
          },
        ],
      },
      {
        id: "2",
        name: "Standup Prep",
        goal: "Draft daily standup notes from commits and calendar",
        status: "scheduled",
        model: "o3-mini",
        progress: 0,
        eta: "tomorrow 09:00",
        lastOutput: "Scheduled — will compile notes at 08:45",
        privacy: "on-device",
        subagents: [
          {
            name: "Commit Reader",
            model: "On-device",
            goal: "Summarise yesterday's commits",
            status: "done",
          },
          {
            name: "Calendar Scout",
            model: "On-device",
            goal: "List today's meetings",
            status: "done",
          },
        ],
      },
      {
        id: "3",
        name: "Fraud ADR Tracker",
        goal: "Track ADR-042 decision and stakeholder feedback",
        status: "paused",
        model: "Claude Sonnet 4",
        progress: 30,
        eta: "paused",
        lastOutput: "Paused — waiting for Siya's review on the custom DSL proposal",
        privacy: "cloud-with-consent",
        subagents: [
          {
            name: "Stakeholder Ping",
            model: "Claude Sonnet 4",
            goal: "Remind Siya to review",
            status: "running",
          },
        ],
      },
    ],
  },

  // ─── 3. DR. PRIYA NAIDOO — General Practitioner ────────────────────
  {
    profile: {
      id: "priya-naidoo",
      name: "Dr. Priya Naidoo",
      role: "GP, Life Vincent Pallotti Hospital",
      location: "Durban",
      plan: "Plus",
      tagline: "Caring for the 4000, one patient at a time",
      avatar:
        "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    threads: [
      {
        title: "Patient prep — Mrs. Patel, hypertension",
        preview: "BP log for 3 months, medication adherence at 85%, consider...",
        updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        messages: [
          {
            role: "user",
            content: "Prep me for Mrs. Patel's follow-up. Hypertension, last visit 3 months ago.",
          },
          {
            role: "assistant",
            content:
              "**Mrs. Patel, 68** — Hypertension, Type 2 DM\n\n**BP log:** Last 3 readings: 142/88, 138/84, 145/90 (home monitor).\n\n**Meds:** Amlodipine 5mg, adherence 85% (pharmacy record).\n\n**Consider:** Add HCTZ? Check renal function. Ask about dizziness.\n\n**Questions to ask:** Sleep quality, salt intake, exercise.",
          },
        ],
      },
      {
        title: "CPD research — diabetes management guidelines",
        preview: "Latest ADA guidelines recommend SGLT2 inhibitors for...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Summarise the latest ADA guidelines on SGLT2 inhibitors for heart failure in non-diabetic patients.",
          },
          {
            role: "assistant",
            content:
              "**ADA 2024 Update:** SGLT2 inhibitors now recommended for HFrEF regardless of diabetes status.\n\n**Key trials:** DAPA-HF, EMPEROR-Reduced.\n\n**SA context:** Jardiance on NDoH formulary for HFrEF. Dapagliflozin is private only.\n\n**Action:** Update patient education handout.",
          },
        ],
      },
      {
        title: "Sister's wedding — speech draft",
        preview: "Started with a story about the time we got lost at the...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Help me draft my sister's wedding speech. Keep it warm, funny, under 5 minutes.",
          },
          {
            role: "assistant",
            content:
              "**Opening:** 'When Priya was 8, she decided she was going to be a doctor. When I was 8, I decided I was going to marry a Backstreet Boy.'\n\n**Middle:** The time we got lost at the Durban beachfront — she used a stethoscope as a compass.\n\n**Close:** 'To love, to laughter, and to never getting lost again.'\n\n3 minutes. Want it shorter or more emotional?",
          },
        ],
      },
      {
        title: "Clinic schedule — next week",
        preview: "42 appointments, 4 home visits, 2 CPD sessions. Need to block...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Review next week's schedule. I need to make sure I have buffer time for urgent walk-ins.",
          },
          {
            role: "assistant",
            content:
              "**Next week:** 42 appointments, 4 home visits, 2 CPD sessions.\n\n**Concern:** Tuesday is fully booked 08:00-17:00 with no gaps. Urgent walk-ins will delay everyone.\n\n**Suggest:** Block 10:00-10:30 and 14:00-14:30 as 'urgent slots'. Move two routine follow-ups to Wednesday.\n\nShall I draft the reschedule messages?",
          },
        ],
      },
      {
        title: "Meds inventory check",
        preview: "Amoxicillin low (12 bottles), flu vaccines arriving Thursday...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        messages: [
          { role: "user", content: "Check my clinic inventory. What's running low?" },
          {
            role: "assistant",
            content:
              "**Running low:**\n• Amoxicillin — 12 bottles (reorder at 20)\n• Flu vaccines — 4 doses (new shipment Thursday)\n• BP cuffs — 2 (one is faulty)\n\n**Stocked:** Amlodipine, Metformin, ARVs.\n\n**Action:** Order BP cuffs urgently. Confirm flu shipment.",
          },
        ],
      },
    ],
    memories: [
      {
        content: "Clinic opens 08:00, closes 17:00, lunch 13:00-14:00",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      },
      {
        content: "Sister's wedding: 15 August at The Oyster Box, Umhlanga",
        category: "family",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      },
      {
        content: "Medical rep: Jaco from PharmaCo, visits every second Tuesday",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      },
      {
        content: "Prefers evidence-based guidelines, cautious about new drugs",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
      {
        content: "Drives a Honda Jazz, parks at Life Vincent Pallotti, walk to beach after work",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      },
      {
        content: "CPD deadline: 30 hours by November, currently at 18",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
      {
        content: "Niece's birthday: 3 June, wants a unicorn cake",
        category: "family",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      },
      {
        content: "Load-shedding backup: generator for vaccine fridge, UPS for computers",
        category: "home",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ],
    skills: [
      {
        id: "meeting",
        name: "Meeting Capture",
        desc: "Auto-transcribe meetings & extract action items",
        status: "installed",
        color: "bg-emerald-500/20 text-emerald-400",
      },
      {
        id: "research",
        name: "Deep Research",
        desc: "Medical research with citations",
        status: "connected",
        color: "bg-primary/20 text-primary",
      },
      {
        id: "email",
        name: "Email Triage",
        desc: "Patient comms and referral letters",
        status: "installed",
        color: "bg-rose-500/20 text-rose-400",
      },
      {
        id: "schedule",
        name: "Schedule Optimiser",
        desc: "Balance clinic load and home visits",
        status: "installed",
        color: "bg-amber-500/20 text-amber-400",
      },
      {
        id: "privacy",
        name: "Privacy Audit",
        desc: "POPIA compliance for patient data",
        status: "installed",
        color: "bg-cyan-500/20 text-cyan-400",
      },
      {
        id: "custom",
        name: "Custom Skill",
        desc: "Build your own with natural language",
        status: "available",
        color: "bg-muted text-muted-foreground",
      },
    ],
    agents: [
      {
        id: "1",
        name: "Patient Prep",
        goal: "Summarise patient history before each appointment",
        status: "running",
        model: "Claude Sonnet 4",
        progress: 72,
        eta: "1m",
        lastOutput: "Mrs. Patel prepped — BP trend, med adherence, questions ready",
        privacy: "on-device",
        subagents: [
          {
            name: "Chart Reader",
            model: "On-device",
            goal: "Read patient history",
            status: "done",
            duration: "0.8s",
          },
          {
            name: "Summariser",
            model: "Claude Sonnet 4",
            goal: "Draft prep notes",
            status: "running",
          },
        ],
      },
      {
        id: "2",
        name: "CPD Tracker",
        goal: "Track CPD hours and suggest upcoming courses",
        status: "scheduled",
        model: "Perplexity Sonar",
        progress: 0,
        eta: "Friday 17:00",
        lastOutput: "18 of 30 hours complete — 3 courses recommended for next month",
        privacy: "cloud-with-consent",
        subagents: [
          { name: "Hour Counter", model: "On-device", goal: "Calculate CPD hours", status: "done" },
          {
            name: "Course Finder",
            model: "Perplexity Sonar",
            goal: "Find relevant CPD courses",
            status: "done",
          },
        ],
      },
      {
        id: "3",
        name: "Inventory Monitor",
        goal: "Track clinic stock and flag low supplies",
        status: "running",
        model: "o3-mini",
        progress: 45,
        eta: "4m",
        lastOutput: "Amoxicillin low, BP cuffs critical, flu vaccines incoming",
        privacy: "on-device",
        subagents: [
          {
            name: "Stock Checker",
            model: "On-device",
            goal: "Check inventory levels",
            status: "done",
            duration: "1.2s",
          },
          {
            name: "Order Drafter",
            model: "o3-mini",
            goal: "Draft reorder requests",
            status: "running",
          },
        ],
      },
    ],
  },

  // ─── 4. NALEDI KGOSI — Entrepreneur ─────────────────────────────────
  {
    profile: {
      id: "naledi-kgosi",
      name: "Naledi Kgosi",
      role: "Founder, Kgosi Ventures",
      location: "Pretoria",
      plan: "PRO",
      tagline: "From township to term sheet",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    threads: [
      {
        title: "Investor pitch deck — Kgosi Ventures",
        preview: "Slide 7: TAM is R2.3B across township logistics. Need to...",
        updated_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        messages: [
          { role: "user", content: "Review slide 7 of my pitch deck. The TAM feels inflated." },
          {
            role: "assistant",
            content:
              "**TAM Analysis:** R2.3B is the total informal logistics market in Gauteng townships. Your SAM (serviceable) is R340M — that's the last-mile delivery slice.\n\n**SOM:** R12M in Year 1, based on 3 township hubs. That's 3.5% of SAM, which is aggressive but credible if you lock the Shoprite contract.\n\n**Suggest:** Split the slide — TAM/SAM on one, SOM + traction on another. Investors want to see the path, not just the number.",
          },
        ],
      },
      {
        title: "Travel — Nairobi investor roadshow",
        preview: "Flights: JNB-NBO on SAA, 3 meetings scheduled, hotel at...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        messages: [
          {
            role: "user",
            content: "Plan my Nairobi roadshow. 3 investor meetings, need to see the city too.",
          },
          {
            role: "assistant",
            content:
              "**Day 1:** Arrive NBO 14:00. Check in at Villa Rosa Kempinski. Rest, prep.\n\n**Day 2:** 09:00 — Savanna Fund (Westlands). 14:00 — TLcom (Karuna Road). Evening: dinner at Carnivore.\n\n**Day 3:** 10:00 — Chandaria Capital (Industrial Area). Afternoon: Karura Forest walk + craft market.\n\n**Day 4:** 09:00 — Departure.\n\nFlights: SAA JNB-NBO, R8,400 return. Hotel: R3,200/night. Total: ~R18,000.\n\nShall I book the flights?",
          },
        ],
      },
      {
        title: "Team standup — weekly summary",
        preview: "Sipho shipped the driver app. Thandi is blocked on the...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Draft my team standup summary. Sipho shipped the driver app, Thandi is blocked on payments, I need to hire a ops lead.",
          },
          {
            role: "assistant",
            content:
              "**This week:**\n• Sipho — Driver app v1.0 shipped, 12 drivers onboarded.\n• Thandi — Payment integration blocked (PayFast API issue). Needs vendor call.\n• Naledi — 2 investor meetings, 1 term sheet in progress.\n\n**Next week:**\n• Hire ops lead — 3 candidates interviewed, 1 strong.\n• Resolve PayFast block.\n• Pilot launch in Mamelodi.\n\nWant me to schedule the PayFast call?",
          },
        ],
      },
      {
        title: "Expense reconciliation — April",
        preview: "R47,200 total. Biggest items: flights (R18k), venue rental...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        messages: [
          { role: "user", content: "Reconcile my April expenses. I have 12 receipts." },
          {
            role: "assistant",
            content:
              "**April Expenses: R47,200**\n\n**Travel:** R18,000 (Nairobi roadshow)\n**Venue:** R12,000 (Mamelodi pilot hub, 3 months)\n**Tech:** R8,200 (AWS + Twilio)\n**Food/Entertainment:** R4,800 (investor dinners)\n**Transport:** R3,200 (Uber + fuel)\n**Misc:** R1,000 (stationery, prints)\n\n**Missing:** R6,800 gap between receipts and bank. Check the 23 April withdrawal.",
          },
        ],
      },
      {
        title: "Gogo's birthday logistics",
        preview: "Family WhatsApp group, 23 confirmed, catering from...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        messages: [
          {
            role: "user",
            content: "Organise Gogo's 80th birthday. 30 people, catering, venue in Mamelodi.",
          },
          {
            role: "assistant",
            content:
              "**Venue:** Mamelodi Community Hall — booked, R1,500 ( refundable).\n\n**Catering:** Mama's Kitchen — R120/head, 30 people = R3,600. Menu: pap, chakalaka, braai meat, samp.\n\n**Invites:** 23 confirmed via WhatsApp group. 7 maybes.\n\n**Cake:** 3-tier from Sweet Moments, R800.\n\n**Decor:** Balloons + tablecloths, R400.\n\n**Total:** R6,300. Want me to send reminder messages to the 7 maybes?",
          },
        ],
      },
    ],
    memories: [
      {
        content: "Started Kgosi Ventures in 2022, first office in Mamelodi",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      },
      {
        content: "Morning routine: 05:00 run, 06:30 brief, 07:30 school drop",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
      {
        content: "Mentor: Dr. Precious Moloi-Motsepe, meet quarterly",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      },
      {
        content: "Son is in Grade 3, loves soccer, coach is Coach Sbu",
        category: "family",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      },
      {
        content: "Investor target: R5M seed round, close by September",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
      {
        content: "Favourite podcast: How I Built This, My First Million",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      },
      {
        content: "Gogo's birthday: 15 June, turning 80, planning big celebration",
        category: "family",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      },
      {
        content: "Team: Sipho (tech), Thandi (ops), herself (founder/CEO)",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ],
    skills: [
      {
        id: "meeting",
        name: "Meeting Capture",
        desc: "Auto-transcribe meetings & extract action items",
        status: "installed",
        color: "bg-emerald-500/20 text-emerald-400",
      },
      {
        id: "research",
        name: "Deep Research",
        desc: "Investor and market research",
        status: "connected",
        color: "bg-primary/20 text-primary",
      },
      {
        id: "email",
        name: "Email Triage",
        desc: "Investor outreach and team comms",
        status: "installed",
        color: "bg-rose-500/20 text-rose-400",
      },
      {
        id: "travel",
        name: "Travel Planner",
        desc: "Itinerary, flights, logistics",
        status: "installed",
        color: "bg-amber-500/20 text-amber-400",
      },
      {
        id: "expense",
        name: "Expense Reconciliation",
        desc: "Monthly receipt and spend tracking",
        status: "installed",
        color: "bg-cyan-500/20 text-cyan-400",
      },
      {
        id: "custom",
        name: "Custom Skill",
        desc: "Build your own with natural language",
        status: "available",
        color: "bg-muted text-muted-foreground",
      },
    ],
    agents: [
      {
        id: "1",
        name: "Investor Pipeline",
        goal: "Track investor conversations and follow-ups",
        status: "running",
        model: "Claude Sonnet 4",
        progress: 56,
        eta: "3m",
        lastOutput: "3 new introductions this week · 1 term sheet in review",
        privacy: "cloud-with-consent",
        subagents: [
          {
            name: "CRM Scout",
            model: "Claude Sonnet 4",
            goal: "Log investor interactions",
            status: "done",
            duration: "1.5s",
          },
          {
            name: "Follow-up Drafter",
            model: "Claude Sonnet 4",
            goal: "Draft follow-up emails",
            status: "running",
          },
        ],
      },
      {
        id: "2",
        name: "Expense Reconciliation",
        goal: "Monthly receipt categorisation and report",
        status: "scheduled",
        model: "Gemini 2.5 Flash",
        progress: 0,
        eta: "1 May 08:00",
        lastOutput: "April expenses: R47,200 · 12 receipts filed · 1 gap flagged",
        privacy: "on-device",
        subagents: [
          {
            name: "Receipt Reader",
            model: "On-device",
            goal: "OCR and categorise receipts",
            status: "done",
          },
          {
            name: "Report Builder",
            model: "Gemini 2.5 Flash",
            goal: "Build expense report",
            status: "done",
          },
        ],
      },
      {
        id: "3",
        name: "Travel Orchestrator",
        goal: "Track Nairobi trip and reschedule if needed",
        status: "running",
        model: "o3-mini",
        progress: 78,
        eta: "1m",
        lastOutput: "Nairobi trip confirmed · 3 meetings locked · flight reminder set",
        privacy: "cloud-with-consent",
        subagents: [
          {
            name: "Flight Monitor",
            model: "o3-mini",
            goal: "Watch for delays or changes",
            status: "running",
          },
          {
            name: "Itinerary Keeper",
            model: "o3-mini",
            goal: "Track meeting confirmations",
            status: "done",
            duration: "2.3s",
          },
        ],
      },
    ],
  },

  // ─── 5. SIMON VAN DER BERG — Lecturer ──────────────────────────────
  {
    profile: {
      id: "simon-vanderberg",
      name: "Simon van der Berg",
      role: "Senior Lecturer, Stellenbosch University",
      location: "Stellenbosch",
      plan: "Plus",
      tagline: "Teaching theology, building community",
      avatar:
        "https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    },
    threads: [
      {
        title: "Sermon prep — John 15:1-8",
        preview: "The vine and branches. Three points: abiding, pruning, fruit...",
        updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Prep my sermon on John 15:1-8. 25 minutes, congregation is mixed age, some Afrikaans.",
          },
          {
            role: "assistant",
            content:
              "**'The Vine and the Branches'** — John 15:1-8\n\n**Point 1: Abiding** (v. 4-5) — 'Bly in My' — the Greek *meno* means 'to stay, to remain, to make your home.' Not a visit, a dwelling.\n\n**Point 2: Pruning** (v. 2) — *kathairei* — God cleans the vine for more fruit. The cut is never random.\n\n**Point 3: Fruit** (v. 5, 8) — *karpos* — the evidence of abiding. Not effort, but overflow.\n\n**Close:** 'The branch does not bear fruit by trying. It bears fruit by staying.'\n\nWant it in Afrikaans too?",
          },
        ],
      },
      {
        title: "Lecture notes — Reformation history",
        preview: "Luther's 95 theses: context, impact, and modern relevance...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Draft lecture notes for 'Reformation History' — 3rd year. Focus on Luther's 95 theses.",
          },
          {
            role: "assistant",
            content:
              "**Lecture 7: The 95 Theses (31 Oct 1517)**\n\n**Context:** Indulgences, St Peter's Basilica fund, Tetzel's jingle.\n\n**Theses 1-5:** Only God can forgive sins. The pope's power is declaration, not creation.\n\n**Theses 27-29:** Buying indulgences for the dead is uncertain — why not give to the poor instead?\n\n**Theses 62:** The true treasure of the church is the gospel.\n\n**Modern relevance:** Consumerism as indulgence. 'Buy this, feel better.' Luther's critique is still sharp.\n\nDiscussion question: What are our modern indulgences?",
          },
        ],
      },
      {
        title: "Student outreach — WhatsApp blast",
        preview: "Drafted: 'Hi everyone, reminder about the theology society...'",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Draft a WhatsApp message for the theology society. Reminder about the braai on Friday.",
          },
          {
            role: "assistant",
            content:
              "'Hi everyone! Reminder: Theology Society braai this Friday at 18:00, Eikestad Park. Bring your own meat + drink. We'll supply the fire and the theology (and maybe some guitar). See you there! — Simon'\n\nShort, warm, clear. Send?",
          },
        ],
      },
      {
        title: "Research — African contextual theology",
        preview: "Key thinkers: Bujo, Tutu, Kretzschmar. Need to structure the...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Help me structure my research paper on African contextual theology. Key thinkers: Bujo, Tutu, Kretzschmar.",
          },
          {
            role: "assistant",
            content:
              "**Structure:**\n\n**1. Introduction:** Why context matters — the gospel is always received, not just transmitted.\n\n**2. Bujo (Ubuntu theology):** The communal self — 'I am because we are.' Critique of Western individualism.\n\n**3. Tutu (Reconciliation theology):** Theology as practice — forgiveness is not optional.\n\n**4. Kretzschmar (Christian ethics):** The role of the community in moral formation.\n\n**5. Conclusion:** African theology is not a 'contextual' add-on — it is theology proper.\n\nWord count: 8,000. Want me to draft the Bujo section?",
          },
        ],
      },
      {
        title: "Choir rehearsal schedule",
        preview: "Wednesday 19:00, new songs: 'Great is Thy Faithfulness' and...",
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        messages: [
          {
            role: "user",
            content:
              "Plan the choir rehearsal schedule for next month. We have 4 new songs and a performance on 28 June.",
          },
          {
            role: "assistant",
            content:
              "**June Rehearsals:**\n\n**Week 1:** 'Great is Thy Faithfulness' — learn melody, harmony parts.\n**Week 2:** 'Indodana' (isiXhosa) — pronunciation coaching, rhythm.\n**Week 3:** 'How Great Thou Art' (Afrikaans) + 'Shout to the Lord' — polish, dynamics.\n**Week 4:** Run-through, dress rehearsal 26 June.\n\n**Performance:** 28 June, DRC Stellenbosch, 10:00.\n\nNeed me to send the schedule to the group?",
          },
        ],
      },
    ],
    memories: [
      {
        content: "Teaches 3rd and 4th year theology, 2 courses per semester",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      },
      {
        content: "Wednesday: choir rehearsal 19:00, Saturday: sermon prep morning",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
      {
        content: "Wife: Anna, kids: Johan (12), Marie (9), dog: Bessie",
        category: "family",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      },
      {
        content: "Prefers Afrikaans and English equally, often mixes in sermons",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      },
      {
        content: "Church: DRC Stellenbosch, preaches twice monthly",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      },
      {
        content: "Research focus: African theology, Reformation history, public theology",
        category: "work",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
      {
        content: "Favourite authors: Bujo, Brueggemann, Tutu, Kretzschmar",
        category: "preferences",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      },
      {
        content: "Commutes by bicycle, 15 minutes from Cloetesville",
        category: "routine",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ],
    skills: [
      {
        id: "meeting",
        name: "Meeting Capture",
        desc: "Auto-transcribe meetings & extract action items",
        status: "installed",
        color: "bg-emerald-500/20 text-emerald-400",
      },
      {
        id: "research",
        name: "Deep Research",
        desc: "Academic research with citations",
        status: "connected",
        color: "bg-primary/20 text-primary",
      },
      {
        id: "email",
        name: "Email Triage",
        desc: "Student comms and admin",
        status: "installed",
        color: "bg-rose-500/20 text-rose-400",
      },
      {
        id: "sermon",
        name: "Sermon Prep",
        desc: "Expository outlines and speaker notes",
        status: "installed",
        color: "bg-amber-500/20 text-amber-400",
      },
      {
        id: "schedule",
        name: "Schedule Optimiser",
        desc: "Balance teaching, research, and church",
        status: "installed",
        color: "bg-cyan-500/20 text-cyan-400",
      },
      {
        id: "custom",
        name: "Custom Skill",
        desc: "Build your own with natural language",
        status: "available",
        color: "bg-muted text-muted-foreground",
      },
    ],
    agents: [
      {
        id: "1",
        name: "Sermon Prep",
        goal: "Draft weekly sermon outlines and speaker notes",
        status: "running",
        model: "Claude Sonnet 4",
        progress: 62,
        eta: "2m",
        lastOutput: "John 15 sermon drafted — 3 points, Afrikaans key phrases, 22 minutes",
        privacy: "on-device",
        subagents: [
          {
            name: "Passage Reader",
            model: "On-device",
            goal: "Analyse Greek text and structure",
            status: "done",
            duration: "1.8s",
          },
          {
            name: "Outline Builder",
            model: "Claude Sonnet 4",
            goal: "Draft 3-point outline",
            status: "running",
          },
        ],
      },
      {
        id: "2",
        name: "Research Tracker",
        goal: "Track paper progress and suggest sources",
        status: "scheduled",
        model: "Perplexity Sonar",
        progress: 0,
        eta: "Friday 16:00",
        lastOutput: "African theology paper: 3 of 5 sections drafted, Bujo section complete",
        privacy: "cloud-with-consent",
        subagents: [
          {
            name: "Source Finder",
            model: "Perplexity Sonar",
            goal: "Find recent sources on African theology",
            status: "done",
          },
          {
            name: "Citation Manager",
            model: "On-device",
            goal: "Format references in Chicago style",
            status: "done",
          },
        ],
      },
      {
        id: "3",
        name: "Choir Coordinator",
        goal: "Track rehearsal attendance and song progress",
        status: "running",
        model: "o3-mini",
        progress: 34,
        eta: "5m",
        lastOutput: "4 new songs on schedule · 2 need extra rehearsal · performance 28 June",
        privacy: "on-device",
        subagents: [
          {
            name: "Attendance Tracker",
            model: "On-device",
            goal: "Log who attended rehearsal",
            status: "done",
            duration: "0.5s",
          },
          {
            name: "Song Progress",
            model: "o3-mini",
            goal: "Track which songs are ready",
            status: "running",
          },
        ],
      },
    ],
  },
];

export const getPersonaById = (id: string) => PERSONAS.find((p) => p.profile.id === id);
export const getPersonaNames = () =>
  PERSONAS.map((p) => ({
    id: p.profile.id,
    name: p.profile.name,
    role: p.profile.role,
    avatar: p.profile.avatar,
  }));
