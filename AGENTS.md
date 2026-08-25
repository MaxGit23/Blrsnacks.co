# AI Agent Instructions

**CRITICAL: You are operating in an optimized AI coding environment. To preserve context limits and reduce token usage, you MUST follow these instructions precisely.**

# Startup Instructions

1. Read PROJECT_CONTEXT.md
2. Read CURRENT_STATE.md
3. Read TASKS.md

Do not scan the repository unless explicitly instructed.

Only inspect files relevant to the requested task.

## Initialization Protocol
1. **Always read `PROJECT_CONTEXT.md` first.** This contains the architectural blueprint, database design, and core project rules.
2. **Always read `CURRENT_STATE.md` second.** This tells you what has been done and what to avoid doing again.
3. Review `TASKS.md` to understand your immediate objectives.

## Operational Constraints
* **Context Efficiency:** Read ONLY the files relevant to your specific task. 
* **Do NOT scan the entire repository** (`list_dir`, global `grep`, etc.) unless explicitly requested by the user.
* **Scope Discipline:** Do NOT refactor unrelated code. Do NOT analyze unrelated folders.
* **Brevity:** Keep your responses concise. Do not explain standard framework concepts unless asked.
* **Architectural Integrity:** Preserve the existing architecture. Follow the patterns outlined in `PROJECT_CONTEXT.md`.
* **Completion Protocol:** When you finish a significant task, you MUST update `CURRENT_STATE.md` and `TASKS.md` to reflect your changes before ending the session.

## Design & UI Rules (MANDATORY)
Any change that touches frontend UI — components, pages, styles, animations, interactions — MUST follow the design-engineering skills installed at `.agents/skills/`:

1. **Read `.agents/skills/emil-design-eng/SKILL.md` before writing any UI code.** Its rules are non-negotiable: no `transition: all`, no `ease-in` on UI elements, no `scale(0)` entrances, UI animations under 300ms with the strong custom curve tokens (`--ease-out/in-out/drawer` in globals.css), press feedback on pressables, hover motion gated behind `(hover: hover) and (pointer: fine)`, `prefers-reduced-motion` ships with every animation.
2. **Building a new animation/interaction?** Follow `.agents/skills/animate/SKILL.md` (gate → purpose → tool → properties → curve/duration) and start from its `RECIPES.md` when one matches.
3. **Touching gestures, sheets, translucency, or typography?** Consult `.agents/skills/apple-design/SKILL.md`.
4. **Before finishing a UI task**, self-review against `.agents/skills/review-animations/SKILL.md` and present UI changes as a Before/After/Why markdown table.
5. Extend the existing tokens in `globals.css`; never fork a parallel motion system.