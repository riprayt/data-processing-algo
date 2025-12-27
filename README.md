# Lemonade Stand Greedy Change

A tiny educational project that compares two cash-handling strategies for a lemonade stand. Each lemonade costs 5. Customers pay with a single bill from {5, 10, 20, 50}. You can only give change using bills already collected, and the goal is to decide whether every customer can be served in order.

## Greedy Idea and Invariant
- The critical resource is the 5-dollar bill. Without 5s, no later change is possible, so every decision must protect them when feasible.
- For a 20-dollar payment (change 15), the locally greedy rule is to give 10 + 5 when available instead of three 5s. It satisfies the current customer while conserving 5s for future customers, improving overall feasibility.
- This is not the general coin-change optimization problem; it is a cashier feasibility simulation with limited inventory and a fixed price.

## Strategies
- **Good greedy**: Follows the 10+5 preference for 15 change, and for 45 change (from a 50) it tries larger bills first while using only one 5.
- **Bad greedy (small-first)**: Always tries to spend the smallest bills it has, which often exhausts 5s too early.

Each function returns `(ok, fail_index, trace)` where `trace` records, per customer, the payment, change due, bills given, and register contents before/after.

## Running the CLI demo
```bash
python demo_cli.py
```
This prints three scenarios and shows PASS/FAIL along with a step-by-step trace for both strategies.

## Web demo
Open `web_demo/index.html` directly in your browser (no build step or dependencies). Enter payments as a comma-separated list, choose the strategy, then use Reset, Step, Run, or Run to failure to watch the simulation. The panel displays the current customer pointer, change due, bills dispensed, register counts for 5/10/20/50, and a scrolling log of steps.
