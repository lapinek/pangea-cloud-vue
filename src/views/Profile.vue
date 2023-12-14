<script setup>
import Profile from '../components/Profile.vue'
import { computed } from 'vue'
import { store } from '../store'

const profile = computed(() => {
  return store.pangeaSession.user.profile
})
</script>

<template>
  <main>
    <Profile :profile="profile" />
  </main>
</template>
