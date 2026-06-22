# Sage App Review

**Project**: Iterativ Sage  
**Version**: v0.17 (The Reach Release)  
**Stack**: React 19 + TypeScript, TanStack (Start/Router/Query), Vite, Supabase, Tailwind CSS  
**Type**: Full-stack AI agent orchestration platform with multi-model routing

---

## Executive Summary

Sage is an ambitious, well-architected AI agent platform designed as an "ambient, autonomous AI agent for your phone." The app orchestrates multi-model AI workflows through threaded chat, persistent memory, and composable skills. The codebase is modern, type-safe, and thoughtfully structured. However, there are several areas for improvement in data handling, error resilience, and production readiness.

**Strengths**: Clean architecture, type safety, modern React patterns, ambitious feature set  
**Concerns**: Hardcoded test data, mock implementations, localStorage for critical state, missing error boundaries

---

## Architecture Overview

### Core Stack
- **Framework**: TanStack Start (meta-framework combining React Router + Server Functions)
- **Build**: Vite with TypeScript, ESLint, Prettier configured
- **State**: React Query (TanStack Query) for server state, React Hook Form for forms
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI Library**: Radix UI + custom Tailwind CSS theming
- **Auth**: Supabase Auth with middleware integration

### Project Structure
```
src/
├── routes/              # File-based routing (TanStack Router)
│   ├── __root.tsx       # Root shell & error boundaries
│   ├── auth.tsx         # Authentication page
│   ├── onboarding.tsx   # Onboarding flow
│   └── _authenticated/  # Protected routes (layout route)
│       ├── index.tsx    # Dashboard/home
│       ├── chat.$threadId.tsx  # Chat interface
│       ├── agents.tsx   # Agent management
│       ├── skills.tsx   # Skills library
│       ├── memory.tsx   # Persistent memory
│       └── settings.tsx # User settings
├── components/          # Reusable React components
│   ├── ui/             # Radix UI + Tailwind wrappers (shadcn-style)
│   ├── MobileShell.tsx # Mobile layout wrapper
│   ├── BottomTabs.tsx  # Mobile tab navigation
│   └── ...
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client & auth setup
├── hooks/              # Custom React hooks (useVoiceInput, useTTS, etc.)
├── lib/                # Utility functions & helpers
└── styles.css          # Global Tailwind + custom CSS variables
```

---

## Key Features & Pages

### 1. **Dashboard (`/` → `/index.tsx`)**
The hub where users see:
- **Status indicator**: "Multi-model active" with live pulse
- **Greeting**: Context-aware (morning/afternoon/evening)
- **Hero CTA**: Gradient card prompting new conversation
- **Quick Actions**: 6 preset prompts (Join Meeting, Deep Research, Email Draft, Schedule, Message, Workflow)
- **Live Agents**: Status cards showing running/scheduled agent jobs with progress bars
- **Recent Activity**: Timeline of actions (email drafted, meeting scheduled, agent completed, etc.)
- **Conversations**: Searchable list of past threads with timestamps and previews

**Assessment**:
- ✅ Polished mobile-first design with glassmorphism aesthetic
- ✅ Clear information hierarchy
- ⚠️ All data is hardcoded (QUICK_ACTIONS, LIVE_AGENTS, RECENT_ACTIVITY arrays)
- ⚠️ No actual agent query or backend integration visible
- ⚠️ Thread search filters locally; no server-side search

### 2. **Chat Interface (`/chat/$threadId`)**
Core conversation experience:
- Auto-scroll message list
- Voice input capture (useVoiceInput hook) with interim transcript display
- TTS playback toggle (stored in localStorage)
- Message rendering with multi-part content (text, reasoning, tool calls, etc.)
- Thinking state visualization (loading animation)
- Reasoning expansion toggle for Claude-style thinking
- Copy, feedback (👍/👎), rotate actions on messages
- Input textarea with voice/send controls

**Assessment**:
- ✅ Good voice/TTS UX with interim transcript feedback
- ✅ Type-safe message model (`Msg` with `parts: MessagePart[]`)
- ✅ Smooth auto-scroll and focus management
- ⚠️ **Hardcoded 900–1700ms delay** before mock response (line 93–94) — testing artifact left in production
- ⚠️ Mock reply generation via `mockReply()` — no real AI integration
- ⚠️ **Hardcoded user ID**: `'00000000-0000-0000-0000-000000000000'` (appears in multiple places)
- ⚠️ No error retry logic; failed message inserts silently fail
- ⚠️ TTS state persisted to localStorage with no fallback or validation
- ⚠️ Large component (200+ lines); no splitting of chat/input/message rendering

