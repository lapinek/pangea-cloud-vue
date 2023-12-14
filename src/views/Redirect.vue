<script setup>
import { onMounted } from 'vue'
import { redirect } from '../composables/auth'
import Redirect from '../components/Redirect.vue'
import { useRoute, useRouter } from 'vue-router'

async function handleRedirect() {
  const router = useRouter()
  const route = useRoute()

  await redirect(route)

  router.push({ name: 'profile' })
}

onMounted(() => {
  handleRedirect()
})
</script>

<template>
  <main>
    <Redirect />
  </main>
</template>
