# Constitution Quick Reference Guide
**For Daily Development Work**

This is a condensed, action-oriented version of the constitution for quick reference during development.

---

## 🚦 Before You Code

### ✅ Pre-Implementation Checklist
- [ ] Read the relevant constitutional principles for your work area
- [ ] Check if Zod schemas exist for DTOs you'll use
- [ ] Verify architectural layer boundaries for your changes
- [ ] Plan where tests will go (unit, integration, E2E)

---

## 🏗️ Architecture Quick Rules

### Backend (Clean Architecture)
```
✅ CORRECT:
Controller → UseCase → Entity
Controller → Repository (via interface)

❌ WRONG:
Controller → Repository (direct implementation)
UseCase → External API (direct)
```

**File Naming**:
- Use cases: `VerbNounUseCase.ts` (e.g., `SubmitQuizUseCase.ts`)
- Entities: `NounEntity.ts` (e.g., `QuizEntity.ts`)
- Controllers: `noun.controller.ts` (e.g., `quiz.controller.ts`)

### Frontend (Feature-Sliced Design)
```
✅ CORRECT:
pages/ → features/ → entities/
features/ → shared/
widgets/ → features/

❌ WRONG:
features/quiz → features/user (cross-feature import)
features/ → pages/
```

**File Naming**:
- Composables: `use*.ts` (e.g., `useQuizStore.ts`, `useTimer.ts`)
- Components: PascalCase (e.g., `QuizCard.vue`, `AnswerOption.vue`)

---

## 📝 Type Safety Checklist

### Every API Endpoint MUST Have:
```typescript
// 1. Zod schema in packages/shared-types
export const createQuizSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  timeLimit: z.number().int().positive()
});

// 2. Type inferred from schema (NOT manually typed)
export type CreateQuizDto = z.infer<typeof createQuizSchema>;

// 3. Validation in controller/route
@Post()
async create(@Body(new ZodValidationPipe(createQuizSchema)) dto: CreateQuizDto) {
  // ...
}
```

### TypeScript Strict Mode Rules:
```typescript
// ✅ CORRECT:
function calculateScore(answers: Answer[]): number {
  return answers.filter(a => a.isCorrect).length;
}

// ❌ WRONG:
function calculateScore(answers) { // Missing type
  return answers.filter(a => a.isCorrect).length; // No return type
}

// ⚠️ ALLOWED WITH JUSTIFICATION:
function parseExternalData(data: any): Quiz { // any requires comment
  // JUSTIFICATION: Third-party API returns untyped response
  // TODO: Create Zod schema for validation
  return data as Quiz;
}
```

---

## 🧪 Test Requirements Quick Reference

### Unit Tests (Vitest)
**What to test**: Use cases, entities, utilities  
**Coverage**: ≥90%

```typescript
// Example: SubmitQuizUseCase.spec.ts
describe('SubmitQuizUseCase', () => {
  it('should calculate correct score', () => {
    // Arrange
    const useCase = new SubmitQuizUseCase(mockRepo);
    const answers = [{ questionId: '1', answerId: 'a1', isCorrect: true }];
    
    // Act
    const result = useCase.execute({ quizId: 'q1', answers });
    
    // Assert
    expect(result.score).toBe(1);
  });
  
  it('should throw error for invalid quiz', async () => {
    // Test error cases
    await expect(useCase.execute({ quizId: 'invalid' }))
      .rejects.toThrow('Quiz not found');
  });
});
```

### Integration Tests (Vitest + NestJS)
**What to test**: API endpoints with real DB  
**Coverage**: 100% of endpoints

```typescript
// Example: quiz.e2e-spec.ts
describe('QuizController (e2e)', () => {
  it('POST /quizzes should create quiz', async () => {
    const response = await request(app.getHttpServer())
      .post('/quizzes')
      .send({ title: 'Test Quiz', timeLimit: 300 })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
  });
});
```

### E2E Tests (Playwright + MSW)
**What to test**: Critical user flows  
**Coverage**: 100% of critical paths

```typescript
// Example: quiz-flow.spec.ts
test('user can complete quiz', async ({ page }) => {
  // Setup MSW to mock API
  await page.goto('/quiz/123');
  await page.click('text=Start Quiz');
  await page.click('[data-testid="answer-a"]');
  await page.click('text=Submit');
  await expect(page.locator('text=Your score: 10/10')).toBeVisible();
});
```

---

## 🎨 UI/UX Quick Rules

### Component Structure
```vue
<template>
  <!-- ✅ Use Vuetify components -->
  <v-btn color="primary" @click="handleSubmit">
    {{ $t('quiz.submit') }} <!-- ✅ i18n, not hard-coded -->
  </v-btn>
  
  <!-- ❌ Don't create custom base components -->
  <button class="custom-btn">Submit</button>
</template>

<script setup lang="ts">
// ✅ Explicit return type
const handleSubmit = (): void => {
  // ...
};
</script>

<style lang="scss" scoped>
// ✅ Use variables from _variables.scss
.container {
  padding: $spacing-4; // 16px from 4px grid
  color: $color-primary;
}

// ❌ Don't hard-code values
.container {
  padding: 17px; // Wrong: not on 4px grid
  color: #3f51b5; // Wrong: should use variable
}
</style>
```

### Accessibility Checklist
- [ ] All interactive elements keyboard accessible (Tab + Enter/Space)
- [ ] All images have `alt` attributes
- [ ] Form inputs have associated `<label>` or `aria-label`
- [ ] Error messages have `aria-live="polite"`
- [ ] Color contrast ≥4.5:1 (use contrast checker)

