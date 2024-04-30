<template>
  <v-sheet class="d-flex justify-center">
    <v-sheet class="ma-6 pa-6 content">
      <v-btn class="ma-6" @click="$router.back()">Back</v-btn>
      <v-card class="pa-6 ma-6" v-if="item">
        <v-sheet class="pa-6">
          {{ item.word }}
        </v-sheet>
        <v-divider></v-divider>
        <v-sheet class="pa-6">
          {{ item.translation }}
        </v-sheet>
      </v-card>
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { Word } from '@/types'
  const route = useRoute()

  const item = ref<Word | null>(null)

  const loadWord = async () => {
    const res = await $fetch(`http://localhost:3001/api/words/${route.params.id}`)
    item.value = res as Word
  }

  onMounted(() => {
    loadWord()
  })

</script>

<style scoped>
  .content {
    width: 100%;
    max-width: 800px;
  }
</style>