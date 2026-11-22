<script setup>
import { computed } from 'vue'
import { X, Music2, Video } from 'lucide-vue-next'
import { mediaUrl } from '../services/api'
const props = defineProps({ item: Object })
const emit = defineEmits(['close'])
const source = computed(() => mediaUrl(props.item?.mediaUrl))
</script>
<template>
  <div v-if="item" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" @click.self="emit('close')">
    <section class="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#151520] shadow-2xl">
      <header class="flex items-center justify-between gap-4 border-b border-white/10 p-4 sm:p-5"><div class="flex min-w-0 items-center gap-3"><span class="rounded-xl bg-violet-500/15 p-2 text-violet-300"><Video v-if="item.type === 'video'"/><Music2 v-else/></span><div class="min-w-0"><h2 class="truncate font-bold">{{ item.title }}</h2><p class="truncate text-sm text-slate-400">{{ item.artist }}</p></div></div><button class="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white" @click="emit('close')" aria-label="Close player"><X/></button></header>
      <div class="bg-black"> <video v-if="item.type === 'video'" :key="source" :src="source" controls autoplay playsinline class="max-h-[65vh] w-full" /> <div v-else class="px-5 py-12 sm:px-12"><div class="mx-auto mb-7 flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/40 to-indigo-950 shadow-2xl"> <img v-if="item.coverUrl" :src="mediaUrl(item.coverUrl)" class="h-full w-full object-cover" :alt="item.title"/><Music2 v-else :size="64" class="text-violet-200"/></div><audio :key="source" :src="source" controls autoplay class="w-full" /></div></div>
      <div class="p-5"><p v-if="item.description" class="text-sm leading-6 text-slate-300">{{ item.description }}</p><p class="mt-2 text-xs text-slate-500">{{ item.category }} · {{ item.language }}</p></div>
    </section>
  </div>
</template>