# Random Quiz Generator — Project Constitution

## Core Principles

### I. Architectural Boundaries (NON-NEGOTIABLE)

**Backend MUST follow Clean Architecture:**
- Domain entities and use-cases MUST be framework-agnostic
- Dependencies flow inward: Adapters → Use Cases → Entities
- Infrastructure (Prisma, external APIs) MUST be in infrastructure layer
- Controllers MUST NOT contain business logic
- All business rules MUST reside in use-cases or domain entities

**Frontend MUST follow Feature-Sliced Design:**
- Each module MUST organize code by layers: `pages/`, `features/`, `widgets/`, `entities/`, `shared/`
- Features MUST NOT import from other features (only from entities/shared)
- Pages MUST compose features and widgets, not contain logic
- Shared layer MUST be dependency-free and reusable across features

**Monorepo Package Isolation:**
- `shared-types` and `shared-utils` MUST be framework-agnostic
- Backend and frontend MUST NOT cross-import from each other's source code
- All inter-package communication via compiled outputs only

### II. Type Safety & Validation (NON-NEGOTIABLE)

**Zod as Single Source of Truth:**
- All DTOs, API contracts, and user inputs MUST be validated with Zod
- Zod schemas MUST be defined in `packages/shared-types` for cross-package use
- TypeScript types MUST be inferred from Zod schemas (never manually duplicated)
- Runtime validation MUST occur at system boundaries: API endpoints, form submissions, external data sources

**TypeScript Strictness:**
- `strict: true` MUST be enabled in all tsconfig files
- `any` type is FORBIDDEN except when interfacing with untyped third-party libraries (requires inline comment justification)
- All functions MUST have explicit return types
- Implicit type coercion is FORBIDDEN

### III. Test Coverage Standards (NON-NEGOTIABLE)

**Mandatory Test Requirements:**
- **Unit Tests (Vitest):**
  - All use-cases MUST have ≥90% coverage
  - All domain entities with business logic MUST have ≥90% coverage
  - All Zod validators MUST have test cases for valid/invalid inputs
  - All utility functions in `shared-utils` MUST have ≥95% coverage

- **Integration Tests (Vitest + NestJS Testing Module):**
  - All API endpoints MUST have integration tests
  - Database repositories MUST have integration tests with test database
  - Auth0 integration MUST be tested with mocked JWT tokens

- **E2E Tests (Playwright):**
  - Critical user flows MUST be covered: Login → Quiz List → Play Quiz → Submit → View Results
  - Admin flows MUST be covered: CRUD operations on quizzes
  - E2E tests MUST use Mock Service Worker (msw) for API mocking

**Test-First Development:**
- For new features: Write failing tests → Get approval → Implement → Green tests
- Tests MUST be committed in the same PR as implementation
- No PR merges without passing CI test suite

**Performance Test Requirements:**
- Quiz submission endpoint MUST respond within 200ms (95th percentile)
- Quiz list endpoint MUST load 50 quizzes within 100ms
- Performance regression tests MUST be added for critical paths

### IV. Code Quality Standards

**Linting & Formatting (NON-NEGOTIABLE):**
- ESLint + Prettier MUST pass before commit (enforced by Husky + lint-staged)
- TypeScript compiler MUST produce zero errors
- Custom ESLint rules for architecture:
  - Backend: Enforce use-case naming convention `*UseCase.ts`
  - Frontend: Enforce feature-sliced import rules (no cross-feature imports)

**Code Readability:**
- Functions MUST be ≤30 lines (exceptions require inline comment justification)
- Cyclomatic complexity MUST be ≤10 per function
- Magic numbers/strings MUST be extracted as named constants
- All exported functions/classes MUST have JSDoc comments with `@param`, `@returns`, `@throws`

**Naming Conventions:**
- Backend use-cases: `VerbNounUseCase` (e.g., `SubmitQuizUseCase`)
- Backend entities: PascalCase with `Entity` suffix (e.g., `QuizEntity`)
- Frontend composables: `use` prefix (e.g., `useQuizStore`, `useTimer`)
- Constants: SCREAMING_SNAKE_CASE
- Private methods: `_prefixedCamelCase`

### V. User Experience Consistency

**Design System Adherence:**
- All UI components MUST use Vuetify components (no custom CSS for base components)
- Sass variables MUST be defined in `shared/styles/_variables.scss` and reused
- Color palette MUST follow Material Design 3 guidelines
- Spacing MUST use 4px grid system (multiples of 4: 4, 8, 12, 16, 24, 32, 48, 64)

**Accessibility (WCAG 2.1 AA Compliance):**
- All interactive elements MUST be keyboard accessible (Tab navigation)
- All images MUST have `alt` attributes
- Color contrast MUST meet WCAG AA standards (4.5:1 for text)
- Form validation errors MUST be announced to screen readers (`aria-live="polite"`)
- All quiz questions MUST have semantic HTML (`<fieldset>`, `<legend>`, proper labels)

