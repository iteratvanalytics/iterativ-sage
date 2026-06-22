import { Terminal } from "lucide-react";
import type React from "react";

/** Render a small, safe subset of markdown to React nodes. */
export function renderMd(text: string): React.ReactNode {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let codeLines: string[] = [];
  let inCode = false;
  let codeLang = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        result.push(
          <div key={i} className="rounded-xl overflow-hidden border border-white/10 my-2">
            <div className="px-3 py-1.5 bg-white/5 border-b border-white/10 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-sky-400" />
              <span className="text-[10px] font-mono text-muted-foreground">{codeLang || "code"}</span>
            </div>
            <pre className="p-3 text-[12px] font-mono text-emerald-300/90 leading-relaxed overflow-x-auto whitespace-pre">{codeLines.join("\n")}</pre>
          </div>
        );
        inCode = false;
        codeLines = [];
      }
      continue;
    }

    if (inCode) { codeLines.push(line); continue; }

    if (!line.trim()) { result.push(<div key={i} className="h-2" />); continue; }
    if (line.startsWith("### ")) { result.push(<h3 key={i} className="text-[15px] font-bold mt-3 mb-1">{line.slice(4)}</h3>); continue; }
    if (line.startsWith("## "))  { result.push(<h2 key={i} className="text-base font-bold mt-3 mb-1">{line.slice(3)}</h2>); continue; }
    if (line.startsWith("# "))   { result.push(<h1 key={i} className="text-lg font-bold mt-3 mb-1">{line.slice(2)}</h1>); continue; }
    if (line.startsWith("> "))   { result.push(<blockquote key={i} className="border-l-2 border-primary/50 pl-3 my-1 text-foreground/80 italic text-[14px]">{renderInlineMd(line.slice(2))}</blockquote>); continue; }
    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      result.push(<div key={i} className="flex gap-2 text-[14px] leading-relaxed"><span className="text-primary/60 mt-0.5 shrink-0">•</span><span>{renderInlineMd(line.slice(2))}</span></div>);
      continue;
    }
    const numberedMatch = line.match(/^(\d+)\. (.+)/);
    if (numberedMatch) {
      result.push(<div key={i} className="flex gap-2 text-[14px] leading-relaxed"><span className="text-primary/60 w-4 shrink-0 text-right">{numberedMatch[1]}.</span><span>{renderInlineMd(numberedMatch[2])}</span></div>);
      continue;
    }
    if (line.startsWith("---")) { result.push(<div key={i} className="border-t border-white/10 my-3" />); continue; }

    result.push(<div key={i} className="text-[15px] leading-relaxed">{renderInlineMd(line)}</div>);
  }
  return <div className="space-y-0.5">{result}</div>;
}

/** Render inline markdown: bold, inline code, links. */
export function renderInlineMd(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))   return <code key={i} className="font-mono text-[13px] bg-white/10 px-1 rounded text-emerald-300/90">{p.slice(1, -1)}</code>;
    const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) return <span key={i} className="text-primary underline">{linkMatch[1]}</span>;
    return <span key={i}>{p}</span>;
  });
}
