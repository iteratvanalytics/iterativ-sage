---
name: Chat MessagePart types
description: All MessagePart union types used in mockAgent.ts and rendered by PartView
---

The chat UI was split out of `chat.$threadId.tsx` into `src/components/chat/`:
`PartView.tsx` (part renderer), `MessageBubble.tsx` (+ `Msg` type), `ChatInput.tsx`,
`ChatStates.tsx` (EmptyState + ThinkingOrchestrator), `markdown.tsx` (renderMd/renderInlineMd).
The route file is now just the container/data layer.

10 part types defined in `src/lib/mockAgent.ts` and rendered by `PartView` in `src/components/chat/PartView.tsx`:

1. text — rendered markdown (headers, bullets, code blocks, blockquotes, bold, inline code)
2. tool — tool call card with icon, label, status badge, result, duration
3. subagent — sub-agent card with name, model, goal, status
4. reasoning — collapsible reasoning chain (expand/collapse toggle)
5. image — rendered image with caption
6. actions — clickable chip row; primary chip gets gradient background; chip text is sent as next message
7. consent — amber-bordered gate card shown before irreversible actions
8. privacy — green (on-device) or amber (cloud-with-consent) banner
9. code — syntax-highlighted mono block with copy button and filename
10. table — headers + rows, inline-markdown cells

**Why:** Adding new UI behaviour requires adding a new type here AND a matching branch in PartView.

**Real vs mock replies:** chat now calls the `generateReply` server function in
`src/lib/chat.functions.ts`. With `ANTHROPIC_API_KEY` set it calls the Anthropic API
(returns a text + privacy part); with no key it falls back to `mockReply` (rich parts).
User id comes from `getCurrentUserId()` in `src/lib/auth.ts` (real session or DEMO_USER_ID).
