<template>
  <NuxtLink class="hover:underline cursor-pointer font-quicksand-semibold" :to="to">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
}>()
</script>