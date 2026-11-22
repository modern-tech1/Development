<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AudioLines, LockKeyhole, Mail, ArrowLeft, LoaderCircle } from 'lucide-vue-next'
import api from '../services/api'
const router = useRouter(), email = ref(''), password = ref(''), error = ref(''), loading = ref(false)
async function login() { error.value = ''; loading.value = true; try { const { data } = await api.post('/auth/login', { email: email.value, password: password.value }); localStorage.setItem('gospelhub_token', data.token); localStorage.setItem('gospelhub_admin', JSON.stringify(data.admin)); router.push('/admin') } catch (e) { error.value = e.response?.data?.message || 'Unable to sign in. Check that the API is running.' } finally { loading.value = false } }
</script>
<template>
    <main class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0d14] px-4 py-12 text-slate-100">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,#6d28d933,transparent_40%),radial-gradient(ellipse_at_90%_80%,#4338ca22,transparent_40%)]">
        </div>
        <section class="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#171721]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
            <a href="/" class="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft :size="16"/> Back to website</a>
            <div class="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-white"><AudioLines :size="25"/></div>
            <p class="text-xs font-bold uppercase tracking-[.22em] text-violet-300">GOSPELHUB CONTROL</p><h1 class="mt-2 text-3xl font-black">Welcome back.</h1><p class="mt-2 text-sm leading-6 text-slate-400">Sign in to manage your gospel music and video library.</p><form class="mt-8 space-y-5" @submit.prevent="login"><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-300">Admin email</span><span class="relative block"><Mail :size="17" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/><input v-model="email" type="email" autocomplete="username" required class="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 outline-none focus:border-violet-400" placeholder="admin@example.com"/></span></label><label class="block"><span class="mb-2 block text-sm font-semibold text-slate-300">Password</span><span class="relative block"><LockKeyhole :size="17" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/><input v-model="password" type="password" autocomplete="current-password" required class="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 outline-none focus:border-violet-400" placeholder="Enter your password"/></span></label><p v-if="error" class="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{{ error }}</p><button :disabled="loading" class="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-3.5 font-bold text-white transition hover:bg-violet-400 disabled:opacity-60"> 
    <LoaderCircle v-if="loading" class="animate-spin" :size="18"/> {{ loading ? 'Signing in...' : 'Sign in to dashboard' }}</button>
    </form><p class="mt-6 text-center text-xs leading-5 text-slate-500">Admin accounts are created from the backend terminal. There is no public admin registration.</p>
    </section>
</main>
    </template>