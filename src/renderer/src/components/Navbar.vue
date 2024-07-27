<script setup lang="ts"></script>

<template>
  <main class="text-slate-600 border-b bg-gray-50 flex justify-between px-3 py-2 drag">
    <h5 class="opacity-80" style="font-family: 'Press Start 2P', cursive">zipideo</h5>
    <section class="flex justify-between gap-2 multifont text-xs items-center">
      <router-link :to="{ name: 'home' }">转码</router-link>
      <router-link :to="{ name: 'setting' }">配置</router-link>
    </section>
  </main>
</template>
