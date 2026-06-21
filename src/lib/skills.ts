import type { LucideIcon } from "lucide-react";
import { Mail, Calendar, FileText, Globe, Image, MessageSquare, Database, Briefcase, Github, Slack, Code, ShoppingBag, Phone, Send, Wifi, Layers, Palette, Zap, ChartBar as BarChart3, Figma, Video, Bell } from "lucide-react";

export type Skill = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: "Communication" | "Productivity" | "Research" | "Creative" | "Developer" | "Data";
  installed: boolean;
  connected: boolean;
  model?: string;
  color: string;
};

export const SKILLS: Skill[] = [
  { id: "gmail", name: "Gmail", description: "Read, draft, triage, and send email", icon: Mail, category: "Communication", installed: true, connected: true, model: "Claude 3.5 Sonnet", color: "from-red-500/30 to-orange-500/20" },
  { id: "calendar", name: "Calendar", description: "Schedule, reschedule, and find focus blocks", icon: Calendar, category: "Productivity", installed: true, connected: true, model: "o3-mini", color: "from-blue-500/30 to-cyan-500/20" },
  { id: "notion", name: "Notion", description: "Create pages, read docs, update databases", icon: FileText, category: "Productivity", installed: true, connected: true, model: "Gemini 2.5 Pro", color: "from-zinc-500/30 to-zinc-700/20" },
  { id: "web", name: "Deep Research", description: "Multi-step web research, synthesis, citations", icon: Globe, category: "Research", installed: true, connected: true, model: "Perplexity Sonar", color: "from-emerald-500/30 to-teal-500/20" },
  { id: "image", name: "Image Studio", description: "Generate, edit, upscale images in chat", icon: Image, category: "Creative", installed: true, connected: true, model: "Gemini 2.0 Flash", color: "from-fuchsia-500/30 to-pink-500/20" },
  { id: "imessage", name: "iMessage Bridge", description: "Send via Raft agent network — no Mac relay", icon: MessageSquare, category: "Communication", installed: true, connected: false, model: "Raft Network", color: "from-green-500/30 to-emerald-500/20" },
  { id: "whatsapp", name: "WhatsApp", description: "Cloud API + Baileys bridging for messages", icon: Phone, category: "Communication", installed: false, connected: false, model: "Meta Cloud API", color: "from-green-600/30 to-emerald-600/20" },
  { id: "telegram", name: "Telegram", description: "Bot API 10.1 with rich markup and threads", icon: Send, category: "Communication", installed: false, connected: false, model: "Bot API 10.1", color: "from-sky-500/30 to-blue-500/20" },
  { id: "slack", name: "Slack", description: "Post, summarize, react, and thread", icon: Slack, category: "Communication", installed: false, connected: false, model: "Block Kit", color: "from-purple-500/30 to-violet-500/20" },
  { id: "github", name: "GitHub", description: "Triage issues, review PRs, draft releases", icon: Github, category: "Developer", installed: false, connected: false, model: "Code Composer", color: "from-zinc-400/30 to-zinc-600/20" },
  { id: "crm", name: "Salesforce", description: "Update leads, pipeline, and forecasts", icon: Briefcase, category: "Productivity", installed: false, connected: false, model: "o3-mini", color: "from-sky-500/30 to-blue-500/20" },
  { id: "code", name: "Code Composer", description: "Write, debug, and refactor with 200k context", icon: Code, category: "Developer", installed: false, connected: false, model: "Gemini 2.5 Pro", color: "from-amber-500/30 to-orange-500/20" },
  { id: "db", name: "Data Analyst", description: "Query, chart, and explain any dataset", icon: Database, category: "Data", installed: false, connected: false, model: "o3-mini", color: "from-indigo-500/30 to-blue-500/20" },
  { id: "shop", name: "Shop Concierge", description: "Compare products, track prices, check out", icon: ShoppingBag, category: "Productivity", installed: false, connected: false, model: "Gemini 3 Flash", color: "from-rose-500/30 to-pink-500/20" },
  { id: "zoom", name: "Zoom", description: "Schedule, record, and transcribe meetings", icon: Video, category: "Productivity", installed: false, connected: false, model: "Zoom API", color: "from-blue-600/30 to-indigo-600/20" },
  { id: "figma", name: "Figma", description: "Read designs, export assets, comment", icon: Palette, category: "Creative", installed: false, connected: false, model: "Figma REST API", color: "from-fuchsia-600/30 to-purple-600/20" },
  { id: "linear", name: "Linear", description: "Create issues, track cycles, update status", icon: Layers, category: "Developer", installed: false, connected: false, model: "Linear API", color: "from-violet-500/30 to-purple-500/20" },
  { id: "stripe", name: "Stripe", description: "Check revenue, refunds, and invoices", icon: BarChart3, category: "Data", installed: false, connected: false, model: "Stripe API", color: "from-violet-600/30 to-fuchsia-600/20" },
  { id: "raft", name: "Raft Network", description: "Agent mesh for distributed task execution", icon: Wifi, category: "Communication", installed: false, connected: false, model: "Raft Protocol", color: "from-cyan-500/30 to-teal-500/20" },
];
