# FreshStock

FreshStock is a Next.js web app developed specifically for [BorNEO HackWknd 2026](https://www.borneohackwknd.org/) hackathon. FreshStock helps small-to-medium food businesses like *kedai runcit*, *pasar malam* vendors, and small restaurant operators manage inventory and reduce food waste through a single dashboard. It combines stock tracking, sales data, and AI-powered suggestions to give business owners a clearer picture of what's selling, what's expiring, and what needs restocking, without requiring any technical expertise.

> [Live Demo](https://freshstock.vercel.app/)

---

## Table of Contents

- [FreshStock](#freshstock)
	- [Table of Contents](#table-of-contents)
	- [Background](#background)
		- [SDGs Addressed](#sdgs-addressed)
		- [Target Users](#target-users)
	- [Features](#features)
		- [Dashboard](#dashboard)
		- [Product Stock](#product-stock)
		- [Stock Prediction](#stock-prediction)
		- [Waste \& Impact Tracker](#waste--impact-tracker)
		- [Market Price Intelligence](#market-price-intelligence)
		- [Sales Tracker](#sales-tracker)
		- [Situation Problem Solver](#situation-problem-solver)
	- [Getting Started](#getting-started)
		- [Environment Variables](#environment-variables)
		- [Tech Stack](#tech-stack)
		- [Project Structure](#project-structure)
	- [Usage](#usage)
		- [1. Dashboard](#1-dashboard)
		- [2. Product Stock](#2-product-stock)
		- [3. Waste \& Impact Tracker](#3-waste--impact-tracker)
		- [4. Sales Tracker](#4-sales-tracker)
		- [5. Stock Prediction](#5-stock-prediction)
		- [6. Market Price Intelligence](#6-market-price-intelligence)
		- [7. Situation Problem Solver](#7-situation-problem-solver)
	- [Deployment](#deployment)
	- [AI Acknowledgment](#ai-acknowledgment)
	- [Credits](#credits)

---

## Background

Small food retailers in Malaysia typically manage stock manually, through notebooks, WhatsApp reminders, or memory. This leaves them reactive rather than proactive: waste is only noticed after the fact, stockouts are only caught at the shelf, and supplier price hikes quietly erode margins. FreshStock addresses this gap with a lightweight, accessible tool built specifically for the Malaysian retail and F&B context.

### SDGs Addressed

- **SDG 2: Zero Hunger** - By helping businesses identify and reduce waste before it happens, more food stays within the supply chain. Less spoilage at the retail level means more food available to surrounding communities, directly contributing to local food security.
- **SDG 12: Responsible Consumption and Production (Target 12.3)** - FreshStock directly targets the halving of food waste at the retail level. The waste tracker and AI suggestions create a feedback loop that nudges business owners toward more conscious purchasing, storage, and disposal decisions over time.

### Target Users

Small food business operators who currently manage stock manually:

- *Kedai runcit* and grocery owners
- *Pasar malam* and *pasar tani* vendors
- Small restaurant and café operators
- F&B stall owners managing their own purchasing

---

## Features

### Dashboard

Displays total products, current stock units, total revenue, and live waste rate. The **Food Security Score** (0–100) aggregates waste, stock levels, and sales performance into a single community impact indicator where it starts at 100 and degrades as problems are detected. Recent sales and waste alerts are surfaced below for quick action.

### Product Stock

Add and manage product catalogue with stock quantities, selling prices, and optional ingredient breakdowns. Each product card displays total cost, selling price, and profit margin. Products with stock below 10 units automatically flag the Food Security Score.

### Stock Prediction

Two modes: **Manual Entry** lets you input a product and average daily sales to calculate 7-day demand, while **Run Auto-Prediction** pulls from your Sales Tracker history automatically. Results appear as forecast cards showing current stock vs. 7-day demand, clearly marked as **Stock Healthy** or **Restock Required**.

### Waste & Impact Tracker

Log waste events by selecting a product, entering quantity wasted, total batch stock, cost price, and reason (Spoiled, Unsold, Expired, etc.). The app calculates profit loss and waste rate automatically, then calls the **Gemini API** to generate a contextual AI recommendation. A running total of profit loss is displayed, and all entries are stored in Waste History with their AI insights visible.

### Market Price Intelligence

Track supplier price changes by logging old and new ingredient prices. The app calculates percentage increase and margin impact instantly, and suggests a menu price adjustment to protect margins. A **Bulk Import Quotes** option allows uploading a spreadsheet for batch processing. All entries appear under Inflation & Margin Analysis with actionable alerts.

### Sales Tracker

Record sales transactions per product. The dashboard shows total revenue, items sold, waste rate, and overstock rate. A **Revenue Trend** line chart visualises daily performance across the week, while **Best-Selling Products** and **Needs Attention** panels rank products by revenue. The **Food Security Score** is also reflected here as an Impact Assessment.

### Situation Problem Solver

Simulate real-world disruption scenarios grouped into categories like **Climate & Natural Disaster**, **Economic & Policy Scenarios** and **Supply Chain & Food Safety**. Each scenario models its projected impact on pricing and waste, helping business owners prepare contingency strategies before a crisis occurs.

---

## Getting Started

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required value:

```text
GEMINI_API_KEY=YOUR_API_KEY
```

Generate your key at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

### Tech Stack

| Tool | Purpose |
| --- | --- |
| [Next.js](https://nextjs.org/) | React framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Material UI](https://mui.com/) | React components |
| [Lucide](https://lucide.dev/) | Icons |
| [Gemini API](https://ai.google.dev/gemini-api/) | AI suggestions |
| [Recharts](https://recharts.org/) | Charts |
| [ESLint](https://eslint.org/) | Linting |

---

### Project Structure

```text
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
│   └── api/
├── public/
└── README.md
```

---

## Usage

All features are can be preloaded with mock data from the button on the bottom right corner so you can explore the full system without needing to enter anything manually. The app is best explored in this order:

### 1. Dashboard

Open the app, the Dashboard loads by default. Observe the **Food Security Score** (starts at 100 with clean data, lower with mock waste loaded). Scroll down to see Recent Sales and Waste Alerts populated from mock data.

### 2. Product Stock

Click **Product Stock** in the sidebar. Browse the five preloaded products.
Try clicking **+ Add Product** to add a new item with a name, stock quantity, and selling price. Notice the profit margin calculates automatically.

### 3. Waste & Impact Tracker

Click **Waste Tracker**. Select any product from the dropdown, enter a waste
quantity (e.g. 5), set Total Batch Stock (e.g. 50), select a reason such as  *Spoiled*, then click **Calculate Impact & Log**. Wait a moment — the Gemini API will return a live AI recommendation specific to your input. Scroll down to see the entry added to Waste History alongside its AI insight.

> ⚠️ This is the only feature making a live API call. Ensure `GEMINI_API_KEY` is set in `.env.local` before testing.

### 4. Sales Tracker

Click **Sales Tracker**. The revenue trend chart and product rankings are already populated from mock sales data spanning the past week. Try clicking **+ Record Sale**, select a product, enter a quantity, and submit. Watch the total revenue and items sold KPIs update immediately.

### 5. Stock Prediction

Click **Stock Prediction**. Click **Run Auto-Prediction**, the system will generate forecast cards for all products based on the mock sales history. Cards marked **Restock Required** in red indicate products where 7-day demand exceeds current stock. You can also use **Manual Entry** to select a product and input your own daily sales estimate, then click **Calculate**.

### 6. Market Price Intelligence

Click **Supplier Prices**. The three mock suppliers are already visible under Inflation & Margin Analysis. Try logging a new price change: enter a supplier name, ingredient, previous price (e.g. 5.00), and current price (e.g. 7.00), then click **Analyze Price Change**. The system will calculate the percentage increase and suggest a selling price adjustment.

### 7. Situation Problem Solver

Click **Situation Solver**. Browse the scenario categories. Click **View Impact** on any card, such as *Flood Disrupts Supply* or *Fuel Price Surge* to see the projected effect on pricing and waste, the risk level, and recommended actions.

---

## Deployment

Deploy instantly via [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/)

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.

---

## AI Acknowledgment

We acknowledge the use of Google's [Gemini 2.5 Flash](https://gemini.google.com/), OpenAI's [GPT-5.3](https://chat.openai.com/), and Anthropic's [Claude Sonnet 4.6](https://claude.ai/new) to help us improve  our code and debug errors to reduce our time efficiently.

## Credits

> Developed by Ochobot Team
