<script setup lang="ts">
const router = useRouter();

function backToDashboard() {
  setTimeout(() => {
    router.back();
  }, 1000);
}
</script>
<template>
  <NuxtLink class="back-btn" @click="backToDashboard">{{
    $t("Back")
  }}</NuxtLink>
</template>
<style scoped>
.back-btn {
  display: inline-block;
  margin-top: 24px;
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
}
.back-btn:hover {
  text-decoration: underline;
}
</style>
