# Project Context for Qwen Code

## Project Overview

This is an Astro-based website for "Moura | Marketing e Comunicação Digital". The site is built using the Astro framework, which generates static HTML, CSS, and JavaScript. It utilizes several modern web technologies for enhanced interactivity and visual appeal.

### Core Technologies

- **Framework**: [Astro](https://astro.build/) (version ^5.13.5)
- **Styling**: Custom CSS with design tokens (CSS Custom Properties) for consistent theming.
- **Interactivity**: HTMX for dynamic interactions without a heavy JavaScript framework.
- **Animations**: GSAP, Anime.js, Framer Motion for advanced animations.
- **3D Graphics**: Three.js for potential 3D visualizations.
- **Scrolling**: Scroll-snapping for a section-based navigation experience.
- **UI Components**: Custom Astro components for layout and sections.
- **Icons**: Lucide icons via `lucide-astro`.
- **Internationalization**: Basic language switching with flag icons (Portuguese, English, Spanish).

### Project Structure

- `src/`: Contains the source code.
  - `pages/`: Astro page routes (e.g., `index.astro` for the homepage).
  - `layouts/`: Base HTML layouts (e.g., `Layout.astro`).
  - `components/`: Reusable Astro components, organized by section or function (e.g., `nav`, `sections`).
- `public/`: Static assets like images, fonts, and global stylesheets.
  - `styles/global.css`: The main stylesheet defining CSS custom properties (design tokens) and base styles.
- `astro.config.mjs`: Astro configuration file.

### Key Features

- **Scroll-Snapping Layout**: The homepage uses a vertical scroll-snap container for a section-by-section scrolling experience.
- **Modular Sections**: The homepage is composed of multiple Astro components (`Hero`, `BrandLed`, `Branding`, etc.), each representing a distinct section.
- **Custom Styling**: Extensive use of CSS custom properties for theming and a focus on minimalist design.
- **Client-Side Interactions**: Leverages HTMX for dynamic updates and GSAP/Anime.js for animations.

## Development Workflow

### Prerequisites

- Node.js (version not explicitly stated, but implied by `package.json` being present)
- npm (Node Package Manager)

### Building and Running

- **Install Dependencies**: `npm install`
- **Start Development Server**: `npm run dev` or `npm run start` (both run `astro dev`)
- **Build for Production**: `npm run build` (outputs to `dist/`)
- **Preview Production Build**: `npm run preview`

### Code Conventions

- **Component Structure**: Astro components (`.astro` files) are used for UI elements and pages. They typically import their specific CSS styles.
- **Styling**: CSS is managed globally in `public/styles/global.css` using CSS custom properties for consistency. Component-specific styles are imported within the component file.
- **Layout**: A main `Layout.astro` component provides the base HTML structure and includes slots for different content sections.