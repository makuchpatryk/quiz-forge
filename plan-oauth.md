# Plan: Logowanie OAuth (Google + Facebook)

Integracja logowania przez Google i Facebook do istniejącej aplikacji NestJS + Nuxt 3.
OAuth callback obsługiwany bezpośrednio przez backend NestJS, który po uwierzytelnieniu ustawia ciasteczka JWT i przekierowuje użytkownika na frontend.

---

## Krok 1 — Zmiany w bazie danych (migracja + encje)

### Nowe kolumny w tabeli `users`:

| Kolumna      | Typ       | Domyślna  | Nullable | Opis                                      |
|-------------|-----------|-----------|----------|-------------------------------------------|
| `provider`   | `varchar` | `'local'` | NO       | `'local' \| 'google' \| 'facebook'`       |
| `providerId` | `varchar` | —         | YES      | ID użytkownika u dostawcy OAuth            |

Kolumna `password` zmieniana na **nullable** (użytkownicy OAuth nie mają hasła).

### Pliki do zmiany:

1. **`apps/backend/src/database/entities/user.enum.ts`** — dodać enum `AuthProvider`:
   ```typescript
   export enum AuthProvider {
     LOCAL = 'local',
     GOOGLE = 'google',
     FACEBOOK = 'facebook',
   }
   ```

2. **`apps/backend/src/database/entities/user.orm-entity.ts`**:
   - Dodać kolumnę `provider` z `@Column({ type: 'varchar', default: 'local' })`
   - Dodać kolumnę `providerId` z `@Column({ type: 'varchar', nullable: true })`
   - Zmienić kolumnę `password` na `nullable: true`

3. **`apps/backend/src/modules/user/domain/user.entity.ts`**:
   - Dodać pola `provider` i `providerId`
   - Zaktualizować metodę `create()` by przyjmowała opcjonalny `password` i nowe pola

4. **`apps/backend/src/database/mappers/user.mapper.ts`** — mapować nowe pola w obu kierunkach

5. **Wygenerować migrację**: `cd apps/backend && pnpm run migration:generate`

---

## Krok 2 — Instalacja zależności

### Backend (`apps/backend/`):
```bash
pnpm add passport-google-oauth20 passport-facebook
pnpm add -D @types/passport-google-oauth20 @types/passport-facebook
```

Frontend **nie wymaga** nowych paczek — OAuth opiera się na przekierowaniu przeglądarki.

---

## Krok 3 — Zmienne środowiskowe

Dodać do `.env` (backend):
```env
# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx
FACEBOOK_CALLBACK_URL=http://localhost:3001/auth/facebook/callback

# Frontend URL (do przekierowania po OAuth)
FRONTEND_URL=http://localhost:3000
```

Opcjonalnie rozszerzyć `apps/backend/src/config/app.config.ts` o odczyt tych zmiennych.

---

## Krok 4 — Strategie Passport (Backend)

Utworzyć nowy katalog `apps/backend/src/modules/auth/strategies/`:

