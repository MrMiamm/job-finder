<template>
  <Icon 
    class="absolute -top-1 -right-1 z-5"
    :name="name" 
    :size="12" 
  />
</template>

<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>