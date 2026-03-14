# Plan: Połączenie dashboardu z backendem (lista quizów)

**Feature Branch**: `003-dashboard-quiz-list`
**Created**: March 5, 2026
**Status**: Draft

## Kontekst

Strona `dashboard.vue` czyta quizy **wyłącznie z localStorage** zamiast z API.
Backend ma gotowy endpoint `GET /quiz` z paginacją (nestjs-typeorm-paginate) i relacjami (questions → options).

### Rozbieżności frontend ↔ backend

| Frontend (dashboard)                     | Backend (response)                    |
| ---------------------------------------- | ------------------------------------- |
| `quiz.name`                              | `quiz.title`                          |
| `Record<string, any>` z localStorage     | `PaginationResult<QuizDto>` z API     |
| `deleteQuiz` → `localStorage`            | brak endpointu DELETE                  |
| filtr po `quiz.author === currentUser`   | backend zwraca wszystkie quizy        |

---

## Kroki implementacji

### Krok 1 — Uzupełnić `QuizSearchDtoRequest` o parametry paginacji

**Plik:** `apps/frontend/apps/core/libs/api/quiz/types.ts`

Aktualnie pusty interfejs — dodać opcjonalne pola:

- `page?: number`
- `limit?: number`

---

### Krok 2 — Poprawić metodę `search` w API client

**Plik:** `apps/frontend/apps/core/libs/api/quiz/quiz.client.ts`

Obecnie `axiosInstance.get("/quiz", payload)` — powinno być `axiosInstance.get("/quiz", { params: payload })` żeby parametry trafiły jako query string.

---

### Krok 3 — Przerobić `dashboard.vue` na pobieranie z API

**Plik:** `apps/frontend/apps/base/pages/dashboard.vue`

- W `onMounted`: zamienić `localStorage.getItem("quizzes")` na `await $api.quiz.search({ page: 1, limit: 20 })`
- Pobrać `$api` z `useNuxtApp()`
- Zmienić typ `quizzes` z `Record<string, any>` na `Ref<QuizDto[]>`
- Dostosować `userQuizzes` computed — usunąć filtr po `author` (niepotrzebny, bo backend zwraca dane)
- Dodać stany `isLoading` i `errorMessage`

---

### Krok 4 — Dostosować template dashboardu

**Plik:** `apps/frontend/apps/base/pages/dashboard.vue`

- Zamienić `quiz.name` → `quiz.title` (bo `QuizDto` ma pole `title`, nie `name`)
- Dodać spinner/placeholder podczas ładowania (`isLoading`)
- Wyświetlić komunikat błędu (`errorMessage`) gdy API zwróci error

---

### Krok 5 — Tymczasowo wyłączyć usuwanie quizów

**Plik:** `apps/frontend/apps/base/pages/dashboard.vue`

- Backend nie ma endpointu `DELETE /quiz/:id`
- Ukryć przycisk „Usuń" lub oznaczyć jako `disabled` z tooltipem "Wkrótce dostępne"
- Oznaczyć TODO na przyszłe zadanie z endpointem DELETE

---

## Uwagi

- **Proxy server route nie jest potrzebne** — axios z `baseURL` + `withCredentials: true` + interceptor refresh wystarczy
- **Endpoint `GET /quiz` wymaga `AuthGuard`** — użytkownik musi być zalogowany
- **Paginacja** — backend używa `nestjs-typeorm-paginate`, odpowiedź ma format `{ items: QuizDto[], meta: PaginationMeta }`
- **Przycisk edycji** (`/create-quiz?edit=quizId`) — tymczasowo może pozostać, ale dopóki backend nie ma PUT/PATCH, edycja nie zadziała (zależność od spec `002-create-quiz-api`)

