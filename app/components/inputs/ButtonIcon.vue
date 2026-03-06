<template>
  <Button :transition="transition" :isDisabled="isDisabled">
    <Icon :name="icon" :size="24"/>
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button, { type TransitionButtonType } from './Button.vue';

withDefaults(defineProps<{
  icon: string;
  transition?: TransitionButtonType
  isDisabled?: boolean
}>(), {
  transition: 'translate',
  isDisabled: false
})
</script>