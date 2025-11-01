# 🎨 LitePanel

A modern, production-ready Next.js 15 admin dashboard template with **dynamic theme switching**, **real-time GitHub stats**, and **lightweight syntax highlighting**. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/xenral/litepanel)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **🚀 Production-Ready Admin Template** - Complete dashboard with working authentication, real-time stats, dynamic themes, and modern React patterns!

## ✨ Key Features

### 🎨 **Advanced Theme System**

- **3 Professional Themes** - Hot-swappable with instant CSS variable updates
- **Dark/Light Mode** - System preference detection with manual override
- **Custom Theme Engine** - Built-in theme store with Zustand state management
- **CSS Variable Architecture** - Seamless theme transitions with zero flicker

### 📊 **Real-Time GitHub Integration**

- **Live GitHub Stars** - Real API integration with automatic updates
- **Repository Clones** - Estimated monthly clone statistics
- **Contributors Count** - Dynamic contributor tracking
- **Smart Caching** - 5-minute cache with fallback values

### 💻 **Lightweight Syntax Highlighting**

- **Ultra-Lightweight** - ~2KB minified vs 50KB+ alternatives
- **TypeScript/JavaScript** - Optimized for code examples
- **Theme-Aware** - Adapts to current light/dark theme
- **Zero Dependencies** - Custom regex-based implementation

### 🔧 **Production Features**

- **Complete Authentication** - Login/Register with validation
- **Professional Forms** - React Hook Form + Zod validation
- **Responsive Design** - Mobile-first with collapsible sidebar
- **Error Boundaries** - Graceful error handling throughout
- **Loading States** - Professional skeletons and spinners
- **TypeScript Strict** - Zero compilation errors, full type safety

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm/yarn/pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/xenral/litepanel.git
cd litepanel

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook (optional)
npm run storybook
```

🌐 **Open [http://localhost:3000](http://localhost:3000)** to see your dashboard!

### 🎯 Demo Credentials

For testing the authentication system:

- **Email**: `demo@example.com`
- **Password**: `password123`

---

## 🏗️ What's Implemented

### ✅ **Landing Page**

- **Hero Section** - Animated background with dynamic stats
- **Feature Grid** - Interactive feature showcase
- **Code Examples** - Syntax-highlighted code snippets
- **GitHub Stats** - Real-time stars, clones, and contributors
- **Theme Preview** - Live theme switching demonstration
- **CTA Section** - Deployment options and community stats

### ✅ **Dashboard System**

- **Analytics Pages** - Performance, revenue, and traffic analytics
- **Component Showcase** - Cards, forms, modals, and tables
- **Data Management** - Orders, products, reports, and users
- **User Management** - List, permissions, and roles
- **Settings Panel** - User preferences and configurations

### ✅ **Authentication**

- **Login Page** - Complete validation and error handling
- **Register Page** - Password confirmation and terms acceptance
- **Route Protection** - Navigation guards and auth state
- **Form Validation** - Real-time feedback with Zod schemas

### ✅ **Component Library**

- **UI Components** - 30+ shadcn/ui components with stories
- **Form System** - Reusable form components with validation
- **Data Tables** - Advanced tables with sorting and filtering
- **Charts & Analytics** - Professional data visualizations
- **Navigation** - Responsive sidebar and breadcrumbs

---

## 🛠️ Technology Stack

### **Core Framework**

- **Next.js 15** - App Router, React 19, Server Components
- **TypeScript 5** - Strict mode with comprehensive types
- **Tailwind CSS 4** - Utility-first styling with custom themes

### **UI & Components**

- **shadcn/ui** - High-quality components built on Radix UI
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide Icons** - Beautiful, consistent iconography
- **Framer Motion** - Smooth animations and transitions

### **State Management**

- **Zustand** - Lightweight state management for themes
- **React Hook Form** - Performant form state management
- **Context API** - Theme and authentication contexts

### **Data & API**

- **GitHub API** - Real-time repository statistics
- **Custom API Layer** - Centralized data management
- **SWR Pattern** - Data fetching with caching

### **Development Tools**

- **Storybook** - Component development and documentation
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hooks for quality assurance

---

## 📁 Project Structure

```
litepanel/
├── 🎨 src/app/                         # Next.js App Router
│   ├── auth/                          # Authentication pages
│   │   ├── login/page.tsx             # ✅ Login with validation
│   │   └── register/page.tsx          # ✅ Registration form
│   ├── dashboard/                     # Dashboard pages
│   │   ├── analytics/                 # ✅ Analytics dashboard
│   │   ├── components/                # ✅ Component showcase
│   │   ├── data/                      # ✅ Data management
│   │   └── users/                     # ✅ User management
│   ├── docs/                          # ✅ Documentation
│   ├── storybook/                     # ✅ Storybook integration
│   └── page.tsx                       # ✅ Landing page
├── 🧩 src/components/                  # Component Library
│   ├── ui/                           # ✅ shadcn/ui components
│   │   ├── button.tsx                # ✅ Button variants
│   │   ├── card.tsx                  # ✅ Card components
│   │   ├── form.tsx                  # ✅ Form system
│   │   ├── syntax-highlighter.tsx    # ✅ Code highlighting
│   │   └── ...                       # ✅ 30+ components
│   ├── landing/                      # ✅ Landing page sections
│   │   ├── hero-section.tsx          # ✅ Hero with stats
│   │   ├── feature-grid.tsx          # ✅ Feature showcase
│   │   ├── code-snippet-showcase.tsx # ✅ Code examples
│   │   └── cta-section.tsx           # ✅ Call-to-action
│   ├── dashboard/                    # ✅ Dashboard components
│   │   ├── sidebar.tsx               # ✅ Navigation sidebar
│   │   ├── topbar.tsx                # ✅ Top navigation
│   │   └── ...                       # ✅ Dashboard widgets
│   └── analytics/                    # ✅ Analytics components
├── 🔧 src/lib/                        # Core Utilities
│   ├── api.ts                        # ✅ API service layer
│   ├── stats.api.ts                  # ✅ GitHub stats API
│   ├── themes.ts                     # ✅ Theme configurations
│   └── utils.ts                      # ✅ Helper functions
├── 🎨 src/context/                    # React Contexts
│   └── theme-context.tsx             # ✅ Theme management
├── 📦 src/stores/                     # State Management
│   ├── theme.store.ts                # ✅ Theme store (Zustand)
│   └── auth.store.ts                 # ✅ Auth store
├── 🎯 src/utils/                      # Utilities
│   └── syntax-highlight.util.ts      # ✅ Syntax highlighting
├── 📱 src/types/                      # TypeScript Definitions
├── 🧪 tests/                          # Testing (Playwright ready)
└── 📚 .storybook/                     # Storybook Configuration