### 3. **Agents Page (`/agents.tsx`)**
Displays running/scheduled multi-agent workflows:
- Status cards showing agent name, goal, ETA, model, progress bar
- Expandable sub-agent trees (sub-agents with individual models & status)
- Privacy mode indicator (on-device vs. cloud-with-consent)
- Controls: Play/Pause/Delete/New buttons
- Last output display

**Assessment**:
- ✅ Clear hierarchical UI for complex agent workflows
- ✅ Privacy labels are a thoughtful touch
- ⚠️ All agent data is hardcoded (`INITIAL_RUNS` array)
- ⚠️ No state mutation (pause/delete appear non-functional)
- ⚠️ No real agent backend integration

### 4. **Other Pages** (briefly)
- **Skills** (`/skills.tsx`): Library of composable skills (hardcoded)
- **Memory** (`/memory.tsx`): Persistent user memory management (structure TBD)
- **Settings** (`/settings.tsx`): User preferences
- **Auth** (`/auth.tsx`): Login/signup
- **Onboarding** (`/onboarding.tsx`): First-time user flow

---

## Data Layer & Backend Integration

### Database (Supabase)
Minimal schema visible:
- `threads` table: `id, user_id, title, preview, updated_at`
- `messages` table: `id, thread_id, user_id, role (user|assistant), content, parts (JSON), created_at`

**Issues**:
- ⚠️ Hardcoded user ID in queries (`'00000000-0000-0000-0000-000000000000'`) — breaks multi-user auth
- ⚠️ No RLS (Row Level Security) policies visible; security model unclear
- ⚠️ No migrations or schema versioning in git

### Supabase Auth
- Auth middleware setup exists (`auth-middleware.ts`, `auth-attacher.ts`)
- Auth state change listener in root component invalidates queries on login/logout
- ✅ Clean integration via `supabase.auth.onAuthStateChange()`
- ⚠️ Actual auth flow (signup, login) not implemented in visible routes

### Real-time & Subscriptions
- No Supabase subscriptions for live updates
- All data fetching is polling via React Query
- Chat messages require manual page refresh to see new messages

---

## Code Quality Assessment

### Strengths
1. **Type Safety**: Full TypeScript, strict mode implied by tsconfig
2. **Modern React**: Hooks, no class components, proper dependency arrays
3. **Component Patterns**: Radix UI primitives well-composed
4. **Routing**: File-based routing is DX-friendly, no manual route config
5. **Styling**: Tailwind + CSS variables for theming (glassmorphism, gradient orbs)
6. **Linting**: ESLint + Prettier configured and enforced
7. **Error Boundaries**: Root error component catches crashes

### Weaknesses

#### 1. **Hardcoded Production Data**
```typescript
// In index.tsx
const QUICK_ACTIONS = [...]; // 6 hardcoded actions
const LIVE_AGENTS = [...];   // 2 hardcoded agents
const RECENT_ACTIVITY = [...]; // 5 hardcoded activity logs

// In agents.tsx
const INITIAL_RUNS: AgentRun[] = [...]; // Full agent data
```
These arrays should be fetched from the backend. This is a significant blocker for production use.

#### 2. **Hardcoded User ID**
```typescript
// Appears in index.tsx, chat.$threadId.tsx, and likely elsewhere
const uid = '00000000-0000-0000-0000-000000000000';
```
This disables multi-user support. Must use `supabase.auth.getUser()` on the server or provide via auth context.

#### 3. **Mock Implementation**
```typescript
// chat.$threadId.tsx, lines 93-94
await new Promise(r => setTimeout(r, 900 + Math.random() * 800));
const reply = mockReply(text); // Fake AI response
```
Mock delays & responses are clearly for demo. Needs real API integration.

#### 4. **localStorage for Critical State**
```typescript
// chat.$threadId.tsx
const [ttsEnabled, setTtsEnabled] = useState(() => 
  localStorage.getItem("sage_tts") !== "off"
);
```
TTS preference uses localStorage with no validation. Should be database + auth context.

#### 5. **Missing Error Handling**
```typescript
// Multiple places lack error handling:
const { error: e1 } = await supabase.from("messages").insert(...);
if (e1) throw e1; // Throws silently in production; no user feedback
```

#### 6. **Component Size**
- `chat.$threadId.tsx`: 200+ lines in a single component
- Suggestion: Split into ChatContainer, MessageList, ChatInput, MessageBubble

#### 7. **No Voice/TTS Fallback**
- `useVoiceInput` hook assumes browser support (Web Speech API)
- `useTTS` assumes browser TTS support
- No graceful degradation for older browsers or iOS

