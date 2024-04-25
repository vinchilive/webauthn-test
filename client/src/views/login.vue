<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUser } from '../core/user'
import { useRouter } from 'vue-router'
import { browserSupportsWebAuthn } from '@simplewebauthn/browser'

const router = useRouter()
const { user, login: userLogin, passkeyLogin } = useUser()

const email = ref('')
const password = ref('')

const isWebauthnEnabled = computed(() => browserSupportsWebAuthn())

async function login() {
  await userLogin({ email: email.value, password: password.value })
  redirect()
}

async function passkey() {
  await passkeyLogin({ email: email.value })
  redirect()
}

function redirect() {
  if (user.value) {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <form class="flex flex-col space-y-2">
    <input
      class="border rounded-md p-1 border-black/50"
      type="email"
      autocomplete="username"
      v-model="email"
    />
    <input
      class="border rounded-md p-1 border-black/50"
      type="password"
      autocomplete="current-password"
      v-model="password"
    />
  </form>
  <div class="flex space-x-2">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="login"
    >
      Login
    </button>
    <button
      v-if="isWebauthnEnabled"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="passkey"
    >
      Passkey
    </button>
  </div>
  <div class="flex items-center justify-center mt-2 underline">
    <router-link :to="{ name: 'registration' }">Registration</router-link>
  </div>
</template>
