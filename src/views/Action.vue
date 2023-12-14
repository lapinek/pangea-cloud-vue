<script setup>
import Action from '../components/Action.vue'
import { useRoute } from 'vue-router'
import { postAuditLog } from '../composables/api'

const route = useRoute()
const data = {
  actor: 'User',
  action: route.fullPath,
  message: 'User\'s SSN changed.',
  old: '',
  new: '543-21-6789'
}
postAuditLog(data)
</script>

<template>
  <main>
    <Action />
  </main>
</template>