### Loading States
```vue
<template>
  <!-- ✅ Always show loading state -->
  <div v-if="isLoading">
    <v-progress-circular indeterminate />
    <span class="sr-only">{{ $t('common.loading') }}</span>
  </div>
  
  <!-- ✅ Show user-friendly errors -->
  <v-alert v-else-if="error" type="error">
    {{ $t('errors.loadFailed') }}
  </v-alert>
  
  <div v-else>
    <!-- Content -->
  </div>
</template>
```

---

## 🚀 Performance Checklist

### Bundle Size
- [ ] Lazy-load admin routes: `defineAsyncComponent(() => import('./AdminPanel.vue'))`
- [ ] Optimize images: WebP format, responsive sizes
- [ ] Check bundle before PR: `pnpm run build && du -sh dist/`

### Backend Performance
```typescript
// ✅ CORRECT: Eager loading to avoid N+1
const quizzes = await this.quizRepo.find({
  relations: ['questions', 'questions.answers']
});

// ❌ WRONG: N+1 query problem
const quizzes = await this.quizRepo.find();
for (const quiz of quizzes) {
  quiz.questions = await this.questionRepo.find({ quizId: quiz.id });
}
```

### Monitoring
- [ ] Wrap critical operations in Sentry transactions
- [ ] Log slow queries (>100ms)
- [ ] Add performance marks for key user actions

---

## 🔒 Security Checklist

### Authentication
```typescript
// ✅ CORRECT: Protected route with guard
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/users')
async getUsers() { }

// ❌ WRONG: No auth check
@Get('admin/users')
async getUsers() { }
```

### Input Validation
```typescript
// ✅ CORRECT: Zod validation at boundary
@Post()
async create(@Body(new ZodValidationPipe(schema)) dto: CreateQuizDto) {
  return this.quizService.create(dto);
}

// ❌ WRONG: No validation
@Post()
async create(@Body() dto: any) {
  return this.quizService.create(dto);
}
```

### Secrets
```typescript
// ✅ CORRECT: Use environment variables
const jwtSecret = process.env.JWT_SECRET;

// ❌ WRONG: Hard-coded secret
const jwtSecret = 'my-secret-key';
```

---

## 📋 PR Checklist (Before Submitting)

### Code Quality
- [ ] TypeScript strict mode: zero errors
- [ ] ESLint: zero warnings
- [ ] Prettier: all files formatted
- [ ] No `console.log()` or debugging code

### Tests
- [ ] New code has tests (unit + integration if applicable)
- [ ] All tests passing: `pnpm run test`
- [ ] Coverage thresholds met
- [ ] E2E tests updated if user flow changed

### Architecture
- [ ] Clean Architecture boundaries respected (backend)
- [ ] Feature-Sliced Design layers respected (frontend)
- [ ] No cross-feature imports in frontend
- [ ] Zod schemas for new DTOs

### Documentation
- [ ] JSDoc comments for exported functions
- [ ] README updated if public API changed
- [ ] Swagger decorators for new endpoints
- [ ] i18n keys added for new strings

### Performance
- [ ] No N+1 queries
- [ ] Images optimized
- [ ] Bundle size checked (if frontend changes)
- [ ] Performance impact assessed for critical paths

### Security
- [ ] Auth guards on protected routes
- [ ] Input validation with Zod
- [ ] No secrets in code
- [ ] CORS configured correctly

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Error messages announced

---

## 🆘 When You're Stuck

### Common Issues & Solutions

**Issue**: "My use case needs to call an external API, but that breaks Clean Architecture"  
**Solution**: Create an interface in the use-case layer, implement in infrastructure:
```typescript
// use-cases/interfaces/auth-provider.interface.ts
export interface IAuthProvider {
  validateToken(token: string): Promise<User>;
}

// use-cases/login.use-case.ts
constructor(private authProvider: IAuthProvider) {}

// infrastructure/auth0-provider.ts
export class Auth0Provider implements IAuthProvider {
  async validateToken(token: string): Promise<User> {
    // Auth0 SDK call here
  }
}
```

**Issue**: "I need to import a feature from another feature"  
**Solution**: Extract shared logic to `entities/` or `shared/`:
```typescript
// ❌ WRONG
// features/quiz/playQuiz.ts
import { formatTime } from 'features/timer/utils';

// ✅ CORRECT
// shared/utils/time.ts
export const formatTime = (seconds: number): string => { };

// features/quiz/playQuiz.ts
import { formatTime } from '../../shared/utils/time';
```

**Issue**: "My function is >30 lines"  
**Solution**: Extract sub-functions or explain why complexity is necessary:
```typescript
// ✅ ACCEPTABLE with justification
function complexAlgorithm(): Result {
  // JUSTIFICATION: This algorithm implements the quiz scoring formula
  // defined in the business requirements. Breaking it into smaller
  // functions would obscure the mathematical relationships.
  // Total: 45 lines (under review for refactoring in Q2 2026)
  
  // ... complex logic ...
}
```

**Issue**: "Third-party library has no types"  
**Solution**: Create minimal type definitions:
```typescript
// types/untyped-lib.d.ts
declare module 'untyped-lib' {
  export function doSomething(arg: string): any; // JUSTIFICATION: No upstream types
}
```

---

## 📚 Additional Resources

- **Full Constitution**: `.specify/memory/constitution.md`
- **Compliance Report**: `.specify/memory/constitution-compliance-report.md`
- **Architecture Guide**: `plan.md`
- **Project Board**: [Link to issue tracker]

---

## 🎯 Remember

**The constitution exists to ensure**:
1. ✅ High code quality (readable, maintainable, testable)
2. ✅ Consistent user experience
3. ✅ Strong type safety
4. ✅ Comprehensive test coverage
5. ✅ Good performance
6. ✅ Secure application

**When in doubt**: Ask in code review or team chat. Better to clarify than to violate principles!

---

**Last Updated**: 2026-02-25  
**Questions?** See full constitution or ask team lead

