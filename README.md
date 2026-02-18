# Product Comparison

An interactive product comparison tool built with React, TypeScript, Tailwind CSS, and Zustand.

## Features

- Compare up to 4 products side-by-side
- Highlight differences between specs
- URL sharing — comparison state is persisted in the URL
- Dark mode UI
- Fully accessible (keyboard navigation, ARIA labels, skip-to-content)
- Responsive layout

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool & dev server
- **Tailwind CSS** — utility-first styling
- **Zustand** — lightweight state management
- **Vitest** + **Testing Library** — unit & component tests

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # UI components
├── data/           # Static product & spec data
├── hooks/          # Custom React hooks
├── store/          # Zustand store
├── types/          # TypeScript types
├── utils/          # Utility functions
└── __tests__/      # Test files
```

## Deployment

This project is configured for one-click deployment on [Vercel](https://vercel.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/product-comparison)
