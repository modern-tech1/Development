<script setup>
import { Play, Music2, Video, Download } from 'lucide-vue-next'
import { mediaUrl } from '../services/api'
const props = defineProps({ item: { type: Object, required: true } })
const emit = defineEmits(['play'])
</script>
<template>
  <article class="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.035] transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06]">
    <button class="relative block aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 text-left" @click="emit('play', item)">
      <img v-if="item.coverUrl" :src="mediaUrl(item.coverUrl)" :alt="item.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div v-else class="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#7c3aed55,transparent_45%),linear-gradient(135deg,#21133c,#111827)]"><Music2 v-if="item.type !== 'video'" :size="48" class="text-violet-200/80"/><Video v-else :size="48" class="text-violet-200/80"/></div>
      <span class="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">{{ item.type }}</span>
      <span class="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg transition group-hover:scale-110"><Play :size="17" fill="currentColor"/></span>
    </button>
    <div class="p-4"><p class="truncate font-semibold text-white">{{ item.title }}</p><p class="mt-1 truncate text-sm text-slate-400">{{ item.artist }}</p><div class="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{{ item.category || 'Gospel' }} · {{ item.language || '—' }}</span><a v-if="item.allowDownload" :href="mediaUrl(item.mediaUrl)" :download="item.title" class="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" @click.stop aria-label="Download media"><Download :size="15"/></a></div></div>
  </article>
</template>