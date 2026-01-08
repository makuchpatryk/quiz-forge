<template>
  <div>
    <h1 style="text-align: center; margin-bottom: 40px">
      {{ $t("quizMaster") }}
    </h1>

    <transition name="slide" mode="out-in">
      <div key="login">
        <h2 class="auth-title">{{ $t("loginTitle") }}</h2>
        <div class="form-group">
          <label>{{ $t("username") }}</label>
          <input
            type="text"
            v-model="loginForm.username"
            class="form-input"
            :placeholder="$t('enterUsername')"
            @keyup.enter="login"
          />
        </div>
        <div class="form-group">
          <label>{{ $t("password") }}</label>
          <input
            type="password"
            v-model="loginForm.password"
            class="form-input"
            :placeholder="$t('enterPassword')"
            @keyup.enter="login"
          />
        </div>
        <button class="auth-btn" @click="login">{{ $t("loginBtn") }}</button>
        <p class="auth-switch">
          {{ $t("noAccount") }}
          <NuxtLink to="/signup">{{ $t("registerBtn") }}</NuxtLink>
        </p>
        <div class="error-message" :class="{ success: authMessage.success }">
          {{ authMessage.text }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const router = useRouter();
const loginForm = ref({ username: "", password: "" });
const authMessage = ref({ text: "", success: false });
const users = ref<Record<string, any>>({});

const loadData = () => {
  users.value = JSON.parse(localStorage.getItem("quizUsers") || "{}");
};

const login = () => {
  const { username, password } = loginForm.value;
  if (!username || !password) {
    authMessage.value = { text: t("fillAllFields"), success: false };
    return;
  }
  if (!users.value[username]) {
    authMessage.value = { text: t("userNotExist"), success: false };
    return;
  }
  if (users.value[username].password !== password) {
    authMessage.value = { text: t("wrongPassword"), success: false };
    return;
  }
  localStorage.setItem("currentUser", username);
  authMessage.value = { text: t("loginSuccess"), success: true };
  setTimeout(() => {
    router.push("/");
  }, 500);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.auth-title {
  font-size: 28px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.auth-btn {
  width: 100%;
  padding: 10px;
  font-size: 18px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-btn:hover {
  background-color: #0056b3;
}

.auth-switch {
  margin-top: 10px;
  text-align: center;
}

.error-message {
  margin-top: 10px;
  text-align: center;
  color: red;
}

.success {
  color: green;
}
</style>