#### 8. **Search Not Optimized**
```typescript
// index.tsx, lines 83-86
const filtered = useMemo(() => threads.filter(t =>
  !q || t.title.toLowerCase().includes(q.toLowerCase()) ||
  (t.preview ?? "").toLowerCase().includes(q.toLowerCase())
), [threads, q]);
```
Local filtering works for demo, but won't scale. Needs server-side full-text search.

---

## Security & Privacy Concerns

1. **No Row-Level Security (RLS)** visible in Supabase
   - Users could theoretically query other users' threads
   - Recommendation: Enable RLS policies on `threads` and `messages` tables

2. **Auth Context Missing**
   - App reads user ID as hardcoded string instead of from auth
   - Supabase session could be compromised

3. **Secrets Management**
   - Supabase URL & anon key likely in `.env` or `vite.config.ts`
   - No visible `.env.example` or secrets documentation

4. **CORS & CSP**
   - No Content Security Policy headers visible
   - TanStack Start should handle this, but worth verifying

---

## Performance & Scalability

| Aspect | Status | Notes |
|--------|--------|-------|
| **Bundle Size** | ⚠️ Large | Radix UI + TanStack + Recharts likely 100kb+ gzip |
| **Code Splitting** | ⚠️ None | Route-based splitting should be automatic in TanStack Start |
| **Images** | ✅ Good | Lucide React for icons (tree-shakeable) |
| **CSS** | ✅ Good | Tailwind with JIT, CSS-in-JS minimal |
| **Data Fetching** | ⚠️ Polling | React Query polling, no real-time subscriptions |
| **Caching** | ⚠️ Basic | React Query defaults, no stale-while-revalidate |
| **Pagination** | ❌ None | Threads list unbounded; scales poorly |

### Recommendations
- Add pagination to `/` threads list
- Implement Supabase subscriptions for live chat & agent status
- Add service worker + offline support for PWA capability
- Profile bundle size: `npm run build && ls -lh dist/`

---

## Mobile & Accessibility

### Mobile UX
✅ **Strengths**:
- Mobile-first design (small padding, touch-friendly buttons, 44px+ tap targets)
- Glassmorphism aesthetic is cohesive
- BottomTabs component for mobile nav
- Responsive grid (3-column Quick Actions, single-column elsewhere)

⚠️ **Concerns**:
- No viewport meta tag customization for notch/safe area
- Assume full portrait mode; no landscape testing visible
- MobileShell component suggests mobile wrapper, but it's minimal (no nav bar)

### Accessibility
✅ **Good**:
- Semantic HTML (buttons, links, forms)
- Color contrast likely passes WCAG AA (dark background + primary colors)
- Lucide icons have semantic names
- Form inputs have proper labels (via Radix)

⚠️ **Gaps**:
- No `aria-label` on icon buttons (Plus, Search, Voice buttons, etc.)
- Chat messages lack `role="article"` or `aria-live="polite"`
- Loading states don't announce progress to screen readers
- No skip-to-content link
- Color-only status indicators (running/scheduled agents) need labels

### Recommendations
```tsx
<button aria-label="Start new chat" className="...">
  <Plus className="w-5 h-5" />
</button>

<div role="article" aria-label={`Message from ${msg.role}`}>
  {/* message content */}
</div>
```

---

## Testing & QA

**Status**: No visible test files in repo

### Recommendations
- Add Jest + React Testing Library for component tests
- Test critical paths: auth, chat send/receive, agent creation
- E2E tests (Playwright/Cypress) for full user flows
- Example test structure:
  ```
  src/__tests__/
  ├── routes/
  │   ├── auth.test.tsx
  │   └── chat.$threadId.test.tsx
  ├── components/
  │   └── NotificationCenter.test.tsx
  └── hooks/
      └── useVoiceInput.test.ts
  ```

---

## Deployment & CI/CD

**Current Setup**: Lovable.dev integration (visual editor)
- `.lovable/` directory for Lovable config
- Git history sync with Lovable (avoid force-push per AGENTS.md)

**Recommendations**:
- GitHub Actions workflow for build + test + deploy
- Environment configs for dev/staging/prod (Supabase projects)
- Secrets management (GitHub Secrets for API keys)
- Lighthouse CI for performance regression detection

---

## Missing/Incomplete Features

1. **Real AI Integration**
   - No OpenAI/Anthropic/Perplexity API calls
   - Mock responses only (priority: integrate with real models)

2. **Persistent Memory**
   - Memory page exists but implementation unclear
   - Should store user preferences, conversation summaries, learned patterns

