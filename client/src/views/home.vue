<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUser } from '../core/user'

const router = useRouter()
const { user, logout: userLogout, passkeyRegistration } = useUser()

async function logout() {
  await userLogout()

  if (!user.value) {
    router.push({ name: 'login' })
  }
}

async function passkey() {
  const response = await passkeyRegistration()

  console.log(response)
}
</script>

<template>
  <div>
    Welcome
    <b>{{ user?.email }}</b>
  </div>
  <div>Passkey devices: {{ user?.devices.length }}</div>
  <div class="flex space-x-2">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="passkey"
    >
      Passkey
    </button>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>
