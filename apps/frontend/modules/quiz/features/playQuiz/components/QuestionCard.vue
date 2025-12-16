<template>
  <div class="question-card">
    <h3>{{ question.text }}</h3>
    <ul>
      <li v-for="a in question.answers" :key="a.id">
        <label>
          <input type="checkbox" :value="a.id" v-model="selected" />
          {{ a.text }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  question: { id: string; text: string; answers: { id: string; text: string }[] };
}>();

const selected = ref<string[]>([]);
</script>

<style scoped lang="scss">
.question-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin: 1rem 0;
}
</style>