**Internationalization (i18n):**
- All user-facing strings MUST be externalized to i18n JSON files
- Hard-coded strings in components are FORBIDDEN
- Date/time formatting MUST use i18n library
- RTL languages MUST be supported in CSS (use logical properties: `margin-inline-start` instead of `margin-left`)

**Loading States & Error Handling:**
- All async operations MUST show loading indicators
- Network errors MUST display user-friendly messages (not raw stack traces)
- Toast notifications MUST auto-dismiss after 5 seconds (error) or 3 seconds (success)
- Optimistic UI updates MUST revert on failure

### VI. Performance Requirements

**Bundle Size:**
- Frontend initial bundle MUST be ≤250KB gzipped
- Code-splitting MUST be used for admin routes (lazy-loaded)
- Images MUST be optimized (WebP format, responsive sizes)
- Unused dependencies MUST be removed (checked via `depcheck` in CI)

**Runtime Performance:**
- Lighthouse Performance score MUST be ≥90 on production builds
- First Contentful Paint (FCP) MUST be ≤1.5s
- Time to Interactive (TTI) MUST be ≤3.0s
- Quiz question transitions MUST be ≤100ms (60fps animations)

**Backend Performance:**
- Database queries MUST use indexes on foreign keys and frequently filtered columns
- N+1 query problem MUST be avoided (use eager loading)
- API responses MUST include `Cache-Control` headers where appropriate
- Rate limiting MUST be enforced: 100 req/min per IP for public endpoints

**Monitoring:**
- Sentry MUST be configured for error tracking (backend + frontend)
- Critical errors (DB connection loss, Auth0 failures) MUST trigger alerts
- Performance metrics MUST be logged: response times, query counts, bundle sizes

## Security Standards

**Authentication & Authorization:**
- All protected routes MUST validate Auth0 JWT tokens
- JWT validation MUST check signature, expiration, and issuer
- Role-based access control (RBAC) MUST be enforced via guards
- Admin role MUST be stored in Auth0 user metadata, not client-controlled

**Data Protection:**
- Quiz answers MUST NOT expose `isCorrect` field in public API responses (only after submission)
- User passwords MUST NOT be stored (Auth0 only)
- Database credentials MUST be in environment variables, never committed
- CORS MUST be configured to allow only trusted origins

**Input Validation & Sanitization:**
- All user inputs MUST be validated with Zod before processing
- SQL injection protection via Prisma parameterized queries (raw SQL FORBIDDEN)
- XSS protection via Vue's automatic escaping (avoid `v-html`)
- CSRF protection MUST be enabled for state-changing endpoints

**Secrets Management:**
- `.env` files MUST be in `.gitignore`
- Example `.env.example` MUST be provided without real values
- Production secrets MUST be stored in secure vault (not repo)

## Development Workflow

**Branching Strategy:**
- Main branch: `master` (protected, requires PR reviews)
- Feature branches: `feature/short-description`
- Hotfix branches: `hotfix/issue-description`
- All commits MUST follow Conventional Commits (enforced by Commitizen)

**Pull Request Requirements:**
- All PRs MUST pass CI: lint, typecheck, tests, build
- All PRs MUST have ≥1 reviewer approval
- All PRs MUST reference issue/ticket number
- Breaking changes MUST be documented in PR description

**Commit Message Format (Conventional Commits):**
```
<type>(<scope>): <subject>

<body>

<footer>
```
**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scopes:** `backend`, `frontend`, `shared`, `ci`, `docs`

**Code Review Checklist:**
- [ ] Architectural boundaries respected
- [ ] Tests added/updated and passing
- [ ] TypeScript strict mode compliance
- [ ] Zod validation at boundaries
- [ ] Performance impact assessed
- [ ] Security implications reviewed
- [ ] Accessibility verified
- [ ] Documentation updated

## Quality Gates

**Pre-Commit (Husky + lint-staged):**
- ESLint + Prettier on staged files
- TypeScript type checking
- Unit tests for changed files

**Pre-Push:**
- Full test suite (unit + integration)
- Build verification

**CI Pipeline:**
- Lint, typecheck, test, build (all packages)
- E2E tests with Playwright
- Bundle size analysis (fail if >10% increase)
- Dependency vulnerability scan

**Pre-Release:**
- All tests passing (unit, integration, E2E)
- Lighthouse performance audit
- Security scan (OWASP dependency check)
- Staging environment smoke tests

## Governance

**Constitution Authority:**
- This constitution supersedes all other coding guidelines
- Violations of NON-NEGOTIABLE principles MUST block PR merges
- Amendments require team consensus and documentation in this file

**Exception Process:**
- Exceptions to principles MUST be justified in code comments and PR description
- Technical debt incurred MUST be tracked in issues with `tech-debt` label
- Tech debt MUST be addressed within 2 sprints or escalated

**Continuous Improvement:**
- Constitution MUST be reviewed quarterly
- New patterns discovered SHOULD be added to this document
- Outdated rules MUST be removed or updated

**Version**: 1.0.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-02-25
