<template>
  <div class="
      flex flex-row items-center justify-center gap-1 
     text-dark bg-secondary-bg px-2 py-1 rounded-full 
      font-quicksand-light text-lg
      border border-light
      shadow-sm
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
