<script setup>
import { store } from '../store'
import { ref, watchEffect, onMounted } from 'vue'
import { refresh } from '../composables/auth'

const timeLeft = ref(undefined)
const currentTime = ref(Date.now())

watchEffect(() => {
  if(store.pangeaSession) {
    const secondsLeft = (new Date(store.pangeaSession.user?.active_token?.expire) - currentTime.value) / 1000
    const days = Math.floor(secondsLeft / 60 / 60 / 24)
    const hours = Math.floor(secondsLeft / 60 / 60 - days * 24)
    const minutes = Math.floor(secondsLeft / 60 - days * 24 * 60 - hours * 60)
    const seconds = Math.floor(secondsLeft - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60)
    timeLeft.value = {
      days,
      hours,
      minutes,
      seconds
    }
  }
})

onMounted(() => {
  setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})
</script>

<template>
  <div v-if="store.pangeaSession">
    Session expires in
    <span v-if="timeLeft.days">{{ timeLeft.days.toLocaleString('en-US', { minimumIntegerDigits: 2 }) }}d : </span>
    <span v-if="timeLeft.hours">{{ timeLeft.hours.toLocaleString('en-US', { minimumIntegerDigits: 2 }) }}h : </span>
    <span v-if="timeLeft.minutes">{{ timeLeft.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2 }) }}m : </span>
    {{ timeLeft.seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 }) }}s
    <button @click="refresh">Refresh</button>
    <!-- <button class="icon" @click="refresh"><img alt="Refresh button" src="/src/assets/refresh.svg"></button> -->
  </div>
  <div v-else>
    You are not signed in.
  </div>
</template>

<style scoped>
div {
  padding: 0;
  text-align: right;
}
button {
  border-width: 1px;
  border-color: rgb(188, 122, 226, 0);
  padding: 0.2em 0.4em;
  background: none;
  color: rgb(85, 27, 118);
  cursor: pointer;
}

button:hover {
  border-radius: 0.3em;
  border-color: rgb(188, 122, 226);
  background: rgb(204, 145, 238);
}
button.icon {
  color: white;
  border-radius: 0.5em;
  border-color: rgb(188, 122, 226);
  border-width: 1px;
  padding: 0.1em;
}
button img {
  height: 1em;
}
</style>
