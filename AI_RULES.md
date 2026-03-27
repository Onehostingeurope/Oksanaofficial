# AI Rules - Tunemusics App

## Tech Stack

- **React 18.3.1** with **TypeScript** - use functional components and hooks
- **Vite** - build tool and dev server
- **React Router v6** - client-side routing with nested admin routes
- **Tailwind CSS** - primary styling system
- **shadcn/ui** - reusable accessible UI primitives from `src/components/ui/`
- **Supabase** - database, auth, storage, and edge functions
- **TanStack React Query** - server state management and data fetching
- **Lucide React** - standard icon library
- **React Hook Form + Zod** - form state and validation
- **Sonner** - toast notifications
- **Vitest + Playwright** - unit and end-to-end testing

## Library Guidelines

### UI Components
- Always use existing **shadcn/ui** components from `src/components/ui/` before creating new ones.
- Do not modify shadcn/ui primitives directly unless the request specifically requires it.
- Create custom app components in `src/components/` or `src/components/admin/` as appropriate.
- Use `lucide-react` for all icons.
- Use `tailwind-merge` + `clsx` through `@/lib/utils` for conditional classes.

### Styling
- Use **Tailwind CSS** utility classes for layout, spacing, and visual styling.
- Prefer existing theme tokens and CSS variables from `tailwind.config.ts` and `src/index.css`.
- Use the configured fonts: `font-display` for headings and `font-body` for body text.
- Use built-in Tailwind animation utilities already defined in the theme such as `animate-fade-in`, `animate-slide-up`, and other `animate-*` classes.
- Use the existing gold color palette and theme variables for brand-consistent styling.

### Data & Backend
- Always use the singleton Supabase client from `@/integrations/supabase/client.ts`.
- Use **TanStack Query** for server data fetching and mutations instead of ad hoc `useEffect` fetching.
- Reference database types from `src/integrations/supabase/types.ts`.
- Use Supabase Edge Functions for server-side logic when needed.

### Routing
- Keep route definitions in `src/App.tsx`.
- Place page components in `src/pages/`.
- Keep admin routes nested under `/admin`.

### Internationalization
- Use `LanguageContext` from `src/contexts/LanguageContext.tsx` for user-facing content.
- Avoid hardcoding visible strings when they should be translated.
- Use the existing `LanguageSwitcher` pattern for language selection.

### Forms
- Use **React Hook Form** with **Zod** for validation.
- Use shadcn form building blocks such as `Form`, `FormField`, `FormItem`, and related components.

### Notifications
- Use **Sonner** for toast notifications.
- Import `toast` from `sonner` and use helpers like `toast.success()` and `toast.error()`.

### File Organization
- Pages: `src/pages/`
- Public components: `src/components/`
- Admin components: `src/components/admin/`
- Contexts: `src/contexts/`
- Hooks: `src/hooks/`
- Utilities: `src/lib/`
- Tests: `src/test/`

## General Rules

- Keep components small, focused, and easy to maintain.
- Prefer creating a new file for a new component or hook instead of growing unrelated files.
- Use TypeScript for all app code.
- Maintain responsive behavior with Tailwind breakpoints.
- Add or update tests in `src/test/` when behavior changes meaningfully.