Legend: ✅ Fully Implemented & Working
```

---

## 🎨 Theme System

### **3 Professional Themes**

1. **🌈 Playful Pastel** _(Default)_
   - Soft, rounded design with gentle gradients
   - Perfect for creative and modern applications

2. **⚡ Neutral Pro**
   - Clean, professional aesthetic
   - High contrast for business applications

3. **♿ High-Contrast A11y**
   - WCAG 2.2 AAA compliant
   - Optimized for accessibility

### **Theme Architecture**

```typescript
// Theme switching with Zustand store
import { useThemeStore } from '@/stores/theme.store';

const { currentTheme, setTheme, isDarkMode, toggleDarkMode } = useThemeStore();

// Switch themes instantly
setTheme('neutral-pro');
toggleDarkMode();
```

### **CSS Variable System**

```css
:root {
  --background: 320 20% 99%;
  --foreground: 330 15% 15%;
  --primary: 280 100% 70%;
  --radius: 0.75rem;
}
```

---

## 📊 Real-Time Stats Integration

### **GitHub API Features**

```typescript
// Real GitHub statistics
import { fetchAllStats } from '@/lib/stats.api';

const stats = await fetchAllStats();
// {
//   githubStars: 2547,      // Real GitHub stars
//   githubClones: 6500,     // Estimated clones
//   contributors: 24,       // Real contributors
//   performance: 98         // Lighthouse score
// }
```

### **Smart Caching**

- **5-minute cache** for GitHub API calls
- **Fallback values** for offline scenarios
- **Loading states** with skeleton animations
- **Error handling** with graceful degradation

---

## 💻 Lightweight Syntax Highlighting

### **Custom Implementation**

- **Bundle Size**: ~2KB vs 50KB+ alternatives
- **Performance**: <1ms highlighting for typical code blocks
- **Languages**: TypeScript, JavaScript, TSX, JSX
- **Themes**: Light/dark with automatic detection

### **Usage**

```tsx
import { SyntaxHighlighter } from '@/components/ui/syntax-highlighter';

