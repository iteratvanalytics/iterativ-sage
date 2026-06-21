import type { LucideIcon } from "lucide-react";
import { Mail, Calendar, FileText, Globe, Image, MessageSquare, Database, Briefcase, Github, Slack, Code, ShoppingBag } from "lucide-react";

export type Skill = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: "Communication" | "Productivity" | "Research" | "Creative" | "Developer";
  installed: boolean;
  color: string;
};

export const SKILLS: Skill[] = [
  { id: "gmail", name: "Gmail", description: "Read, draft, and triage email", icon: Mail, category: "Communication", installed: true, color: "from-red-500/30 to-orange-500/20" },
  { id: "calendar", name: "Calendar", description: "Schedule and reschedule events", icon: Calendar, category: "Productivity", installed: true, color: "from-blue-500/30 to-cyan-500/20" },
  { id: "notion", name: "Notion", description: "Create pages and read docs", icon: FileText, category: "Productivity", installed: true, color: "from-zinc-500/30 to-zinc-700/20" },
  { id: "web", name: "Deep Research", description: "Multi-step web research and synthesis", icon: Globe, category: "Research", installed: true, color: "from-emerald-500/30 to-teal-500/20" },
  { id: "image", name: "Image Studio", description: "Generate and edit images in chat", icon: Image, category: "Creative", installed: true, color: "from-fuchsia-500/30 to-pink-500/20" },
  { id: "imessage", name: "iMessage Bridge", description: "Send messages without a Mac relay", icon: MessageSquare, category: "Communication", installed: false, color: "from-green-500/30 to-emerald-500/20" },
  { id: "slack", name: "Slack", description: "Post, summarize, and react", icon: Slack, category: "Communication", installed: false, color: "from-purple-500/30 to-violet-500/20" },
  { id: "github", name: "GitHub", description: "Triage issues, review PRs", icon: Github, category: "Developer", installed: false, color: "from-zinc-400/30 to-zinc-600/20" },
  { id: "crm", name: "Salesforce", description: "Update leads and pipeline", icon: Briefcase, category: "Productivity", installed: false, color: "from-sky-500/30 to-blue-500/20" },
  { id: "code", name: "Code Composer", description: "Write code with 200k context", icon: Code, category: "Developer", installed: false, color: "from-amber-500/30 to-orange-500/20" },
  { id: "db", name: "Data Analyst", description: "Query, chart, and explain data", icon: Database, category: "Research", installed: false, color: "from-indigo-500/30 to-blue-500/20" },
  { id: "shop", name: "Shop Concierge", description: "Compare products and check out", icon: ShoppingBag, category: "Productivity", installed: false, color: "from-rose-500/30 to-pink-500/20" },
];