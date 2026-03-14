# Plan: Połączenie formularza tworzenia quizu z backendem

**Feature Branch**: `002-create-quiz-api`
**Created**: March 5, 2026
**Status**: Draft

## Kontekst

Strona `create-quiz.vue` zapisuje quizy **wyłącznie do localStorage** — nie łączy się z backendem.
Backend ma gotowy endpoint `POST /quiz` z pełną walidacją i cascade save (Quiz → Questions → Options).

### Rozbieżności frontend ↔ backend

| Frontend (formularz)                     | Backend (DTO)                        |
| ---------------------------------------- | ------------------------------------ |
| `quizForm.name`                          | `title`                              |
| `options: string[]` + `correct: number`  | `options: { text, isCorrect }[]`     |
| zapis do `localStorage`                  | `POST /quiz`                         |

---

## Kroki implementacji

### Krok 1 — Dodać typy DTO request na frontendzie

**Plik:** `apps/frontend/apps/core/libs/api/quiz/types.ts`

Dodać interfejsy request odzwierciedlające backendowe `CreateQuizDto`:

- `CreateQuizOptionDtoRequest { text: string; isCorrect: boolean }`
- `CreateQuizQuestionDtoRequest { question: string; options: CreateQuizOptionDtoRequest[] }`
- `CreateQuizDtoRequest { title: string; description: string; questions: CreateQuizQuestionDtoRequest[] }`

---

### Krok 2 — Rozszerzyć Quiz API client o metodę `create`

**Plik:** `apps/frontend/apps/core/libs/api/quiz/quiz.client.ts`

- Dodać do interfejsu `QuizApi`: `create: (payload: CreateQuizDtoRequest) => Promise<QuizDto>`
- Implementacja: `axiosInstance.post<QuizDto>("/quiz", payload)`
- Zaimportować nowy typ `CreateQuizDtoRequest` z `./types.ts`

---

### Krok 3 — Dodać funkcję mapującą dane formularza na DTO

**Plik:** `apps/frontend/apps/base/pages/create-quiz.vue`

Stworzyć funkcję `mapFormToCreateQuizDto(form)` w sekcji `<script>`, która:

- Mapuje `form.name` → `title`
- Mapuje `form.questions[].options` (string[]) + `form.questions[].correct` (number) → `{ text: string, isCorrect: boolean }[]` — iterując po `options` i ustawiając `isCorrect: oIndex === q.correct`
- Zwraca obiekt zgodny z `CreateQuizDtoRequest`

---

### Krok 4 — Przerobić `saveQuiz()` na wywołanie API

**Plik:** `apps/frontend/apps/base/pages/create-quiz.vue`

- Pobrać `$api` z `useNuxtApp()`
- Po walidacji formularza wywołać `await $api.quiz.create(mapFormToCreateQuizDto(quizForm.value))`
- Usunąć cały blok `localStorage.setItem(...)` i generowanie `quizId` po stronie klienta
- Dodać stan ładowania (`isSubmitting` ref) i ustawić go na `true` podczas requestu, by zablokować przycisk „Zapisz"
- W `try/catch` obsłużyć błędy: wyciągnąć `error.response?.data?.message` i wyświetlić w `quizMessage`
- Po sukcesie: ustawić `quizMessage` na sukces i przekierować do `/dashboard`

---

### Krok 5 — Wyłączyć tymczasowo logikę edycji quizu

**Plik:** `apps/frontend/apps/base/pages/create-quiz.vue`

- Backend nie ma endpointu PUT/PATCH — logika `editingQuizId` (odczyt z localStorage przez query `?edit=quizId`) przestanie działać
- Tymczasowo usunąć/wyłączyć logikę edycji (`editingQuizId`, odczyt z `quizzes.value[editId]`)
- Oznaczyć TODO na przyszłe zadanie z endpointem UPDATE

---

## Uwagi

- **Proxy server route nie jest potrzebne** — axios ma `baseURL` backendu + `withCredentials: true` + interceptor refresh
- **Endpoint wymaga `AuthGuard` + `RolesGuard("admin")`** — formularz jest dostępny tylko dla zalogowanych adminów
- **Backend `ValidationPipe`** zwraca tablicę komunikatów przy błędach walidacji — obsłużyć w catch

