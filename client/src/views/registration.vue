<script setup lang="ts">
import { ref } from 'vue'
import { useUser } from '../core/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user, signup } = useUser()

const email = ref('')
const password = ref('')

async function register() {
  await signup({ email: email.value, password: password.value })

  if (user.value) {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <form class="flex flex-col space-y-2" @submit.prevent="register">
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
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      type="submit"
    >
      Register
    </button>
    <div class="flex items-center justify-center mt-2 underline">
      <router-link :to="{ name: 'login' }">Back</router-link>
    </div>
  </form>
</template>
