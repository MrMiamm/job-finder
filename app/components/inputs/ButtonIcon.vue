<template>
  <Button :transition="transition">
    <Icon :name="icon" :size="24"/>
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button, { type TransitionButtonType } from './Button.vue';

withDefaults(defineProps<{
  icon: string;
  transition?: TransitionButtonType
}>(), {
  transition: 'translate'
})
</script>