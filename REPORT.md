# Lemonade Stand Greedy Algorithm Web Demo

**Summary**
- Simulates serving lemonade at $5 with payments in {5, 10, 20, 50, 100}; you may now seed the register via `bill:count` pairs or leave it empty for zeros.
- Greedy rule: make change using largest bills first (20 → 10 → 5) using only what is already in the register.
- Succeeds if every customer can be served; otherwise reports the first failing customer index and payment.
- UI shows status, current transaction, register counts, and a step-by-step log driven by a simulation trace.

## Problem Definition
- **Input:** Sequence of payments (each must be 5, 10, 20, 50, or 100), fixed price 5, optional initial register given as `bill:count` (defaults to zero counts when left blank).
- **Constraint:** Change must be constructed from current register contents only; incoming bill is unavailable until change is given.
- **Success:** All customers served in order. **Failure:** At customer *i*, exact change cannot be made with available bills (report *i* and payment value).
- Focus is feasibility under limited inventory—not minimizing number of coins; greedy is a pragmatic cashier policy for this setting.

## Core Algorithm Logic
Step per customer (before any UI details):
- Compute `changeDue = pay − 5`.
- Attempt to make exact change from current register using greedy order 50 → 20 → 10 → 5.
- If change fails, stop and report fail index and payment.
- If change succeeds, remove returned bills from register, then add the incoming bill.
- **Key pitfall avoided:** do **not** add the incoming bill before giving change; doing so would misrepresent feasibility.

**Pseudo-code sketch**
```text
reg = {5:0,10:0,20:0,50:0,100:0}
for i, pay in enumerate(payments, 1):
    change = pay - 5
    bills = greedy_make_change(change, reg)
    if bills is null: return FAIL(i, pay)
    subtract(bills, reg)      # give change first
    reg[pay] += 1             # then accept payment
return PASS
```

## Why Greedy Works Well Here
- Small bills, especially $5, are the critical resource enabling future change; preserving them maximizes future feasibility.
- Returning larger bills first satisfies current change while conserving $5s when possible.
- This is a practical greedy heuristic for the constrained cashier variant; we do not claim a universal optimality proof for all denominations or policies.

## Code Architecture (files → responsibilities)
- [index.html](index.html): page layout, panels, buttons (Reset/Step/Run, Demo A/B/C), static explanation, and fields for payments plus optional initial register `bill:count`.
- [styles.css](styles.css): visual theme, responsive grid, log and meter styling.
- [app.js](app.js):
  - Parses and validates comma-separated payments against allowed set {5,10,20,50,100}; parses optional initial register as `bill:count` with defaults to zero.
  - Simulation: `makeChangeGreedy` (largest-first), `processPaymentStep` builds per-customer trace entries with before/after registers.
  - UI state machine: Reset initializes state (with seeded register when provided), Step advances one customer, Run iterates until halt; halts on failure or completion.
  - Rendering: status/result panel, current transaction pointer, register counts, and append-only log.
- Trace entry shape: `(i, pay, changeDue, billsGiven, registerBefore, registerAfter)`; the UI log and stepper render directly from this trace data.

## Demonstrations / Test Scenarios
- Demo A: `5,5,5,10,20,10` → PASS (all served).
- Demo B: `10` → FAIL at customer 1 (no $5 available for change).
- Demo C: `5,5,5,10,5,10,20,5,10,50` → PASS (greedy change succeeds even for the final $50).
- UI shows status result, failure index/payment when relevant, highlights current pointer, and logs register transitions per step.

## Complexity
- Time: O(n) for n customers; change-making scans constant bill types.
- Space: O(n) to store the full trace/log for UI playback (could be O(1) if streamed without keeping history).

## Good Use of AI (process log)
- Step 1: Authored a correct reference implementation in Python to lock down semantics (price=5, allowed bills, change-before-accept rule).
- Step 2: Used AI to translate the same logic into browser-ready JavaScript and scaffold the UI panels/buttons.
- Step 3: Validated equivalence by running shared demo inputs (A/B/C) to confirm identical PASS/FAIL outcomes and failure indices, checking the critical rule that the incoming bill is added only after change, and comparing trace fields (registerBefore/After, billsGiven).
- Why this is good usage: AI accelerated translation and UI boilerplate while human-owned invariants and tests preserved correctness; AI was an assistant, not a substitute for understanding.
- Example prompts (high level):
  - “Port this Python lemonade-change loop to vanilla JS while keeping change-before-accept semantics.”
  - “Generate UI wiring for Reset/Step/Run buttons that consume a precomputed trace.”
  - “Summarize differences if JS output diverges from Python test cases for demo inputs A/B/C.”

## Academic Honesty / Limitations
- AI was used for code conversion and writing support; humans specified invariants, reviewed outputs, and validated against reference cases.
- Inputs outside {5,10,20,50} are rejected by the UI parser; the strategy is fixed to greedy largest-first (no alternative policies toggle).
