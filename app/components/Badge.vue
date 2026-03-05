<template>
  <div class="
      flex flex-row items-center justify-center gap-1 
      bg-primary-bg-hover px-2 py-1 rounded-full 
      font-quicksand-light text-lg
      border border-primary-bg
    "
  >
    <Icon v-if="icon" :name="icon" :size="16" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  icon?: string
}>()
</script>
