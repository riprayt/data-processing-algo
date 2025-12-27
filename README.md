# Data Processing Algorithms - Web Demo

This repository contains project files for the **Data Processing Algorithms** class.

## Overview

This is a web-based demonstration that illustrates the **Greedy Cashier Algorithm** - a classic example of greedy algorithms in computer science. The algorithm finds the minimum number of coins/bills needed to make change for a given amount.

## Project Structure

- `index.html` - Main HTML interface
- `app.js` - Algorithm implementation and logic
- `styles.css` - Styling for the web demo
- `vercel.json` - Deployment configuration for Vercel

## Algorithm Concept

The Greedy Cashier Algorithm works by:
1. Starting with the largest denomination available
2. Using as many of that denomination as possible
3. Moving to the next smaller denomination
4. Repeating until the exact change is made

This approach demonstrates how greedy algorithms make locally optimal choices at each step to find a global solution.

## Running the Demo

### Local Development
Simply open `index.html` in a web browser to run the demo locally.

### Deployment
This project is configured for deployment on Vercel:
```bash
vercel --prod
```

## Course Information

**Course:** Data Processing Algorithms  
**Project Type:** Interactive Algorithm Demonstration