<SyntaxHighlighter
  code={codeString}
  language="typescript"
  theme="dark"
  showLineNumbers
/>;
```

---

## 🔧 Development

### **Available Commands**

```bash
# Development
npm run dev              # Start dev server
npm run storybook        # Start Storybook

# Building
npm run build            # Production build
npm run start           # Start production server

# Quality Assurance
npm run lint            # ESLint checking
npm run type-check      # TypeScript validation
npm run format          # Prettier formatting

# Storybook
npm run build-storybook # Build static Storybook
```

### **Environment Setup**

Create `.env.local`:

```env
# Optional: GitHub API (for real clone data)
GITHUB_TOKEN=your_github_token

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## 🚢 Deployment

### **One-Click Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xenral/litepanel)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/xenral/litepanel)

### **Manual Deployment**

```bash
# Production build
npm run build

# Start production server
npm start

# Or with PM2
pm2 start npm --name "litepanel" -- start
```

### **Docker Deployment**

```bash
# Build the Docker image
docker build -t nivafy-admin .

# Run the container (adjust port and env file as needed)
docker run --env-file .env.production.local -p 3000:3000 nivafy-admin
```

- The image uses a multi-stage build and Next.js standalone output for a slim runtime.
- Provide any production environment variables via `--env-file` or `-e` flags before running.

### **Docker Compose**

```bash
# Build (if needed) and start the stack
docker compose up -d --build

# View logs
docker compose logs -f

# Stop the containers
docker compose down
```

- Override `.env.production.local` or supply an alternate `env_file` in `docker-compose.yml` to suit your environment.

---

## 📈 Performance

### **Optimizations**

- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Automatic font loading
- **Bundle Analysis** - Optimized for production

### **Metrics**

- **Lighthouse Score**: 95+ for Performance, Accessibility, SEO
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Bundle Size**: Optimized with tree-shaking

---

## 🧪 Testing

### **Quality Assurance**

- **TypeScript Strict** - Zero `any` types, full type safety
- **ESLint Rules** - Comprehensive linting configuration
- **Prettier** - Consistent code formatting
- **Husky Hooks** - Pre-commit quality checks

### **Component Testing**

```bash
# Start Storybook for component testing
npm run storybook

# Visit http://localhost:6006
```

---

## 🤝 Contributing

### **Development Setup**

1. **Fork & Clone**

   ```bash
   git clone https://github.com/xenral/litepanel.git
   cd litepanel
   npm install
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Development Workflow**
   ```bash
   npm run dev        # Start development
   npm run lint       # Check code quality
   npm run type-check # Validate TypeScript
   ```

### **Code Standards**

- **TypeScript** - Strict mode, comprehensive types
- **Components** - Documented with Storybook stories
- **Accessibility** - WCAG 2.1 compliance
- **Performance** - Optimized for production

---

## 🐛 Troubleshooting

### **Common Issues**

**Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**TypeScript Errors**

```bash
# Check types
npm run type-check

# Update dependencies
npm update
```

**Theme Issues**

```bash
# Reset theme store
localStorage.clear()
# Refresh browser
```

---

## 📄 License

**MIT License** - Use freely for personal and commercial projects.

See [LICENSE](./LICENSE) for full details.

---

## 🙏 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** - Exceptional component library
- **[Next.js Team](https://nextjs.org/)** - Outstanding React framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management

---

## 🔗 Links

- 🌐 **[Live Demo](https://litepanel.vercel.app)** - See it in action
- 📚 **[Storybook](https://litepanel.vercel.app/storybook)** - Component library
- 🐙 **[GitHub](https://github.com/xenral/litepanel)** - Source code
- 🐛 **[Issues](https://github.com/xenral/litepanel/issues)** - Bug reports & features
- 💬 **[Discussions](https://github.com/xenral/litepanel/discussions)** - Community

---

<div align="center">

### 🚀 Ready to build something amazing?

**[⭐ Star on GitHub](https://github.com/xenral/litepanel)** • **[🚀 Deploy Now](https://vercel.com/new/clone?repository-url=https://github.com/xenral/litepanel)** • **[💬 Join Community](https://discord.gg/litepanel)**

**Built with ❤️ for the developer community**

</div>
