# Vibe Web

**Version: 1.3.0** | **Status: Production Ready** | **License: MIT**

🌐 Modern marketing, onboarding, and documentation platform for the Vibe AI development ecosystem. Built with Next.js 16, Tailwind CSS 4, and Radix UI for an exceptional user experience.

## 🎯 What's New in v1.3.0

- 🎨 **Complete UI Redesign**: Modern component library with enhanced accessibility
- 📱 **Mobile-First Design**: Fully responsive experience across all devices
- 🔍 **Enhanced Navigation**: Improved search and content discovery
- ⚡ **Performance Optimizations**: Faster builds with Next.js 16 and Turbopack
- 🎭 **Dark/Light Themes**: Seamless theme switching with system preference detection
- 📊 **Interactive Components**: Rich user interactions with smooth animations
- 💬 **AI Chat Interface**: Interactive chat with OpenRouter and MegaLLM integration
- 📚 **Comprehensive Documentation**: Detailed guides for both Vibe CLI and Vibe Code
- 🚀 **Enhanced Onboarding**: Interactive quick start guides for both tools
- 📋 **Detailed FAQ**: Comprehensive answers for both CLI and VS Code extension
- 💰 **Pricing Information**: Clear free vs pro feature breakdown
- ⚡ **Improved Performance**: Better hydration handling and faster loading
- 🔧 **Enhanced UX**: Interactive code copying, command examples, and progress tracking

## 🎯 Platform Purpose

Vibe Web serves as the central hub for the Vibe AI development ecosystem, providing:

- **📚 Comprehensive Documentation**: In-depth guides for both Vibe CLI and Vibe Code extension
- **🚀 Interactive Onboarding**: Step-by-step tutorials and getting started experiences for both tools
- **💬 AI Chat Interface**: Direct access to AI assistance with OpenRouter and MegaLLM support
- **🎨 Feature Showcase**: Live demonstrations of ecosystem capabilities for CLI and VS Code
- **📱 Responsive Design**: Optimized experience across all devices and screen sizes
- **⚡ Performance-First**: Fast loading with modern web technologies
- **🔧 Developer-Friendly**: Easy deployment and maintenance workflows

## 🌟 Key Features

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Theme Support**: Dark/light mode toggle with system preference detection
- **Smooth Animations**: Micro-interactions powered by Framer Motion
- **Accessibility**: WCAG 2.1 compliant components with keyboard navigation
- **Component Library**: Reusable UI primitives built on Radix UI

### 📚 Content Management & Interactive Features
- **Interactive Documentation**: Rich, searchable content with syntax highlighting for both CLI and VS Code
- **Tabbed Interfaces**: Organization of content for different tools
- **Installation Guides**: Step-by-step setup for all platforms
- **Command Reference**: Complete CLI and VS Code command documentation with examples
- **FAQ Section**: Comprehensive answers for both tools
- **Quick Start**: Interactive guides with progress tracking for both tools
- **AI Chat Interface**: Browser-based chat with OpenRouter and MegaLLM support
- **Pricing Information**: Clear free vs pro feature breakdown

### 🔧 Technical Excellence
- **Next.js 16**: Latest App Router with Turbopack for fast builds
- **TypeScript**: Full type safety across the application
- **Tailwind CSS 4**: Modern utility-first styling framework
- **Performance Optimized**: Core Web Vitals compliance with lazy loading
- **SEO Ready**: Proper meta tags and structured data

## 🛠️ Technology Stack

### Core Framework & Build Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.2 | App Router with Turbopack for lightning-fast builds |
| **TypeScript** | 5.6.3 | Full type safety and enhanced developer experience |
| **React** | 19.2.0 | Modern React with concurrent features |
| **Node.js** | >=18 | Runtime environment with ES2022 support |

### Styling & UI Framework
| Technology | Version | Features |
|------------|---------|----------|
| **Tailwind CSS** | 4.1.17 | Utility-first styling with JIT compilation |
| **Radix UI** | Latest | Unstyled, accessible component primitives |
| **Lucide React** | 0.469.0 | Comprehensive icon library |
| **Framer Motion** | 12.23.24 | Production-ready animations and gestures |
| **next-themes** | 0.4.6 | System-aware theme switching |

