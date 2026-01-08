<template>
  <div>
    <div class="user-header">
      <div class="user-info">
        <span class="user-icon">👤</span>
        <span class="username">{{ currentUser }}</span>
      </div>
      <button class="logout-btn" @click="logout">{{ $t("logout") }}</button>
    </div>
    <h1 style="text-align: center; margin-bottom: 40px">
      {{ $t("quizMaster") }}
    </h1>
    <div class="menu-stats">
      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-value">{{ userData.bestScore }}</div>
        <div class="stat-label">{{ $t("bestScore") }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎮</div>
        <div class="stat-value">{{ userData.gamesPlayed }}</div>
        <div class="stat-label">{{ $t("gamesPlayed") }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-value">{{ userQuizzes.length }}</div>
        <div class="stat-label">{{ $t("yourQuizzes") }}</div>
      </div>
    </div>
    <div class="menu-buttons">
      <NuxtLink class="menu-btn primary-btn" to="/quiz-selection">
        <span class="btn-icon">🎯</span>
        <span>{{ $t("playQuiz") }}</span>
      </NuxtLink>
      <NuxtLink class="menu-btn secondary-btn" to="/dashboard">
        <span class="btn-icon">⚙️</span>
        <span>{{ $t("manageQuizzes") }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
const { t } = useI18n();

const router = useRouter();
const currentUser = ref<string | null>(null);
const users = ref<Record<string, any>>({});
const quizzes = ref<Record<string, any>>({});

const userData = computed(() => {
  if (!currentUser.value || !users.value[currentUser.value]) {
    return { bestScore: 0, gamesPlayed: 0, quizScores: {} };
  }
  return users.value[currentUser.value];
});

const userQuizzes = computed(() => {
  return Object.values(quizzes.value).filter(
    (quiz: any) => quiz.author === currentUser.value,
  );
});

const logout = () => {
  localStorage.removeItem("currentUser");
  router.push("/login");
};

onMounted(() => {
  users.value = JSON.parse(localStorage.getItem("quizUsers") || "{}");
  quizzes.value = JSON.parse(localStorage.getItem("quizzes") || "{}");
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser && users.value[savedUser]) {
    currentUser.value = savedUser;
  } else {
    router.push("/login");
  }
});
</script>
<style scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-icon {
  font-size: 22px;
}
.username {
  font-weight: bold;
  font-size: 18px;
}
.logout-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
}
.logout-btn:hover {
  background: #b52a37;
}
.menu-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  justify-content: center;
}
.stat-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 18px 24px;
  text-align: center;
  min-width: 120px;
}
.stat-icon {
  font-size: 28px;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 22px;
  font-weight: bold;
}
.stat-label {
  font-size: 14px;
  color: #666;
}
.menu-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
}
.menu-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: #fff;
  background: #007bff;
  transition: background 0.2s;
}
.menu-btn.secondary-btn {
  background: #6c757d;
}
.menu-btn:hover {
  background: #0056b3;
}
.btn-icon {
  font-size: 22px;
}
</style>
