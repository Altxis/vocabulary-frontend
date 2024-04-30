<template>
  <v-sheet class="d-flex justify-center">
    <v-sheet class="ma-6 pa-6 content">
      <v-text-field
        append-inner-icon="mdi-magnify"
        label="Search"
        variant="solo"
        hide-details
        single-line
        v-model="search"
        type='input lazy'
      ></v-text-field>
      <v-infinite-scroll class="ga-6" :key="search" :items="items" :onLoad="load">
        <v-sheet class="pa-6" v-if="items.length">
          <v-row justify="space-between">
            <v-col class="text-caption">
              Word
            </v-col>
            <v-col class="text-caption">
              Number of views
            </v-col>
          </v-row>
        </v-sheet>
        <template v-for="(item, index) in items" :key="item">
          <v-card class="pa-6" @click="onCardClick(index)">
            <v-row justify="space-between">
              <v-col>
                {{item.word}}
              </v-col>
              <v-col>
                {{item.numberOfViews || 0}}
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-infinite-scroll>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
  import { ref, watch } from 'vue'
  import type { InfiniteScrollStatus, Word } from '../types'

  const PAGE_SIZE = 50

  export default {
    setup() {
      const items = ref<Word[]>([])
      const search = ref('')

      watch([search], () => {
        items.value = []
      })

      watch([items.value], () => {
        console.log('!!!items', items.value)
      })

      async function api (): Promise<any[]> {
        const t = search.value
        await new Promise(resolve => setTimeout(resolve, 200))
        if (t !== search.value) {
          return []
        }
        const res = await $fetch('http://localhost:3001/api/words', {
          method: 'post',
          body: {
            search: search.value,
            skip: items.value.length,
            limit: PAGE_SIZE
          }
        })
        return res as any[]
      }
      async function load (props: { done: (status: InfiniteScrollStatus) => void }) {
        const { done } = props

        try {
          const words = await api()
          if (words.length > 0) {
            items.value.push(...words)
          }
          if (words.length < PAGE_SIZE) {
            done('empty')
            console.log('empty')
            return
          }
        } catch (e) {
          console.error(e)
          console.log('error')
          done('error')
          return
        }
        console.log('ok')
        done('ok')
      }

      const onCardClick = async (index: number) => {
        try {
          console.log('onCardClick', index, items.value[index]._id)
          await $fetch('http://localhost:3001/api/words/statistics', {
            method: 'post',
            body: {
              id: items.value[index]._id
            }
          })
          navigateTo(`/cards/${items.value[index]._id}`)
        } catch (e) {
          console.error(e, 'Error while loading card')
        }
      }

      return { items, search, load, onCardClick }
    }
  }
</script>

<style scoped>
  .content {
    width: 100%;
    max-width: 800px;
  }
</style>