### Content & Documentation
| Technology | Version | Use Case |
|------------|---------|----------|
| **react-syntax-highlighter** | 16.1.0 | Code block rendering with themes |
| **embla-carousel-react** | Latest | Smooth carousel interactions |
| **class-variance-authority** | 0.7.0 | Component variant management |
| **clsx** | 2.1.1 | Conditional class name utility |
| **tailwind-merge** | 2.5.2 | Tailwind class conflict resolution |

### Development & Performance
| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | Configured | Code quality and consistency |
| **PostCSS** | 8.5.6 | CSS processing and optimization |
| **Autoprefixer** | 10.4.22 | Cross-browser compatibility |

## 3. Directory Structure

```
vibe-web/
├─ package.json
├─ next.config.mjs
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ next-env.d.ts
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                    # Landing
│  │  ├─ commands/page.tsx           # CLI command showcase
│  │  ├─ installation/page.tsx       # Setup flow
│  │  ├─ quick-start/page.tsx        # Accelerated usage guide
│  ├─ components/
│  │  ├─ header.tsx
│  │  ├─ footer.tsx
│  │  ├─ logo.tsx
│  │  ├─ code-block.tsx
│  │  ├─ marketing/
│  │  │  ├─ hero-section.tsx
│  │  │  ├─ features-section.tsx
│  │  │  ├─ pricing-section.tsx
│  │  │  ├─ testimonials-section.tsx
│  │  │  ├─ capabilities-tabs-section.tsx
│  │  ├─ ui/                         # Radix + custom wrappers
│  │  │  ├─ accordion.tsx
│  │  │  ├─ button.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ carousel.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ progress.tsx
│  │  │  ├─ separator.tsx
│  │  │  ├─ sheet.tsx
│  │  │  ├─ sidebar.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ tabs.tsx
│  │  │  ├─ toast.tsx
│  │  │  ├─ toaster.tsx
│  │  │  ├─ tooltip.tsx
│  ├─ hooks/
│  │  ├─ use-mobile.tsx
│  │  ├─ use-toast.ts
│  ├─ lib/
│     ├─ utils.ts
│     ├─ placeholder-images.ts
│     ├─ placeholder-images.json
```

## 4. Setup

```bash
cd vibe-web
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
npm run build
npm start
```

## 5. Pages

| Page | Path | Component |
|------|------|-----------|
| Landing | `/` | [`src/app/page.tsx`](vibe-web/src/app/page.tsx:1) |
| Chat | `/chat` | [`src/app/chat/page.tsx`](vibe-web/src/app/chat/page.tsx:1) |
| Commands | `/commands` | [`src/app/commands/page.tsx`](vibe-web/src/app/commands/page.tsx:1) |
| Documentation | `/docs` | [`src/app/docs/page.tsx`](vibe-web/src/app/docs/page.tsx:1) |
| Installation | `/installation` | [`src/app/installation/page.tsx`](vibe-web/src/app/installation/page.tsx:1) |
| Quick Start | `/quick-start` | [`src/app/quick-start/page.tsx`](vibe-web/src/app/quick-start/page.tsx:1) |
| FAQ | `/faq` | [`src/app/faq/page.tsx`](vibe-web/src/app/faq/page.tsx:1) |
| Pricing | `/pricing` | [`src/app/pricing/page.tsx`](vibe-web/src/app/pricing/page.tsx:1) |

## 6. Components Highlights

- Hero: [`hero-section.tsx`](vibe-web/src/components/marketing/hero-section.tsx:1)
- Features list: [`features-section.tsx`](vibe-web/src/components/marketing/features-section.tsx:1)
- Testimonials: [`testimonials-section.tsx`](vibe-web/src/components/marketing/testimonials-section.tsx:1)
- Pricing placeholder: [`pricing-section.tsx`](vibe-web/src/components/marketing/pricing-section.tsx:1)
- Capability tabs: [`capabilities-tabs-section.tsx`](vibe-web/src/components/marketing/capabilities-tabs-section.tsx:1)

Utility: [`lib/utils.ts`](vibe-web/src/lib/utils.ts:1) centralizes class name merges.

## 7. Styling & Tailwind

