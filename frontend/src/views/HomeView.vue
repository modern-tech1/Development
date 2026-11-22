
<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  AudioLines,
  Search,
  Music2,
  Heart,
  ArrowUpRight,
  Sparkles,
  Headphones,
} from 'lucide-vue-next'

import api from '../services/api'
import SongCard from '../components/SongCard.vue'
import MediaPlayer from '../components/MediaPlayer.vue'

// Song library state
const songs = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const selectedCategory = ref('All')
const activeSong = ref(null)

// Get all available categories
const categories = computed(() => {
  const allCategories = songs.value
    .map(song => song.category)
    .filter(Boolean)

  return ['All', ...new Set(allCategories)]
})

// Search and filter songs
const filteredSongs = computed(() => {
  const query = search.value.trim().toLowerCase()

  return songs.value.filter(song => {
    const matchesSearch = [
      song.title,
      song.artist,
      song.language,
      song.category,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query)

    const matchesCategory =
      selectedCategory.value === 'All' ||
      song.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

// Load songs from the backend
async function loadSongs() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/songs')
    songs.value = response.data
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Unable to load songs. Please check your internet connection and backend server.'
  } finally {
    loading.value = false
  }
}

// Load songs when the page opens
onMounted(loadSongs)
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-[#0d0d14] text-slate-100">

    <!-- Navigation -->
    <header class="border-b border-white/10 bg-[#0d0d14]">
      <nav
        class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <RouterLink to="/" class="flex items-center gap-3">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white"
          >
            <AudioLines :size="22" />
          </span>

          <span class="text-xl font-black">
            Gospel<span class="text-violet-400">Hub</span>
          </span>
        </RouterLink>

        <div class="flex items-center gap-2 sm:gap-3">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
        >Home</RouterLink>
        <RouterLink
          to="/contact"
          class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
        >Contact</RouterLink>
        <a
          href="#library"
          class="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          Explore music
        </a>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero section -->
      <section class="relative">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_25%,#6d28d933,transparent_40%),radial-gradient(ellipse_at_90%_5%,#4338ca22,transparent_36%)]"
        ></div>

        <div
          class="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2"
        >
          <!-- Hero text -->
          <div>
            <div
              class="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-200"
            >
              <Sparkles :size="15" />
              MUSIC THAT LIFTS THE SOUL
            </div>

            <h1
              class="max-w-2xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl"
            >
              Let your heart
              <span
                class="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent"
              >
                sing.
              </span>
            </h1>

            <p class="mt-6 max-w-xl leading-7 text-slate-400 sm:text-lg">
              Discover gospel songs and videos that inspire faith, bring
              peace, and keep hope alive — all in one place.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <a
                href="#library"
                class="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-bold text-white transition hover:bg-violet-400"
              >
                Explore the library
                <ArrowUpRight :size="18" />
              </a>

              <span
                class="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300"
              >
                <Headphones :size="18" class="text-violet-300" />
                Listen. Worship. Repeat.
              </span>
            </div>

            <div class="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                Audio and video
              </span>
              <span>•</span>
              <span>Made for worship</span>
            </div>
          </div>

          <!-- Decorative music panel -->
          <div class="mx-auto w-full max-w-md">
            <div
              class="rounded-3xl border border-white/10 bg-gradient-to-br from-[#282044] via-[#171629] to-[#11111a] p-5 shadow-2xl sm:p-7"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-widest text-violet-200">
                  A moment of worship
                </span>

                <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  GospelHub
                </span>
              </div>

              <div
                class="relative my-7 flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-[#17172d] to-slate-950"
              >
                <div
                  class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#a78bfa55,transparent_45%)]"
                ></div>

                <div
                  class="relative flex h-40 w-40 items-center justify-center rounded-full border border-violet-200/20 bg-violet-300/10 shadow-2xl"
                >
                  <div
                    class="flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/5"
                  >
                    <Music2 :size="54" class="text-violet-100" />
                  </div>
                </div>

                <div class="absolute bottom-5 left-5 right-5">
                  <p class="text-xs text-violet-200">
                    YOUR DAILY SOUNDTRACK
                  </p>

                  <div class="mt-1 flex items-center justify-between">
                    <p class="text-xl font-bold">Grace for today</p>
                    <Heart :size="22" class="text-fuchsia-300" />
                  </div>
                </div>
              </div>

              <!-- Decorative sound bars -->
              <div class="flex h-10 items-center gap-1">
                <span
                  v-for="bar in 35"
                  :key="bar"
                  class="flex-1 rounded-full bg-violet-300/70"
                  :style="{
                    height: `${10 + ((bar * 17) % 31)}px`,
                    opacity: 0.3 + ((bar % 5) * 0.14),
                  }"
                ></span>
              </div>

              <div class="mt-3 flex justify-between text-xs text-slate-500">
                <span>Faith · Hope · Worship</span>
                <span>Press play on praise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Music library -->
      <section
        id="library"
        class="mx-auto max-w-7xl scroll-mt-6 px-5 pb-20 pt-8 sm:px-8"
      >
        <div class="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p class="mb-2 text-xs font-bold uppercase tracking-widest text-violet-300">
              THE LIBRARY
            </p>

            <h2 class="text-3xl font-black sm:text-4xl">
              Find your next
              <span class="text-violet-300">favorite.</span>
            </h2>

            <p class="mt-2 text-sm text-slate-400">
              Songs and videos selected to inspire your day.
            </p>
          </div>

          <!-- Search input -->
          <div class="relative w-full md:max-w-sm">
            <Search
              :size="18"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              v-model="search"
              type="search"
              placeholder="Search title, artist, language..."
              class="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-violet-400/60"
            />
          </div>
        </div>

        <!-- Category buttons -->
        <div class="mt-7 flex flex-wrap gap-2">
          <button
            v-for="itemCategory in categories"
            :key="itemCategory"
            @click="selectedCategory = itemCategory"
            class="rounded-full border px-4 py-2 text-sm font-semibold transition"
            :class="
              selectedCategory === itemCategory
                ? 'border-violet-400 bg-violet-500 text-white'
                : 'border-white/10 bg-white/[0.025] text-slate-400 hover:text-white'
            "
          >
            {{ itemCategory }}
          </button>
        </div>

        <!-- Loading state -->
        <div
          v-if="loading"
          class="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="number in 4"
            :key="number"
            class="h-72 animate-pulse rounded-2xl border border-white/5 bg-white/[0.035]"
          ></div>
        </div>

        <!-- Error state -->
        <div
          v-else-if="error"
          class="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6"
        >
          <h3 class="font-semibold text-amber-100">
            The library is temporarily unavailable.
          </h3>

          <p class="mt-2 text-sm text-slate-400">
            {{ error }}
          </p>

          <button
            @click="loadSongs"
            class="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
          >
            Try again
          </button>
        </div>

        <!-- Song cards -->
        <div
          v-else-if="filteredSongs.length"
          class="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <SongCard
            v-for="song in filteredSongs"
            :key="song._id"
            :item="song"
            @play="activeSong = $event"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center"
        >
          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-violet-300"
          >
            <Music2 :size="25" />
          </div>

          <h3 class="mt-4 text-lg font-bold">
            No songs found
          </h3>

          <p class="mt-2 text-sm text-slate-500">
            Try another search or choose a different category.
          </p>

          <button
            @click="search = ''; selectedCategory = 'All'"
            class="mt-5 rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
          >
            Show all songs
          </button>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8"
      >
        <RouterLink to="/" class="font-bold text-slate-300">
          Gospel<span class="text-violet-400">Hub</span>
        </RouterLink>

        <p>
          © {{ new Date().getFullYear() }} GospelHub. Let every song bring hope.
        </p>

        <a href="#library" class="hover:text-violet-300">
          Explore music ↑
        </a>
      </div>
    </footer>

    <!-- Audio and video player -->
    <MediaPlayer
      :item="activeSong"jjkazBKX ;
      @close="activeSong = null"
    />
  </div>
</template>