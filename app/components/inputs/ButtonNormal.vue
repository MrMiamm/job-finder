<template>
  <component
    :is="componentType"
    class="
      relative group flex flex-row items-center justify-center text-center gap-1
      text-primary-input bg-primary-input-bg hover:bg-primary-input-bg-hover 
      border border-primary-input-bg
      py-2 px-4 rounded-2xl cursor-pointer font-quicksand-medium
      transition-all ease-in-out duration-300
      hover:shadow-sm active:shadow-none
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
    :class="{
      'active:translate-y-0.5': transition === 'translate',
      'active:scale-95': transition === 'scale',
      'cursor-not-allowed! opacity-50!': isDisabled
    }"
    :to="to"
    :disabled="isDisabled && componentType === 'button'"
    :aria-disabled="isDisabled"
    :tabindex="isDisabled && componentType === NuxtLink ? -1 : 0"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NuxtLink } from '#components'

export type TransitionButtonType = 'translate' | 'scale'

const props = withDefaults(defineProps<{
  transition?: TransitionButtonType
  isDisabled?: boolean
  to?: string
}>(), {
  transition: 'translate',
  isDisabled: false
})

// Choix dynamique du composant
const componentType = computed(() => props.to ? NuxtLink : 'button')

// Gestion clic pour empêcher navigation si disabled
function handleClick(event: MouseEvent) {
  if (props.isDisabled && componentType.value === NuxtLink) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}
</script>