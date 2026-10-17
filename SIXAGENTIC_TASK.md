# SixAgentic Rebrand & Look-and-Feel Task

## Goal
Restyle the Hermes Desktop app (apps/desktop) to be visually faithful to sixmanager.com, and rename the product to **SixAgentic**. Work ONLY in this local clone (~/Projects/hermes-agent). No publishing, no pushing.

## SixManager design language (extracted from live site, use these values)
- Background: rgb(5, 7, 19) = #050713 (deep navy-black), secondary surfaces #0D1228, rgba(5,7,19,0.84) glass panels
- Primary text: #F5F7FA; muted text: rgba(255,255,255,0.48–0.55)
- Accent: rgb(127, 196, 255) = #7FC4FF (electric light blue); secondary accent rgb(70,137,200) = #4689C8
- Status colors: green #559E44 (online indicators), navy #252E5A
- Typography: DM Mono (labels, terminal/technical text, uppercase tracking), Archivo Black (display headings), Instrument Serif *italic* for emphasized words in headings
- Aesthetic: "system online" enterprise-terminal. Uppercase mono labels like "SIX / SYSTEM ONLINE", "CORE / 01". Section labels in brackets: "[ LO QUE HACEMOS ]". Numbered items "01 / 02 / 03". Live status indicators with green dots. Subtle gradients from #050713. Thin borders rgba(255,255,255,0.22). Terminal/monospace details, scanline/tech-grid feel. NOT playful, NOT rounded-bubbly: sharp, dense, technical, high contrast.

## Renaming rules
- Product display name everywhere in the desktop app: "SixAgentic" (window title, about, onboarding, loading screens, menu bar labels).
- Do NOT rename Python package names, import paths, npm package names, or file paths — only user-visible strings, branding assets references, and product identity files (see apps/desktop/product-identity.cjs).
- Keep "Hermes" in internal identifiers. Add a comment `/* SixAgentic rebrand */` where you change identity values.

## Where to look
- apps/desktop/product-identity.cjs — product identity
- apps/desktop/index.html, electron/ — window titles
- Theme/CSS/React UI: apps/desktop/src or apps/desktop/components — find the design tokens / theme files and restyle them
- Do not touch the agent core (agent/, hermes/ python code) beyond nothing — this is UI-only.

## Deliverable
1. Theme/tokens updated with the SixManager palette + fonts (use system fallbacks; load Google Fonts via @import or local @font-face is fine).
2. Product name SixAgentic everywhere user-visible.
3. Sidebar/header restyled: mono uppercase status label (e.g. "SIXAGENTIC / SYSTEM ONLINE" with green dot), dark #050713 base, #7FC4FF accents.
4. Run the desktop build/typecheck to prove it compiles: follow apps/desktop/BUILDING.md (at minimum `npm install && npm run build` or the documented typecheck).
5. Summarize: files changed, how to launch the app to see the result.
