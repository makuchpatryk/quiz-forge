<template>
  <div key="auth">
    <h1 style="text-align: center; margin-bottom: 40px">
      {{ $t("quizMaster") }}
    </h1>
    <transition name="slide" mode="out-in">
      <div key="register">
        <h2 class="auth-title">{{ $t("registerTitle") }}</h2>
        <div class="form-group">
          <label>{{ $t("username") }}</label>
          <input
            type="text"
            v-model="registerForm.username"
            class="form-input"
            :placeholder="$t('chooseUsername')"
          />
        </div>
        <div class="form-group">
          <label>{{ $t("email") }}</label>
          <input
            type="email"
            v-model="registerForm.email"
            class="form-input"
            :placeholder="$t('enterEmail')"
          />
        </div>
        <div class="form-group">
          <label>{{ $t("password") }}</label>
          <input
            type="password"
            v-model="registerForm.password"
            class="form-input"
            :placeholder="$t('choosePassword')"
          />
        </div>
        <div class="form-group">
          <label>{{ $t("repeatPassword") }}</label>
          <input
            type="password"
            v-model="registerForm.passwordConfirm"
            class="form-input"
            :placeholder="$t('repeatPasswordPlaceholder')"
            @keyup.enter="register"
          />
        </div>
        <button class="auth-btn" @click="register">
          {{ $t("registerBtn") }}
        </button>
        <p class="auth-switch">
          {{ $t("alreadyHaveAccount") }}
          <NuxtLink to="/auth/login">{{ $t("loginBtn") }}</NuxtLink>
        </p>
        <div class="error-message" :class="{ success: authMessage.success }">
          {{ authMessage.text }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const router = useRouter();
const registerForm = ref({
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
});
const authMessage = ref({ text: "", success: false });
const users = ref<Record<string, any>>({});

const loadData = () => {
  users.value = JSON.parse(localStorage.getItem("quizUsers") || "{}");
};

const saveData = () => {
  localStorage.setItem("quizUsers", JSON.stringify(users.value));
};

const register = () => {
  const { username, email, password, passwordConfirm } = registerForm.value;
  if (!username || !email || !password || !passwordConfirm) {
    authMessage.value = { text: t("fillAllFields"), success: false };
    return;
  }
  if (username.length < 3) {
    authMessage.value = { text: t("usernameTooShort"), success: false };
    return;
  }
  if (!email.includes("@")) {
    authMessage.value = { text: t("invalidEmail"), success: false };
    return;
  }
  if (password.length < 6) {
    authMessage.value = { text: t("passwordTooShort"), success: false };
    return;
  }
  if (password !== passwordConfirm) {
    authMessage.value = { text: t("passwordsNotMatch"), success: false };
    return;
  }
  if (users.value[username]) {
    authMessage.value = { text: t("usernameTaken"), success: false };
    return;
  }
  users.value[username] = {
    email,
    password,
    bestScore: 0,
    gamesPlayed: 0,
    quizScores: {},
    createdAt: new Date().toISOString(),
  };
  saveData();
  authMessage.value = { text: t("registerSuccess"), success: true };
  setTimeout(() => {
    router.push("/login");
  }, 1000);
};

onMounted(() => {
  loadData();
});
</script>
