<template>
  <span 
    class="
      relative flex flex-row gap-2 items-center
      text-dark-input bg-light-input shadow-sm
      py-4 px-4 rounded-2xl cursor-text
      border border-light
      transition-all ease-in-out duration-300
    "
    :class="{
      'border-secondary-bg': isFocused
    }"
    @click="focusInput"
  >
    <Icon v-if="icon" :name="icon" size="24" />
    <input 
      ref="input" 
      type="text" 
      :placeholder="placeholder" 
      class="appearance-none outline-none w-full" 
      v-model="model"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <slot />
    </input>
  </span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon?: string
  placeholder?: string
  blacklist?: string
}>()

const model = defineModel<string>()
const isFocused = defineModel<boolean>('is-focused', {default: false})
const input = ref<HTMLInputElement>()

/*********************************************************************************/

// Blacklist de chaque caractères interdits.

watch(model, (val) => {
  if (!props.blacklist || !val) return
  const regex = new RegExp(`[${props.blacklist}]`, 'g')
  const newVal = val.replace(regex, '')
  if (newVal !== val) {
    model.value = newVal
  }
})

watch(isFocused, (val) => {
  if (val) {
    input.value?.focus()
  } else {
    input.value?.blur()
  }
})

function focusInput() {
  input.value?.focus()
}
</script>