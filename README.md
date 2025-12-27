# Lemonade Stand Greedy Change

An educational web demo showing a cashier simulation for a lemonade stand. Each lemonade costs $5. Customers pay with a single bill from {5, 10, 20, 50}. The cashier can only give change using bills already collected in the register, and must process customers in order.

## Greedy Strategy

The demo uses a **largest-first greedy algorithm** for making change:
- Bills are prioritized in order: 20 → 10 → 5
- For $15 change (from a $20 payment), this gives 10 + 5 instead of three $5 bills
- For $45 change (from a $50 payment), this uses $20s while consuming only one $5 when possible
- Preserving $5 bills is critical: without them, no future change is possible

This is not the general coin-change optimization problem; it's a cashier feasibility simulation with limited inventory and a fixed price of $5.

## Semantics

- **Price**: Fixed at $5
- **Valid bills**: 5, 10, 20, 50
- **Starting register**: Empty
- **Change-making**: Bills are removed from the register BEFORE adding the incoming payment
- **Processing**: Customers are served in order; if exact change cannot be made, the simulation fails at that customer

## Web Demo

Open [web_demo/index.html](web_demo/index.html) directly in your browser (no build step or dependencies). 

Enter payments as a comma-separated list, then use:
- **Reset**: Clear state and start over
- **Step**: Process one customer at a time
- **Run**: Process all remaining customers
- **Demo A/B/C**: Load preset scenarios
  - Demo A: `5,5,5,10,20,10` (PASS)
  - Demo B: `10` (FAIL - no change available)
  - Demo C: `5,5,5,10,5,10,20,5,10,50` (PASS)

The panel displays:
- **Status**: PASS/FAIL, failure index (1-based), and current pointer
- **Current transaction**: Payment, change due, bills given
- **Register visualization**: Counts of 5/10/20/50 bills
- **Log**: Scrollable history with one line per processed customer

### Local Development

**Option 1**: Double-click `web_demo/index.html` to open directly in your browser.

**Option 2**: Serve with a simple static server:
```bash
cd web_demo
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

### Vercel Deployment

The web demo can be deployed as a static site on Vercel:

**Dashboard setup**:
- Import repository
- Root Directory: `web_demo`
- Framework Preset: Other
- Build Command: (leave empty)
- Output Directory: `.`

**CLI deployment**:
```bash
npm i -g vercel
cd web_demo
vercel --prod
```
