<template>
  <ButtonNormal :transition="transition" :isDisabled="isDisabled" :to="to" :target="target">
    <Icon v-if="iconPosition === 'left'" :name="icon" :size="24"/>
    <slot />
    <Icon v-if="iconPosition === 'right'" :name="icon" :size="24"/>
  </ButtonNormal>
</template>

<script setup lang="ts">
import ButtonNormal, { type TransitionButtonType } from './ButtonNormal.vue';

type IconPostion = 'left' | 'right';

withDefaults(defineProps<{
  icon: string;
  to?: string
  target?: string
  iconPosition?: IconPostion
  transition?: TransitionButtonType
  isDisabled?: boolean
}>(), {
  iconPosition: 'left',
  transition: 'translate',
  isDisabled: false
})
</script>