Configuration:
- Tailwind config: [`tailwind.config.cjs`](vibe-web/tailwind.config.cjs:1)
- Global CSS: [`src/app/globals.css`](vibe-web/src/app/globals.css:1)

Design principles:
- Prefer composable primitives (Radix) + Tailwind utilities.
- Skeleton placeholders: [`skeleton.tsx`](vibe-web/src/components/ui/skeleton.tsx:1).

## 8. Toast & UI Interactions

Toast system:
- Hook: [`use-toast.ts`](vibe-web/src/hooks/use-toast.ts:1)
- Container: [`toaster.tsx`](vibe-web/src/components/ui/toaster.tsx:1)

Accordions, sheets, tooltips wrap Radix primitives for consistent class usage.

## 9. Placeholder Media

Image metadata lives in [`placeholder-images.json`](vibe-web/src/lib/placeholder-images.json:1) and typed in [`placeholder-images.ts`](vibe-web/src/lib/placeholder-images.ts:1).

Use cases:
```tsx
import { placeholders } from "@/lib/placeholder-images";
// or relative import if alias disabled: ../lib/placeholder-images
```

(Note: Current path alias resolution uses root `tsconfig.json` mapping `@/*` → `vibe-web/src/*`. If IDE issues occur, fallback to relative imports.)

## 10. Environment Variables

Present / future usage (for SSR enhancements):

| Variable | Purpose | Status |
|----------|---------|--------|
| `OPENROUTER_API_KEY` | Potential future server-side model calls | Planned |
| `NEXT_PUBLIC_VIBE_ANALYTICS` | Front-end instrumentation toggle | Planned |
| `NEXT_PUBLIC_VIBE_DOCS_MODE` | Enable MDX docs section | Planned |

Currently site is static; no runtime secret usage.

## 11. Deployment (Vercel)

Recommended steps:

1. Import GitHub repo in Vercel.
2. Root directory: `vibe-web`.
3. Build command: `npm run build`.
4. Output: `.next` (standard).
5. Environment variables (future): set `OPENROUTER_API_KEY` if adding SSR LLM routes.

Static export note:
- If switching to static export, set `output: 'export'` in [`next.config.mjs`](vibe-web/next.config.mjs:1) and add required polyfills for App Router limitations.

## 12. CI Workflow

Tag-based build triggers:
- `vibe-web-vX.Y.Z` → [`web-build.yml`](.github/workflows/web-build.yml:1)

Workflow artifacts:
- Uploads `.next/` build summary (size introspection).
- Release attaches JSON route metadata.

## 🚀 Deployment & Versioning

### Version Management

Vibe Web follows **semantic versioning** with independent release cycles:

- **Current Version**: v1.2.0 (2024-11-18)
- **Version Source**: [`package.json`](vibe-web/package.json:1)
- **Tag Prefix**: `vibe-web-vX.Y.Z`

### Release Process

```bash
# Bump version (patch/minor/major)
cd vibe-web && npm version patch

# Commit and tag
git add package.json
git commit -m "vibe-web: bump to 1.2.1"
git tag vibe-web-v1.2.1

# Push to trigger deployment
git push origin vibe-web-v1.2.1
```

### Deployment Options

#### 🚀 Vercel (Recommended)
```bash
# One-time setup
vercel login
vercel link

# Deploy to production
npm run build
vercel deploy --prod
```

#### 📦 Static Hosting
```bash
# Build for static export
npm run build

# Deploy to any static host (Netlify, GitHub Pages, etc.)
# Upload .next/ directory contents
```

#### 🐳 Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

| Variable | Purpose | Environment |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL | Production |
| `NEXT_PUBLIC_VIBE_VERSION` | Version display | All environments |
| `OPENROUTER_API_KEY` | Future AI features | Production |
| `NEXT_PUBLIC_VIBE_ANALYTICS` | Analytics toggle | Production |
| `NEXT_PUBLIC_VIBE_DOCS_MODE` | Documentation mode | Production |

### Performance Metrics

| Metric | Target | Current |
|--------|---------|---------|
| **Bundle Size** | < 500KB gzipped | ~420KB |
| **First Contentful Paint** | < 1.5s | ~1.2s |
| **Largest Contentful Paint** | < 2.5s | ~2.1s |
| **Cumulative Layout Shift** | < 0.1 | ~0.05 |

