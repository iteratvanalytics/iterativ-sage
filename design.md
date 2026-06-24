---
name: Sage
colors:
  primary: "#D946EF"
  secondary: "#8B5CF6"
  tertiary: "#F59E0B"
  accent: "#A78BFA"
  background: "#1A0A2E"
  surface: "#2D1B4E"
  foreground: "#FFFFFF"
  muted: "#A78BFA"
  destructive: "#EF4444"
gradients:
  bg: "linear-gradient(180deg, #4A1D6B 0%, #2D1B4E 40%, #1A0A2E 100%)"
  hero: "linear-gradient(135deg, #D946EF 0%, #8B5CF6 50%, #A78BFA 100%)"
  siri: "conic-gradient(from 180deg at 50% 50%, #D946EF, #8B5CF6, #A78BFA, #D946EF)"
  voice: "linear-gradient(135deg, #D946EF 0%, #F59E0B 50%, #EC4899 100%)"
  sunset: "linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #8B5CF6 100%)"
typography:
  fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
  h1: { fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" }
  h2: { fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.01em" }
  body: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 }
  caption: { fontSize: "0.8125rem", fontWeight: 500 }
rounded:
  sm: 8px
  md: 12px
  lg: 20px
  xl: 28px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
shadows:
  card: "0 8px 32px -8px rgba(0,0,0,0.4)"
  elevated: "0 20px 60px -20px rgba(0,0,0,0.6)"
  glow: "0 0 80px rgba(217,70,239,0.35)"
  button: "0 4px 24px -4px rgba(217,70,239,0.4)"
effects:
  glassBlur: "blur(24px) saturate(180%)"
  glassBorder: "1px solid rgba(255,255,255,0.06)"
motion:
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  ease: "cubic-bezier(0.4, 0, 0.2, 1)"
  durations: { fast: "150ms", base: "300ms", slow: "600ms" }
---

## Overview

**Apple-grade calm meets ambient intelligence.** Sage is a mobile-first AI
companion that fuses the spatial polish of iOS 26 / Siri AI, the agentic
depth of Hermes, and the workflow gravity of Perplexity Computer. The UI
should feel like a *living surface* — deep violet glass, conic Siri orbs,
and warm sunset accents that breathe when the agent is thinking.

The visual identity is deliberately **not** the generic "indigo gradient on
white" SaaS look. Everything sits on a deep aubergine field; light is
emitted, not painted on.

## Colors

The palette is rooted in **deep night-violet neutrals** with an electric
magenta primary and a warm amber accent reserved for voice/agentic moments.

- **Primary (#D946EF — Electric Magenta):** The Siri/Sage signature. Used
  for the orb, primary CTAs, focus rings, and active states. Never use it
  as a flat fill behind long-form text.
- **Secondary (#8B5CF6 — Royal Violet):** Mid-tone for gradients,
  secondary buttons, and skill icons.
- **Tertiary (#F59E0B — Sunset Amber):** Reserved for voice input,
  listening states, and "agent-running" affordances. Pairs with magenta in
  the `voice` and `sunset` gradients.
- **Accent (#A78BFA — Lavender Mist):** Muted-foreground, captions,
  timestamps, inactive tab labels.
- **Background (#1A0A2E):** Deep aubergine. The app sits on the `bg`
  gradient that fades from `#4A1D6B` at the top to `#1A0A2E` at the bottom.
- **Surface (#2D1B4E):** Cards, sheets, popovers, the chat composer.
  Combined with `glassBlur` for floating overlays.
- **Foreground (#FFFFFF):** Default text. Always white on the dark field;
  there is no light theme.

## Typography

System SF stack only — Sage feels native on iOS and avoids the generic
"Inter everywhere" look. Headlines lean tight (`-0.02em`) and heavy
(`700`), body text stays comfortable (`1.5` line-height), captions use
`muted-foreground` so metadata recedes.

Never introduce a serif, a script, or a second display face. The only
permitted variation is weight (400 / 500 / 600 / 700) and the gradient
text treatment (`text-gradient`, `text-gradient-sunset`) for hero moments.

## Surfaces & Layout

- **Mobile shell first.** Design at 390×844 (iPhone). Bottom tab bar with
  glass blur, safe-area-aware. Desktop is a centered 420px column.
- **Generous radii.** Cards `20px`, sheets `28px`, pills `9999px`. Buttons
  are pill-shaped by default. Sharp corners are reserved for inline code.
- **Glass everywhere it floats.** Tab bar, modal sheets, notification
  center, and the chat composer use `.glass` / `.glass-strong` — never a
  solid bar over the gradient field.
- **Spacing rhythm:** 4 / 8 / 16 / 24 / 32. Don't invent values between.

## Motion

Sage *breathes*. Three signature motions:

1. **Orb spin + pulse** (`orb-spin` 8s linear, `orb-pulse` 4s ease-in-out)
   — the Siri orb is always alive, even at rest.
2. **Voice breathe** (`breathe` 2s) — the mic button scales 1 → 1.15 while
   listening, tinted with the `voice` gradient.
3. **Fade-in-up** (`fade-in-up` 400ms) — every new message, card, and
   route enters from 8px below with a soft ease-out.

Spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) is used for sheet
presentations and tab transitions; standard ease for everything else.
Never use linear easing on UI elements outside infinite loops.

## Components

- **Siri Orb (`.siri-orb` + `.siri-orb-glow`):** Conic magenta→violet
  gradient with a radial glow halo. Appears on the home screen, in voice
  mode, and as the agent's "thinking" indicator.
- **Message bubbles:** User = `primary` fill, white text, right-aligned,
  pill radius with a flattened bottom-right corner. Agent = `glass` on the
  gradient field, left-aligned, with streaming markdown.
- **Chat composer:** Pill-shaped `glass-strong` field, mic button on the
  right (amber when listening), send button morphs in when text exists.
- **Skill / Agent cards:** `gradient-border` with a `surface` interior,
  icon in a `secondary` rounded square, title in 600 weight, description
  in `muted-foreground`.
- **CTAs:** `.glow-button` — magenta fill, `shadow-button` glow, lifts 1px
  on hover, settles on press.

## Voice & Agentic States

These states are the soul of Sage and must be visually distinct from idle
chat:

- **Listening:** Mic button uses `voice` gradient + `breathe` animation,
  composer border pulses amber, waveform replaces the placeholder.
- **Thinking:** Three `thinking-dot`s under the agent avatar with
  staggered bounce; orb glow intensifies.
- **Acting (tool/skill running):** Inline card with `sunset` gradient
  border and a shimmer sweep (`shimmer-bg`), showing the skill name and a
  cancel affordance.

## Anti-patterns

Do not do any of the following — they break Sage's identity:

- Pure white backgrounds, light theme, or `bg-white` / `text-black` literals.
- Indigo/blue-purple SaaS gradients (Stripe, Linear clones). Sage is
  magenta-violet, never blue-violet.
- Inter, Poppins, or any non-system font.
- Flat solid bars (navbar, tab bar, modal) over the gradient field — they
  must be glass.
- Sharp 4px-radius cards. Sage is soft.
- Hardcoded Tailwind color utilities. Always go through the semantic
  tokens defined in `src/styles.css`.
