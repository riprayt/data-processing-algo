# Lemonade Stand Greedy Algorithm Web Demo

This repository contains project files for the **Data Processing Algorithms** class.

## Summary

- Simulates serving lemonade at $5 with payments in {5, 10, 20, 50, 100}; you may seed the register via `bill:count` pairs or leave it empty for zeros.
- Greedy rule: make change using largest bills first (50 → 20 → 10 → 5) using only what is already in the register.
- Succeeds if every customer can be served; otherwise reports the first failing customer index and payment.
- UI shows status, current transaction, register counts, and a step-by-step log driven by a simulation trace.

## Problem Definition

- **Input:** Sequence of payments (each must be 5, 10, 20, 50, or 100), fixed price 5, optional initial register given as `bill:count` (defaults to zero counts when left blank).
- **Constraint:** Change must be constructed from current register contents only; incoming bill is unavailable until change is given.
- **Success:** All customers served in order. **Failure:** At customer *i*, exact change cannot be made with available bills (report *i* and payment value).

## Core Algorithm Logic

Step per customer:
- Compute `changeDue = pay − 5`.
- Attempt to make exact change from current register using greedy order 50 → 20 → 10 → 5.
- If change fails, stop and report fail index and payment.
- If change succeeds, remove returned bills from register, then add the incoming bill.
- **Key rule:** do **not** add the incoming bill before giving change; doing so would misrepresent feasibility.

## Code Architecture

- `index.html` - Page layout, panels, buttons (Reset/Step/Run, Demo A/B/C), static explanation, and fields for payments plus optional initial register `bill:count`.
- `styles.css` - Visual theme, responsive grid, log and meter styling.
- `app.js`:
  - Parses and validates comma-separated payments against allowed set {5,10,20,50,100}; parses optional initial register as `bill:count`.
  - Simulation: `makeChangeGreedy` (largest-first), `processPaymentStep` builds per-customer trace entries.
  - UI state machine: Reset initializes state, Step advances one customer, Run iterates until halt.
  - Rendering: status/result panel, current transaction pointer, register counts, and append-only log.
- `lemonade_stand.py` - Reference Python implementation written by students before web app conversion.

## Demonstrations / Test Scenarios

- Demo A: `5,5,5,10,20,10` → PASS (all served).
- Demo B: `10` → FAIL at customer 1 (no $5 available for change).
- Demo C: `5,5,5,10,5,10,20,5,10,50` → PASS (greedy change succeeds even for the final $50).

## How We Used AI Gracefully

- Step 1: Authored a correct reference implementation in Python to lock down semantics (price=5, allowed bills, change-before-accept rule).
- Step 2: Used AI to translate the same logic into browser-ready JavaScript and scaffold the UI panels/buttons.
- Step 3: Validated equivalence by running shared demo inputs (A/B/C) to confirm identical PASS/FAIL outcomes and failure indices.
- Why this is good usage: AI accelerated translation and UI boilerplate while human-owned invariants and tests preserved correctness; AI was an assistant, not a substitute for understanding.

## Running the Demo

### Local Development

Open `index.html` in a web browser. Enter payments as comma-separated values (e.g., `5,5,10,20,100`). Optionally seed the register with `bill:count` pairs (e.g., `5:2,10:1,20:0,50:0,100:0`); leave the field blank to start from zero.

### Deployment

This project is configured for deployment on Vercel:
```bash
vercel --prod
```

## Complexity

- Time: O(n) for n customers; change-making scans constant bill types.
- Space: O(n) to store the full trace/log for UI playback.

## Academic Honesty

- AI was used for code conversion and writing support; humans specified invariants, reviewed outputs, and validated against reference cases.
- Inputs outside {5,10,20,50,100} are rejected by the UI parser; the strategy is fixed to greedy largest-first (no alternative policies toggle).
