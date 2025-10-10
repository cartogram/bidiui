# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

bidiui.com - An educational resource about building bi-directional (RTL/LTR) user interfaces. This is a single-page Astro site that presents a comprehensive guide for front-end developers on supporting right-to-left languages (Arabic, Hebrew, Persian) on the web.

## Commands

All commands use `pnpm`:

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm preview` - Preview production build locally
- `pnpm format` - Run linter/formatter and auto-fix
- `pnpm astro ...` - Run Astro CLI commands (e.g., `pnpm astro check`)

## Architecture

### Content-First Single Page Site

The site is built around a single MDX document that contains all the educational content:

- **Content source**: `/src/content/ui-in-a-bi-directional-web.md` - The main educational content about bi-directional UIs
- **Main page**: `/src/pages/index.astro` - Imports the MDX content and generates a table of contents from headings using `getHeadings()`
- The page uses Astro's MDX integration to import both the `Content` component and `getHeadings()` function

### Centralized Theming

Theme configuration lives in `/src/theme.ts` as a single source of truth:

```typescript
{
  color: { foreground, background },
  size: { base }
}
```

Theme values are injected into Astro components using the `define:vars` directive, allowing CSS to access TypeScript constants. This ensures consistency across all styling.

### Typography System

Uses Astro's experimental font provider (configured in `astro.config.mjs`):
- Font: Readex Pro (weights 100-900) from Google Fonts
- Configured via `fontProviders.google()`
- CSS variable: `--font-readex-pro`
- Applied through the `Head.astro` component using Astro's `<Font>` component

### Bi-directional UI Patterns

The codebase demonstrates the principles it teaches:
- Uses logical CSS properties (`inset-inline-start`, `inset-block-end`) instead of physical properties (`left`, `right`, `top`, `bottom`)
- The `Icon.astro` component shows RTL mirroring using `:dir(rtl)` and `.Icon:dir(rtl)` selectors
- Global styles use `text-wrap: balance` and `text-wrap: pretty` for better multilingual typography
- Demonstrates `writing-mode: vertical-rl` for vertical text in the footer

### Component Structure

- **Head.astro**: Font loading and base typography styles
- **Icon.astro**: SVG arrow with automatic RTL mirroring - demonstrates bidirectional design patterns
- **index.astro**: Main page layout with global styles using `is:global` and theme variables

## Code Style

- Uses Biome for linting and formatting
- 2-space indentation
- Double quotes for JavaScript/TypeScript
- Imports are auto-organized
- Follows Astro's strict TypeScript config
