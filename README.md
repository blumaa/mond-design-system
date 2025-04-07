# Component Library Prototype

A modern component library built with React, TypeScript, and Storybook. This Turborepo-powered monorepo includes design tokens, React UI components, a Next.js web application, and a Storybook showcase.

## Tech Stack

- 🏗️ **Build Tool**: [Turborepo](https://turbo.build/) - High-performance build system for monorepos
- 📦 **Package Manager**: [Yarn](https://yarnpkg.com/) - Fast, reliable, and secure dependency management
- ⚛️ **Frontend**: React & Next.js - Modern web development
- 🎨 **Documentation**: Storybook - Component documentation and testing
- 🔷 **Language**: TypeScript - Type-safe JavaScript

## Project Structure

```
├── apps/
│   ├── storybook/     # Storybook documentation
│   └── web/          # Next.js web application
└── packages/
    ├── tokens/        # Design tokens (colors, spacing, typography, etc.)
    └── ui/            # React UI components
```

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Build the tokens:
```bash
yarn build:tokens
```

3. Start Storybook:
```bash
yarn storybook
```

Storybook will open in your browser at http://localhost:6006 (or the next available port).

## Available Scripts

This project uses Turborepo to manage the monorepo. All commands are run through Turborepo, which provides intelligent caching and task orchestration:

- `yarn build` - Build all packages (cached)
- `yarn build:tokens` - Build design tokens (cached)
- `yarn storybook` - Start Storybook development server
- `yarn dev` - Start development environment
- `yarn lint` - Run linting

Turborepo caches task outputs, so repeated builds will be significantly faster.

## Documentation

View the component documentation and design tokens in Storybook. The documentation includes:
- Color system
- Spacing scale
- Typography system
- Shadows
- Border radii
- UI Components
