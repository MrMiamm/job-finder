<template>
  <button 
    class="
      group flex flex-row items-center justify-center text-center gap-1
      text-primary bg-primary-bg hover:bg-primary-bg-hover 
      py-2 px-4 rounded-2xl cursor-pointer font-quicksand-medium
      transition-all ease-in-out duration-300
      hover:shadow-sm active:shadow-none
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
    :class="{
      'active:translate-y-0.5': transition === 'translate',
      'active:scale-95': transition === 'scale'
    }"
    :disabled="isDisabled"
  >
    <slot />
  </button>
</template>


<script lang="ts" setup>
export type TransitionButtonType = 'translate' | 'scale'

withDefaults(defineProps<{
  transition?: TransitionButtonType
  isDisabled?: boolean
}>(), {
  transition: 'translate',
  isDisabled: false
})
</script>