### `google.strategy.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
      state: true, // ochrona CSRF
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { emails, displayName, id } = profile;
    const oauthProfile = {
      email: emails[0].value,
      name: displayName,
      provider: 'google' as const,
      providerId: id,
    };
    const tokens = await this.authService.validateOAuthUser(oauthProfile);
    done(null, tokens);
  }
}
```

### `facebook.strategy.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['emails', 'name', 'displayName'],
      scope: ['email'],
      state: true, // ochrona CSRF
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { emails, displayName, id } = profile;
    if (!emails || !emails.length) {
      done(new Error('Email not provided by Facebook'), null);
      return;
    }
    const oauthProfile = {
      email: emails[0].value,
      name: displayName,
      provider: 'facebook' as const,
      providerId: id,
    };
    const tokens = await this.authService.validateOAuthUser(oauthProfile);
    done(null, tokens);
  }
}
```

---

## Krok 5 — Rozszerzenie AuthService

### Nowy interfejs w `apps/backend/src/modules/auth/types.ts`:
```typescript
export interface OAuthProfile {
  email: string;
  name: string;
  provider: 'google' | 'facebook';
  providerId: string;
}
```

### Nowa metoda w `auth.service.ts`:
```typescript
async validateOAuthUser(profile: OAuthProfile): Promise<TokenModel> {
  let user = await this.userRepository.getUserByEmail(profile.email);

  if (user) {
    // Łączenie kont — aktualizuj provider jeśli loguje się przez OAuth
    user.provider = profile.provider;
    user.providerId = profile.providerId;
    await this.userRepository.update(user.id, user);
  } else {
    // Utwórz nowego użytkownika (bez hasła)
    user = new User();
    user.email = profile.email;
    user.provider = profile.provider;
    user.providerId = profile.providerId;
    // password = null — konto OAuth
    user = await this.userRepository.create(user);
  }

  const tokens = await this.generateTokens(user);
  await this.saveRefreshToken(user.id, tokens.refreshToken);
  return tokens;
}
```

### Modyfikacja metody `login()`:
Dodać walidację `provider`:
```typescript
if (user.provider !== 'local') {
  throw new BadRequestException(
    `To konto jest powiązane z ${user.provider}. Użyj logowania OAuth.`
  );
}
```

---

## Krok 6 — Rozszerzenie UserRepository

### Interfejs (`apps/backend/src/modules/user/domain/user.repository.ts`):
```typescript
getUserByProviderId(provider: string, providerId: string): Promise<User | null>;
```

### Implementacja w `apps/backend/src/database/respositories/user.repository.ts`:
```typescript
async getUserByProviderId(provider: string, providerId: string): Promise<User | null> {
  return this.userOrmRepository.findOne({ where: { provider, providerId } });
}
```

---

## Krok 7 — Endpointy OAuth w kontrolerze

### Nowe endpointy w `auth.controller.ts`:

```typescript
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

// === Google ===
@Get('google')
@UseGuards(PassportAuthGuard('google'))
googleLogin() {
  // Passport automatycznie przekieruje do Google
}

@Get('google/callback')
@UseGuards(PassportAuthGuard('google'))
googleCallback(@Request() req: any, @Res() res: Response) {
  this.handleOAuthCallback(req, res);
}

// === Facebook ===
@Get('facebook')
@UseGuards(PassportAuthGuard('facebook'))
facebookLogin() {
  // Passport automatycznie przekieruje do Facebook
}

@Get('facebook/callback')
@UseGuards(PassportAuthGuard('facebook'))
facebookCallback(@Request() req: any, @Res() res: Response) {
  this.handleOAuthCallback(req, res);
}

