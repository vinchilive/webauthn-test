<script setup lang="ts">
import { useUser } from './core/user'

const { fetching: fetchingUser } = useUser()
</script>

<template>
  <div
    class="flex w-screen h-screen items-center justify-center flex-col space-y-4"
  >
    <template v-if="fetchingUser">loading...</template>
    <router-view v-else />
  </div>
</template>
