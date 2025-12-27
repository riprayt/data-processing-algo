# Data Processing Algorithms - Web Demo

This repository contains project files for the **Data Processing Algorithms** class.

## Overview

This is a web-based demonstration that illustrates the **Greedy Cashier Algorithm** - a classic example of greedy algorithms in computer science. The demo simulates serving $5 lemonade with payments in {5,10,20,50}, and now lets you seed the register with initial bill counts when testing scenarios.

## Project Structure

- `index.html` - Main HTML interface (payments field plus optional initial register field `bill:count`)
- `app.js` - Algorithm implementation and logic
- `styles.css` - Styling for the web demo
- `vercel.json` - Deployment configuration for Vercel

## Algorithm Concept

The Greedy Cashier Algorithm works by:
1. Starting with the largest denomination available
2. Using as many of that denomination as possible
3. Moving to the next smaller denomination
4. Repeating until the exact change is made

In this demo, change is made **before** accepting the incoming bill, and you can optionally set an initial register state such as `5:2,10:1` (leave empty for zeros).

This approach demonstrates how greedy algorithms make locally optimal choices at each step to find a global solution.

## Running the Demo

### Local Development
Open `index.html` in a web browser. Enter payments as comma-separated values (e.g., `5,5,10,20`). Optionally seed the register with `bill:count` pairs (e.g., `5:2,10:1,20:0,50:0`); leave the field blank to start from zero.

### Deployment
This project is configured for deployment on Vercel:
```bash
vercel --prod
```

## Course Information

**Course:** Data Processing Algorithms  
**Project Type:** Interactive Algorithm Demonstration
