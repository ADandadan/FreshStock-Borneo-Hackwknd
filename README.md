# FreshStock

FreshStock is a Next.js web app developed specifically for [BorNEO HackWknd 2026](https://www.borneohackwknd.org/) hackathon. This web app is a working prototype to showcase some of the features that assist businesses in reducing food wastage through the usage of data and AI. The major features are product stock tracker, product stock prediction, waste tracker, supplier prices intelligence, sales tracker, and situation solver. Only waste tracker has proper implementation of AI, whereas the other features are only using placeholders as simulation. Some mock data are provided to demonstrate the features easier.

## Getting Started

First, install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Material UI](https://mui.com/) - React Components
- [Lucide](https://lucide.dev/) - Icons
- [Gemini API](https://ai.google.dev/gemini-api/) - AI functions
- [Recharts](https://recharts.github.io/) - React Charting Library
- [ESLint](https://eslint.org/) - Linting

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
    └── api/
├── public/
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```
GEMINI_API_KEY=YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your Google Gemini API Key. You can generate one through [Google's AI Studio](https://aistudio.google.com/app/apikey).

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.

## AI Disclosure

Parts of the codebase are assisted with OpenAI's GPT-5.3 Instant and Anthropic's Claude Sonnet 4.6
