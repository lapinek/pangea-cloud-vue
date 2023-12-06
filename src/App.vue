<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <a href="https://pangea.cloud" target="_blank"><img class="logo" src="/pangea-logo.svg" alt="Pangea Logo" /></a>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/action">Action</RouterLink>
    </nav>
    <a href=""></a>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
}

header a {
  display: flex;
  align-items: center;
}

nav {
  font-size: 1.2em;
  gap: 16px;
  justify-content: center;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

main {
  padding: 12px;
  border-top: 1px solid #727A92;
}
</style>
