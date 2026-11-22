
<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  AudioLines,
  Mail,
  MessageCircle,
  Send,
  Headphones,
  Music2,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-vue-next'

import api from '../services/api'

// Initial contact form values
const initialForm = () => ({
  name: '',
  email: '',
  subject: 'General question',
  message: ''
})

// Contact form data
const form = ref(initialForm())

// Form states
const submitted = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// Message character counter
const messageLength = computed(() => form.value.message.length)

// Check whether the form is ready to submit
const canSubmit = computed(() => {
  return (
    form.value.name.trim().length >= 1 &&
    form.value.name.trim().length <= 100 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim()) &&
    form.value.email.trim().length <= 254 &&
    form.value.subject.trim().length >= 1 &&
    form.value.subject.trim().length <= 100 &&
    form.value.message.trim().length >= 10 &&
    form.value.message.trim().length <= 3000
  )
})

// Clear messages when the user edits the form
function clearFeedback() {
  submitted.value = false
  errorMessage.value = ''
}

// Reset form
function resetForm() {
  form.value = initialForm()
  submitted.value = false
  errorMessage.value = ''
}

// Submit contact message to Express backend
async function submitMessage() {
  if (loading.value) return

  clearFeedback()

  // Frontend validation
  if (!canSubmit.value) {
    errorMessage.value =
      'Please complete all fields correctly before sending your message.'
    return
  }

  loading.value = true

  try {
    const payload = {
      name: form.value.name.trim(),
      email: form.value.email.trim().toLowerCase(),
      subject: form.value.subject.trim(),
      message: form.value.message.trim()
    }

    const response = await api.post('/contact', payload)

    if (response.data?.success) {
      submitted.value = true
      form.value = initialForm()
    } else {
      errorMessage.value =
        response.data?.message ||
        'Your message could not be sent. Please try again.'
    }
  } catch (error) {
    console.error('GospelHub contact form error:', error)

    if (error.response) {
      errorMessage.value =
        error.response.data?.message ||
        'The server could not process your message.'
    } else if (error.request) {
      errorMessage.value =
        'Unable to reach the server. Check your internet connection or try again later.'
    } else {
      errorMessage.value =
        'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-[#0d0d14] text-slate-100">

    <!-- HEADER -->
    <header class="sticky top-0 z-50 border-b border-white/10 bg-[#0d0d14]/95 backdrop-blur-xl">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

        <RouterLink to="/" class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-500/20">
            <AudioLines :size="22" />
          </span>

          <span class="text-xl font-black tracking-tight">
            Gospel<span class="text-violet-400">Hub</span>
          </span>
        </RouterLink>

        <div class="flex items-center gap-2 sm:gap-3">
          <RouterLink
            to="/"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Home
          </RouterLink>

          <RouterLink
            to="/#library"
            class="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:block"
          >
            Explore music
          </RouterLink>

          <RouterLink
            to="/contact"
            class="rounded-lg bg-violet-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-400"
          >
            Contact
          </RouterLink>
        </div>

      </nav>
    </header>

    <main>

      <!-- HERO SECTION -->
      <section class="relative border-b border-white/5">

        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_25%,#6d28d933,transparent_40%),radial-gradient(ellipse_at_90%_5%,#4338ca22,transparent_36%)]"></div>

        <div class="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">

          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold tracking-wide text-violet-200">
            <MessageCircle :size="15" />
            WE'RE HERE TO HELP
          </div>

          <h1 class="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Let's start a
            <span class="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
              conversation.
            </span>
          </h1>

          <p class="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Have a question, suggestion, or gospel song you'd love to see on GospelHub?
            Send us a message. We'd be glad to hear from you.
          </p>

        </div>
      </section>

      <!-- CONTACT CONTENT -->
      <section class="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">

        <!-- LEFT INFORMATION -->
        <aside class="space-y-5">

          <!-- EMAIL CARD -->
          <div class="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-violet-400/30 sm:p-8">

            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <Mail :size="22" />
            </div>

            <h2 class="mt-5 text-xl font-bold">
              Email us
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              For feedback, questions, or partnership enquiries.
            </p>

            <p class="mt-4 break-all font-semibold text-violet-300">
              hello@gospelhub.example
            </p>

            <p class="mt-2 text-xs text-slate-500">
              Replace this demo address with your real email.
            </p>

          </div>

          <!-- MUSIC CARD -->
          <div class="rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-fuchsia-400/30 sm:p-8">

            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300">
              <Headphones :size="22" />
            </div>

            <h2 class="mt-5 text-xl font-bold">
              Music and worship
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              Suggest a gospel song, report a playback issue, or share an idea that could improve your listening experience.
            </p>

            <RouterLink
              to="/#library"
              class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition hover:text-violet-200"
            >
              Explore the library
              <Music2 :size="16" />
            </RouterLink>

          </div>

          <!-- COMMUNITY CARD -->
          <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-6 sm:p-8">

            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
              <MessageCircle :size="22" />
            </div>

            <h2 class="mt-5 text-xl font-bold">
              Your voice matters
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              GospelHub welcomes your ideas and feedback. Together, we can make gospel music more accessible.
            </p>

          </div>

        </aside>

        <!-- CONTACT FORM -->
        <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b1830] to-[#11111a] p-6 shadow-2xl sm:p-9">

          <!-- FORM HEADING -->
          <div class="mb-7">

            <p class="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              CONTACT FORM
            </p>

            <h2 class="mt-2 text-2xl font-black sm:text-3xl">
              Send us a message
            </h2>

            <p class="mt-2 text-sm leading-6 text-slate-400">
              Fill in the details below and we'll be ready to help.
            </p>

          </div>

          <!-- SUCCESS MESSAGE -->
          <div
            v-if="submitted"
            role="status"
            aria-live="polite"
            class="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200"
          >
            <CheckCircle2 :size="20" class="mt-0.5 shrink-0" />

            <div>
              <p class="font-bold">
                Message sent successfully!
              </p>

              <p class="mt-1 text-emerald-200/80">
                Thank you for contacting GospelHub. Your message has been received.
              </p>
            </div>
          </div>

          <!-- ERROR MESSAGE -->
          <div
            v-if="errorMessage"
            role="alert"
            aria-live="assertive"
            class="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
          >
            <AlertCircle :size="20" class="mt-0.5 shrink-0" />

            <div>
              <p class="font-bold">
                Unable to send message
              </p>

              <p class="mt-1">
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <!-- FORM -->
          <form class="space-y-5" @submit.prevent="submitMessage" novalidate>

            <!-- NAME AND EMAIL -->
            <div class="grid gap-5 sm:grid-cols-2">

              <label class="block">

                <span class="mb-2 block text-sm font-semibold text-slate-300">
                  Your name
                </span>

                <input
                  v-model.trim="form.name"
                  type="text"
                  name="name"
                  required
                  maxlength="100"
                  autocomplete="name"
                  placeholder="Enter your name"
                  :disabled="loading"
                  class="w-full rounded-xl border border-white/10 bg-[#0d0d14]/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-400 disabled:opacity-50"
                />

              </label>

              <label class="block">

                <span class="mb-2 block text-sm font-semibold text-slate-300">
                  Email address
                </span>

                <input
                  v-model.trim="form.email"
                  type="email"
                  name="email"
                  required
                  maxlength="254"
                  autocomplete="email"
                  placeholder="you@example.com"
                  :disabled="loading"
                  class="w-full rounded-xl border border-white/10 bg-[#0d0d14]/70 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-400 disabled:opacity-50"
                />

              </label>

            </div>

            <!-- SUBJECT -->
            <label class="block">

              <span class="mb-2 block text-sm font-semibold text-slate-300">
                What is this about?
              </span>

              <select
                v-model="form.subject"
                name="subject"
                required
                :disabled="loading"
                class="w-full rounded-xl border border-white/10 bg-[#0d0d14] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-violet-400 disabled:opacity-50"
              >
                <option>General question</option>
                <option>Suggest a gospel song</option>
                <option>Report a technical issue</option>
                <option>Partnership or collaboration</option>
                <option>Feedback</option>
              </select>

            </label>

            <!-- MESSAGE -->
            <label class="block">

              <span class="mb-2 block text-sm font-semibold text-slate-300">
                Your message
              </span>

              <textarea
                v-model="form.message"
                name="message"
                required
                minlength="10"
                maxlength="3000"
                rows="6"
                placeholder="Tell us how we can help..."
                :disabled="loading"
                class="w-full resize-y rounded-xl border border-white/10 bg-[#0d0d14]/70 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-600 focus:border-violet-400 disabled:opacity-50"
              ></textarea>

              <div class="mt-2 flex justify-between text-xs text-slate-500">
                <span>Minimum 10 characters</span>
                <span :class="messageLength > 3000 ? 'text-red-400' : ''">
                  {{ messageLength }}/3000
                </span>
              </div>

            </label>

            <!-- SUBMIT BUTTON -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">

              <button
                type="submit"
                :disabled="loading || !canSubmit"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3.5 font-bold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-[#171629] sm:w-auto"
              >

                <LoaderCircle
                  v-if="loading"
                  :size="18"
                  class="animate-spin"
                />

                <Send
                  v-else
                  :size="17"
                />

                {{ loading ? 'Sending message...' : 'Send message' }}

              </button>

              <button
                v-if="submitted"
                type="button"
                @click="resetForm"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <RefreshCw :size="16" />
                Send another message
              </button>

            </div>

            <p class="text-xs leading-5 text-slate-500">
              Your message will be securely submitted to the GospelHub server for review.
            </p>

          </form>

        </div>

      </section>

    </main>

    <!-- FOOTER -->
    <footer class="border-t border-white/10">

      <div class="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">

        <RouterLink to="/" class="font-bold text-slate-300">
          Gospel<span class="text-violet-400">Hub</span>
        </RouterLink>

        <p>
          © {{ new Date().getFullYear() }} GospelHub. Let every song bring hope.
        </p>

        <RouterLink
          to="/"
          class="transition hover:text-violet-300"
        >
          Back to home ↑
        </RouterLink>

      </div>

    </footer>

  </div>
</template>
  