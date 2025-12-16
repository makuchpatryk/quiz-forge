# Plan budowy aplikacji quizowej (Monorepo Turborepo + Nuxt 3 + NestJS + Prisma) — rozszerzona wersja z przykładami architektur, Swagger i ulepszeniami

**Założenia użytkownika:**

- Monorepo: **Turborepo** (apps/frontend, apps/backend, packages/shared-types, packages/shared-utils)
- Frontend: **Nuxt 3** podzielony na **moduły**, wewnątrz każdego modułu **feature-sliced architecture**
- UI: **Vuetify + Sass** (klasyczne podejście do styli)
- Backend: **NestJS** z **Prisma** i **PostgreSQL**, w architekturze **Clean Architecture**
- Autoryzacja: **Auth0** (social login), brak lokalnego tworzenia użytkowników
- Przechowywanie użytkowników w bazie dla gier (userId z tokena Auth0)
- Testy: **Vitest** (unit), **Playwright + Mock Service Worker (msw)** (E2E)
- Walidacja: **Zod** (backend i frontend), VeeValidate usunięty
- Dev tooling: **Husky** + **lint-staged**, **Commitizen**, **Sentry**, **Swagger** do dokumentacji API

---

# 1. Priorytetowe cele projektu

- MVP: rozwiązywanie quizów, zapis wyników, admin CRUD quizów, logowanie przez Auth0
- Backend mapuje `auth0Sub` na lokalnych użytkowników
- Nowy element: **QuizSession** do śledzenia aktywnej sesji gracza i czasu gry
- Dokumentacja API: **Swagger**

---

# 2. Architektura systemu

**Monorepo Turborepo:**
```
/monorepo
├─ apps/
│  ├─ frontend/       # Nuxt 3 modular
│  └─ backend/        # NestJS + Prisma + Swagger
├─ packages/
│  ├─ shared-types/   # TypeScript interfaces, DTOs
│  └─ shared-utils/   # helpers, validators, Zod schemas
├─ package.json
└─ turbo.json
```

---

# 3. Model danych (Prisma)

**Prisma schema (przykład, ulepszona z QuizSession):**
```prisma
model User {
  id           String   @id @default(cuid())
  auth0Sub     String   @unique
  username     String?
  role         String   @default("user")
  results      Result[]
  sessions     QuizSession[]
  createdAt    DateTime @default(now())
}

model Quiz {
  id          String    @id @default(cuid())
  title       String
  description String?
  config      Json
  questions   Question[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Question {
  id       String  @id @default(cuid())
  quiz     Quiz    @relation(fields: [quizId], references: [id])
  quizId   String
  text     String
  type     String
  position Int?
  answers  Answer[]
}

model Answer {
  id         String   @id @default(cuid())
  question   Question @relation(fields: [questionId], references: [id])
  questionId String
  text       String
  isCorrect  Boolean
}

model Result {
  id          String       @id @default(cuid())
  user        User         @relation(fields: [userId], references: [id])
  userId      String
  quiz        Quiz         @relation(fields: [quizId], references: [id])
  quizId      String
  score       Int
  total       Int
  details     Json
  completedAt DateTime     @default(now())
}

model QuizSession {
  id          String   @id @default(cuid())
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  quizId      String
  startedAt   DateTime @default(now())
  endedAt     DateTime?
  isActive    Boolean  @default(true)
}
```

---

# 4. Backend — Clean Architecture (przykład folderów i plików)
```
src/
├─ core/                # Domain entities, value objects
│  ├─ entities/
│  │   └─ QuizEntity.ts
│  └─ value-objects/
├─ use-cases/           # Interactors / Application layer
│  ├─ SubmitQuizUseCase.ts
│  └─ StartQuizSessionUseCase.ts
├─ adapters/            # Controllers, DTOs, mappers
│  └─ QuizController.ts
├─ infrastructure/      # Prisma repository implementations, external clients (Auth0)
│  └─ PrismaQuizRepository.ts
├─ shared/              # utils, guards, decorators, error handling, Zod schemas
└─ main.ts              # Swagger setup + Sentry initialization
```

---

# 5. Frontend — Nuxt 3 modular + feature-sliced (przykład)
```
apps/frontend/modules/quiz/
├─ pages/
│  └─ index.vue        # QuizList
├─ features/
│  └─ playQuiz/
│     ├─ components/   # QuestionCard, AnswerOption
│     └─ composables/  # useQuizStore, useTimer, useQuizSession
├─ widgets/
│  └─ QuizSummary.vue
├─ entities/
│  └─ Quiz.ts
└─ shared/
   └─ validators/      # Zod schemas
```

---

# 6. API endpointy

- Public: GET /api/quizzes, GET /api/quizzes/:id
- Protected (user): POST /api/quizzes/:id/submit, GET /api/users/me/results, POST /api/quizzes/:id/start-session
- Protected (admin): CRUD quizów, pytania, odpowiedzi
- Versioning: /api/v1/
- Dokumentacja: Swagger (NestJS @nestjs/swagger)
- Walidacja: Zod w DTO

---

# 7. DevOps / monorepo

- Turborepo: build caching, linting, test pipeline
- Docker-compose dla dev: Postgres + backend + frontend + opcjonalnie Auth0 dev env
- CI/CD: lint, build, test (Vitest + Playwright/msw)
- Husky + lint-staged + Commitizen do standardowych commitów
- Sentry do monitorowania błędów w backendzie i frontendzie
- Production: backend kontener, frontend Nuxt SSR lub static, PostgreSQL managed

---

# 8. Testy i bezpieczeństwo

- Backend: Vitest + Zod
- Frontend: Vitest + Playwright + Mock Service Worker
- HTTPS, CORS, rate-limiting, token validation, nieujawnianie isCorrect

---

# 9. Harmonogram

1. Dzień 0–2: Turborepo scaffold + apps + packages + docker-compose + husky + commitizen setup
2. Dzień 3–8: Backend Prisma schema + migracje + UseCases + controllers + Auth0 JWT guard + Sentry + Swagger setup
3. Dzień 9–12: Frontend Nuxt modular setup + feature-sliced modules + Vuetify + Sass + Auth0 login
4. Dzień 13–16: Admin CRUD, frontend pages (QuizList, QuizPlay, Admin)
5. Dzień 17–20: Testy (Vitest + Playwright/msw), CI/CD, deployment staging

---

# 10. Możliwości generowania artefaktów

- Turborepo scaffold z apps/frontend + apps/backend + packages/shared-types + packages/shared-utils
- Backend scaffold (NestJS + Prisma Clean Architecture + UseCases + controllers + Auth0 guard + Sentry + Swagger)
- Frontend scaffold (Nuxt modular + feature-sliced + Vuetify + Sass + Auth0 plugin)
- Docker-compose dla Postgres + backend + frontend + opcjonalnie Auth0 dev env
- Husky + lint-staged + Commitizen gotowe do pracy

*Koniec dokumentu.*
