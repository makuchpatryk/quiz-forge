<script setup lang="ts">
const router = useRouter();

function backToDashboard() {
  setTimeout(() => {
    router.back();
  }, 1000);
}
</script>
<template>
  <NuxtLink class="inline-block mt-6 text-blue-600 no-underline text-base hover:underline" @click="backToDashboard">{{
    $t("Back")
  }}</NuxtLink>
</template>
