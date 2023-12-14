<script setup>
import NavBar from './components/NavBar.vue'
import SessionRefresh from './components/SessionRefresh.vue'
</script>

<template>
  <NavBar />
  <SessionRefresh />
  <RouterView />
</template>

<style scoped>
main {
  padding: 0 12px;
}
</style>
