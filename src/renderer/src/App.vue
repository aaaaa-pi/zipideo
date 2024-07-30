<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Copyright from './components/Copyright.vue'
</script>

<template>
  <main>
    <Navbar />
    <RouterView />
    <Copyright class="mt-3 mb-3" />
  </main>
</template>