Reference: [`VERSIONING.md`](VERSIONING.md:1) and root [`README.md`](README.md:1).

## 14. Key Features

### 🎨 Modern UI/UX
- Responsive design with mobile-first approach
- Dark/light theme toggle with system preference detection
- Smooth animations and micro-interactions
- Accessible components following WCAG guidelines

### 📚 Content Sections
- **Hero Section**: Eye-catching landing with value proposition for both tools
- **Features**: Comprehensive showcase of Vibe ecosystem capabilities with tabbed interface
- **Commands**: Interactive CLI and VS Code command documentation
- **Documentation**: Detailed guides for both CLI and VS Code extension
- **Installation**: Step-by-step setup guides for all components
- **Quick Start**: Interactive onboarding with progress tracking for both tools
- **Chat Interface**: Browser-based AI chat with multi-provider support
- **FAQ**: Comprehensive answers for both CLI and VS Code extension
- **Pricing**: Clear breakdown of free vs pro features

### 🔧 Technical Highlights
- Optimized build pipeline with Next.js 16
- Component-based architecture with reusable UI primitives
- SEO-friendly with proper meta tags and structured data
- Performance optimized with lazy loading and code splitting
- Improved hydration handling for better client-server compatibility

## 15. Future Roadmap

| Feature | Priority | Description |
|---------|----------|-------------|
| MDX Documentation | High | Integrate `/docs/*` with content collections |
| Interactive CLI Playground | Medium | Embed live CLI demo via WebAssembly |
| Advanced Search | Medium | Client-side full-text search with filters |
| Analytics Dashboard | Low | Privacy-first usage metrics (opt-in) |
| Multi-language Support | Low | Internationalization (i18n) support |
| Component Library | Low | Extract and publish reusable UI components |

## 16. Contributing (Web Package)

### Development Guidelines
1. **Branch naming**: `feat/web-<topic>` or `fix/web-<issue>`
2. **Dependencies**: Keep minimal; avoid heavy analytics prematurely
3. **Code style**: Follow existing patterns and TypeScript best practices
4. **Testing**: Ensure responsive design across breakpoints

### Adding New Content
1. Create route: `src/app/<section>/page.tsx`
2. Add marketing component: `components/marketing/<section>-component.tsx`
3. Update navigation in header component
4. Add entry to this README documentation

### UI Component Development
1. Use Radix primitives as base
2. Extend with Tailwind utilities
3. Ensure accessibility (ARIA labels, keyboard navigation)
4. Test in both light and dark themes

### Performance Considerations
- Optimize images and assets
- Use Next.js Image component for automatic optimization
- Implement lazy loading for heavy components
- Monitor Core Web Vitals

## 17. Troubleshooting

| Issue | Resolution |
|-------|------------|
| Path alias failing (`@/`) | Confirm root `tsconfig.json` has `paths` mapping; restart TS server |
| Tailwind class not applied | Ensure file under `src/` for content scan; check config `content` patterns |
| Build fails on Vercel | Confirm Node version >= 18 & lock file integrity |
| Icons not rendering | Verify `lucide-react` dependency and import style |
| Image placeholders undefined | Validate JSON file shape & import path correctness |
| Theme toggle not working | Check `next-themes` provider in layout.tsx |
| Animation performance issues | Review framer-motion usage and optimize heavy animations |
| SEO meta tags missing | Verify metadata export in page.tsx files |

## 18. Performance Metrics

### Build Optimization
- Bundle size: < 500KB (gzipped)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Monitoring
- Use Vercel Analytics for production monitoring
- Lighthouse CI for automated performance checks
- Bundle analyzer for dependency optimization

## 19. Deployment & CI/CD

### Automated Deployment
- **Trigger**: Git tag `vibe-web-v*`
- **Provider**: Vercel (recommended) or any static host
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Environment Variables
```bash
# Production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_VIBE_VERSION=0.1.1

# Development (optional)
OPENROUTER_API_KEY=your_api_key_here
```

## 20. License

MIT — see root [`LICENSE`](LICENSE:1).

---

**Development Philosophy**: Focus on clarity & performance with small bundle sizes, pre-rendered pages, and minimal JavaScript for static marketing. Add dynamic/interactive features only when they significantly improve onboarding or documentation experience.