3. **Skills Library**
   - Skills page exists but data is hardcoded
   - Needs backend for CRUD + composition logic

4. **Multi-Model Routing**
   - UI shows different models per agent (Claude, Perplexity, on-device)
   - No visible routing logic; mock only

5. **Privacy Mode**
   - "on-device" vs "cloud-with-consent" labels exist
   - No actual privacy enforcement or model switching

6. **Scheduled Agents**
   - "scheduled" status shown, but no real scheduling
   - Needs background job queue (Bull, BullMQ, or Supabase scheduled functions)

---

## Lovable Integration Notes

- Project is connected to [Lovable](https://lovable.dev) visual editor
- Git history is synced; avoid rewriting published commits (force-push, rebase)
- AGENTS.md emphasizes keeping branch in working state
- Implies this is a Lovable-generated + manually edited project

---

## Recommendations (Priority Order)

### Critical (Blockers for Production)
1. **Replace hardcoded user ID** with actual auth context
2. **Implement real AI API integration** (remove mockReply)
3. **Remove demo data** from frontend; fetch from backend
4. **Add comprehensive error handling** + user feedback (toast on failures)
5. **Enable Supabase RLS** policies for multi-user safety

### High (Next Sprint)
6. Add pagination to threads list
7. Implement Supabase real-time subscriptions (live chat, agent status)
8. Split large components (ChatPage into smaller modules)
9. Add accessibility labels (aria-label, aria-live)
10. Set up CI/CD pipeline (GitHub Actions)

### Medium (Polish & Scale)
11. Add unit & E2E tests
12. Implement PWA features (service worker, offline mode)
13. Add real persistent memory backend
14. Implement skill composition & storage
15. Add TypeScript strict mode (if not enabled)
16. Profile & optimize bundle size

### Low (Future Enhancements)
17. Dark/light theme toggle (currently dark-only)
18. Mobile landscape orientation support
19. Advanced voice control & gesture shortcuts
20. Analytics & instrumentation

---

## Code Examples for Common Patterns

### ✅ Good: Auth Listener
```tsx
// Root component
useEffect(() => {
  const { data: sub } = supabase.auth.onAuthStateChange((event) => {
    router.invalidate();
    if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
  });
  return () => sub.subscription.unsubscribe();
}, [router, queryClient]);
```

### ❌ Needs Fixing: Hardcoded User
```tsx
// Current: const uid = '00000000-0000-0000-0000-000000000000';

// Better:
const { data: { user } } = await supabase.auth.getUser();
const uid = user?.id ?? null;
if (!uid) throw new Error("Not authenticated");
```

### ✅ Good: Mutation with Optimistic Update
```tsx
const newThread = useMutation({
  mutationFn: async (seed?: string) => {
    const { data, error } = await supabase.from("threads").insert(...);
    if (error) throw error;
    return data;
  },
  onSuccess: (data) => {
    qc.invalidateQueries({ queryKey: ["threads"] });
    navigate({ to: "/chat/$threadId", params: { threadId: data.id } });
  },
});
```

---

## Summary Table

| Category | Status | Score | Comments |
|----------|--------|-------|----------|
| **Architecture** | ✅ Good | 8/10 | Clean structure, modern stack, good patterns |
| **Type Safety** | ✅ Good | 9/10 | Full TS, minimal `any` usage |
| **Code Quality** | ⚠️ Fair | 6/10 | Hardcoding + mock data are red flags |
| **UX/Design** | ✅ Excellent | 9/10 | Polished, cohesive, mobile-first |
| **Performance** | ⚠️ Fair | 6/10 | Polling, no pagination, bundle TBD |
| **Accessibility** | ⚠️ Fair | 5/10 | Semantic HTML but missing ARIA labels |
| **Security** | ⚠️ Fair | 5/10 | No RLS, hardcoded auth |
| **Testing** | ❌ Poor | 2/10 | No tests found |
| **Docs** | ⚠️ Fair | 4/10 | AGENTS.md only, no API/schema docs |
| **Production Readiness** | ❌ Poor | 3/10 | Mock data, no real integration |

**Overall**: **6.1/10** — Excellent UI/UX and architecture, but too many production blockers. Good foundation to build from; 2–4 weeks of work to production-ready.

---

## Next Steps

1. Schedule review sync with team to prioritize critical items
2. Create GitHub issues for each critical recommendation
3. Begin phase 1: Real AI integration + auth fixes
4. Set up CI/CD + testing infrastructure in parallel
5. Plan mobile beta launch once blockers are resolved

---

*Review completed on June 22, 2026*