// === Helper ===
private handleOAuthCallback(req: any, res: Response) {
  const tokens = req.user; // tokens z validate() strategii
  res.cookie('accessToken', tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/auth',
  });
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
}
```

### ⚠️ Ważne: zmiana `sameSite` cookies
Zmienić `sameSite: 'strict'` na `sameSite: 'lax'` — `strict` blokuje ciasteczka po przekierowaniu z Google/Facebook:
```typescript
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // ← zmiana ze 'strict'
};
```

---

## Krok 8 — Rejestracja strategii w AuthModule

### `auth.module.ts`:
```typescript
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule.register({}), // ← dodać
    JwtModule.registerAsync({ ... }),
  ],
  providers: [
    AuthService,
    GoogleStrategy,  // ← dodać
    FacebookStrategy, // ← dodać
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## Krok 9 — Zmiany we frontendzie

### 9a. Przyciski OAuth na stronie logowania

**`apps/frontend/apps/auth/pages/auth/login.vue`** — dodać pod formularzem:

```vue
<!-- Separator -->
<div class="flex items-center my-6">
  <div class="flex-1 border-t border-gray-300"></div>
  <span class="px-4 text-gray-500 text-sm">{{ $t('orLoginWith') }}</span>
  <div class="flex-1 border-t border-gray-300"></div>
</div>

<!-- Przyciski OAuth -->
<a
  :href="`${apiBaseUrl}/auth/google`"
  class="w-full flex items-center justify-center gap-2 px-3 py-2 text-lg
         bg-white text-gray-700 border border-gray-300 rounded cursor-pointer
         hover:bg-gray-50 mb-3 no-underline"
>
  <!-- Google icon SVG inline -->
  {{ $t('loginWithGoogle') }}
</a>

<a
  :href="`${apiBaseUrl}/auth/facebook`"
  class="w-full flex items-center justify-center gap-2 px-3 py-2 text-lg
         bg-[#1877F2] text-white border-none rounded cursor-pointer
         hover:bg-[#166FE5] mb-3 no-underline"
>
  <!-- Facebook icon SVG inline -->
  {{ $t('loginWithFacebook') }}
</a>
```

Gdzie `apiBaseUrl` pochodzi z:
```typescript
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;
```

### 9b. Obsługa błędów OAuth

W `login.vue` — na `onMounted` sprawdzić query param `error`:
```typescript
onMounted(() => {
  const route = useRoute();
  if (route.query.error === 'oauth_failed') {
    authMessage.value = {
      text: t('oauthLoginFailed'),
      success: false,
    };
  }
});
```

### 9c. Aktualizacja typów

**`apps/frontend/apps/core/libs/api/auth/types.ts`** — dodać pole `provider`:
```typescript
export interface UserResponse {
  role: string;
  id: string;
  email: string;
  provider?: string; // ← dodać
  updatedAt: string;
  createdAt: string;
}
```

### 9d. Proxy NIE jest potrzebne

OAuth flow = przeglądarka robi redirect na backend → backend → Google/Facebook → backend callback → redirect na frontend.
Cały flow omija Nuxt server proxy — nie trzeba dodawać nowych route'ów w `server/api/auth/`.

---

## Krok 10 — Tłumaczenia (i18n)

Dodać klucze w plikach `apps/frontend/apps/core/i18n/locales/`:
```json
{
  "orLoginWith": "lub zaloguj się przez",
  "loginWithGoogle": "Zaloguj się przez Google",
  "loginWithFacebook": "Zaloguj się przez Facebook",
  "oauthLoginFailed": "Logowanie OAuth nie powiodło się. Spróbuj ponownie."
}
```

---

## Uwagi bezpieczeństwa

1. **`state: true`** w obu strategiach — ochrona przed CSRF w flow OAuth
2. **`sameSite: 'lax'`** — konieczne, bo `strict` blokuje cookies po redirect z Google/Facebook
3. **`password` nullable** — `login()` musi sprawdzać `provider === 'local'` zanim porówna hasło
4. **HTTPS w produkcji** — callback URL-e i cookies `secure: true`
5. **Nie ujawniać `providerId`** w odpowiedziach API — w `me` endpoint usuwać to pole
6. **Callback URL** — musi dokładnie zgadzać się z tym zarejestrowanym w Google/Facebook Developer Console

---

## Kolejność implementacji

1. ✅ Krok 1 — Zmiany w bazie danych
2. ✅ Krok 2 — Instalacja zależności
3. ✅ Krok 3 — Zmienne środowiskowe
4. ✅ Krok 4 — Strategie Passport
5. ✅ Krok 5 — Rozszerzenie AuthService
6. ✅ Krok 6 — Rozszerzenie UserRepository
7. ✅ Krok 7 — Endpointy OAuth w kontrolerze
8. ✅ Krok 8 — Rejestracja w AuthModule
9. ✅ Krok 9 — Zmiany we frontendzie (przyciski + obsługa błędów)
10. ✅ Krok 10 — Tłumaczenia i18n

