# Plan: Podłączenie strony gry (playing) do API backendu

**Feature Branch**: `004-playing-quiz-api`
**Created**: March 5, 2026
**Status**: Done

## Kontekst

Strona `playing.vue` czyta quizy **z localStorage** i ma hardkodowany fallback (2 pytania po polsku).
Backend ma gotowy endpoint `GET /quiz/:id` zwracający quiz z relacjami `questions → options`.
Struktura danych z API (`QuizDto`) jest **niezgodna** z formatem używanym przez logikę gry.

### Rozbieżności frontend ↔ backend

| Frontend (`playing.vue`)                           | Backend (`GET /quiz/:id`)                                     |
| -------------------------------------------------- | ------------------------------------------------------------- |
| `question.question` (string)                       | `question.text` (string)                                      |
| `question.options` → `string[]`                    | `question.options` → `OptionDto[]` `{ id, text, isCorrect }`  |
| `question.correct` → `number` (index)              | poprawna opcja oznaczona `option.isCorrect: true`             |
| dane z `localStorage`                              | dane z API `GET /quiz/:id`                                    |
| `{{ option }}` (string bezpośrednio)               | `{{ option.text }}` (obiekt)                                  |

---

## Zadania

### Zadanie 1 — Dodać metodę `getById` do interfejsu i klienta API

**Plik:** `apps/frontend/apps/core/libs/api/quiz/quiz.client.ts`

- Rozszerzyć interfejs `QuizApi` o: `getById: (id: number) => Promise<QuizDto>`
- Dodać implementację: `axiosInstance.get<QuizDto>(`/quiz/${id}`)`

> Zmiana dotyczy jednego pliku, nie wymaga żadnych zależności.

---

### Zadanie 2 — Dodać tłumaczenia dla stanów ładowania gry

**Plik:** `apps/frontend/apps/core/i18n/locales/pl.json`

Dodać klucze:
- `"loadingQuiz"`: `"Ładowanie quizu..."`
- `"quizNotFound"`: `"Quiz nie został znaleziony"`
- `"loadQuizError"`: `"⚠️ Nie udało się załadować quizu. Spróbuj ponownie później."`

> Zmiana dotyczy jednego pliku, niezależna od reszty.

---

### Zadanie 3 — Zamienić źródło danych w `onMounted` z localStorage na API

**Plik:** `apps/frontend/apps/base/pages/playing.vue`

**Zależy od:** Zadanie 1, Zadanie 2

Zmiany w `<script>`:
- Pobrać `$api` z `useNuxtApp()`
- Dodać stany: `isLoading: ref(false)`, `errorMessage: ref<string | null>(null)`
- W `onMounted`:
  - Odczytać `quizId` z query param
  - Gdy brak `quizId` → `router.push('/quiz-selection')` (redirect)
  - Wywołać `await $api.quiz.getById(Number(quizId))`
  - Przypisać `questions.value = result.questions`
  - Obsłużyć `catch` → ustawić `errorMessage`
  - Obsłużyć `finally` → `isLoading = false`
- Usunąć `localStorage.getItem("quizzes")`
- Usunąć hardkodowany fallback (2 pytania)
- Zmienić typ `questions` z `ref<any[]>` na `ref<QuestionDto[]>`

---

### Zadanie 4 — Dostosować template do stanów ładowania i błędu

**Plik:** `apps/frontend/apps/base/pages/playing.vue`

**Zależy od:** Zadanie 3

Dodać w `<template>` przed sekcją gry:
- `v-if="isLoading"` → spinner z tekstem `$t("loadingQuiz")`
- `v-else-if="errorMessage"` → komunikat błędu z ikoną ⚠️
- Obecna sekcja gry (`v-if="!showScore"`) → zmienić na `v-else-if="!showScore"`

---

### Zadanie 5 — Dostosować wyświetlanie pytania z `question.question` na `question.text`

**Plik:** `apps/frontend/apps/base/pages/playing.vue`

**Zależy od:** Zadanie 3

W `<template>`:
- `{{ currentQuestion.question }}` → `{{ currentQuestion.text }}`

W `<script>` (computed `currentQuestion`):
- Zmienić fallback z `{ question: "", options: [] }` na `{ text: "", options: [] }`

---

### Zadanie 6 — Dostosować wyświetlanie opcji z `string` na `OptionDto`

**Plik:** `apps/frontend/apps/base/pages/playing.vue`

**Zależy od:** Zadanie 3

W `<template>`:
- `{{ option }}` → `{{ option.text }}`

> Pętla `v-for="(option, index) in currentQuestion.options"` — bez zmian, ale teraz `option` to `OptionDto`, nie `string`.

---

### Zadanie 7 — Przerobić logikę sprawdzania poprawnej odpowiedzi

**Plik:** `apps/frontend/apps/base/pages/playing.vue`

**Zależy od:** Zadanie 3, Zadanie 6

Aktualnie gra porównuje `index === currentQuestion.correct` (index poprawnej odpowiedzi).
Backend nie ma pola `correct` — zamiast tego opcja ma `isCorrect: boolean`.

Zmiany:

**`selectOption(index)`:**
- `index === currentQuestion.value.correct` → `currentQuestion.value.options[index]?.isCorrect === true`

**`getOptionClass(index)`:**
- Dodać helper: `const correctIndex = computed(() => currentQuestion.value.options.findIndex(o => o.isCorrect))`
- `index === currentQuestion.value.correct` → `index === correctIndex.value` (do podświetlenia poprawnej opcji na zielono)
- Alternatywnie: `currentQuestion.value.options[index]?.isCorrect` bezpośrednio

---

## Kolejność realizacji

```
Zadanie 1 (API client)  ──┐
Zadanie 2 (tłumaczenia) ──┼──→ Zadanie 3 (onMounted + API) ──→ Zadanie 4 (template: loading/error)
                           │                                 ──→ Zadanie 5 (question.text)
                           │                                 ──→ Zadanie 6 (option.text) ──→ Zadanie 7 (isCorrect)
```

Zadania 1 i 2 mogą być realizowane równolegle.
Zadania 4, 5, 6 mogą być realizowane równolegle (po Zadaniu 3).
Zadanie 7 wymaga Zadania 6.

---

## Uwagi

- **Endpoint `GET /quiz/:id` wymaga `AuthGuard`** — użytkownik musi być zalogowany
- **`quiz-selection.vue` i `dashboard.vue`** już przekazują numeryczny `quizId` w query — kompatybilne z `getById(Number(quizId))`
- **`isCorrect` jest widoczne w API response** — gracz może podejrzeć poprawną odpowiedź w DevTools; w przyszłości backend powinien mieć osobny endpoint "play" ukrywający `isCorrect`
- **Restart quizu** (`restartQuiz`) — nie wymaga ponownego fetch, dane zostają w pamięci
- **Fallback (2 hardkodowane pytania)** — do usunięcia całkowicie, zamiast tego error state

