---
name: Chat MessagePart types
description: All MessagePart union types used in mockAgent.ts and rendered in chat.$threadId.tsx
---

9 part types defined in `src/lib/mockAgent.ts` and rendered by `PartView` in `src/routes/_authenticated/chat.$threadId.tsx`:

1. text — rendered markdown (headers, bullets, code blocks, blockquotes, bold, inline code)
2. tool — tool call card with icon, label, status badge, result, duration
3. subagent — sub-agent card with name, model, goal, status
4. reasoning — collapsible reasoning chain (expand/collapse toggle)
5. image — rendered image with caption
6. actions — clickable chip row; primary chip gets gradient background; chip text is sent as next message
7. consent — amber-bordered gate card shown before irreversible actions
8. privacy — green (on-device) or amber (cloud-with-consent) banner
9. code — syntax-highlighted mono block with copy button and filename

**Why:** Adding new UI behaviour requires adding a new type here AND a matching branch in PartView.
