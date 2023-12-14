<script setup>
import { useRouter } from 'vue-router'
import { signOut } from '../composables/auth'
import SignOut from '../components/SignOut.vue'

const router = useRouter()
signOut()
router.push({ name: 'home' })

</script>

<template>
  <main>
    <SignOut />
  </main>
</template>