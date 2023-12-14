<template>
  <main>
    <h1>Profile Page</h1>
    <pre><code>{{ profile }}</code></pre>
  </main>
</template>

<script>
  export default {
    props: [ 'profile' ],
    name: 'Profile'
  }
</script>
