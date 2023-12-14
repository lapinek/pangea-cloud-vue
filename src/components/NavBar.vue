<script setup>
import { signIn } from '../composables/auth'
import { useRouter } from 'vue-router'
import { store } from '../store'

const router = useRouter()

const handleSignOut = () => {
  router.push({ name: 'signOut' })
}
</script>

<template>
  <header>
    <div>
      <a href="https://pangea.cloud" target="_blank"><img class="logo" src="/src/assets/pangea-logo.svg" alt="Pangea Logo" rel="noopener noreferrer" /></a>
      +
      <a href="https://vuejs.org" target="_blank"><img height="20" class="logo" src="/src/assets/vue-logo.svg" alt="Vue Logo" rel="noopener noreferrer" /></a>
    </div>
    <nav>
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      <template v-if="store.pangeaSession">
        <RouterLink :to="{ name: 'profile' }">Profile</RouterLink>
        <RouterLink :to="{ name: 'action' }">Action</RouterLink>
      </template>
    </nav>
    <button v-if="!store.pangeaSession" @click="signIn">Sign In</button>
    <button v-if="store.pangeaSession" @click="handleSignOut">Sign Out</button>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #727A92;
  ;
}

header div {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  color: #551B76;
}

header div a {
  padding: 0 0.5em;
}

header div a:first-of-type {
  padding-left: 0;
}

header div a {
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

button {
  background: rgb(85, 27, 118);
  color: white;
  border-radius: 0.5em;
  border-color: rgb(188, 122, 226);
  border-width: 1px;
  padding: 0.4em 0.8em;
  font-size: 1em;
}

button:hover {
  background: rgb(119, 47, 160);
}
</style>
