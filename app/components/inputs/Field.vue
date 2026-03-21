<template>
  <span 
    class="
      relative flex flex-row gap-2 items-center
      text-dark-input bg-light-input shadow-sm
      py-4 pl-4 pr-12 rounded-2xl cursor-text
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
      class="appearance-none outline-none w-full placeholder:text-dark-input/55" 
      v-model="model"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <slot />
    </input>
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 translate-x-2"
      enter-to-class="opacity-100 scale-100 translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100 translate-x-0"
      leave-to-class="opacity-0 scale-95 translate-x-2"
    >
      <button 
        v-if="model"
        class="
          absolute right-0 top-0 bottom-0 px-3
          flex items-center justify-center 
          bg-light-input text-dark-input/80 
          hover:text-dark-input
          cursor-pointer rounded-2xl
        "
        @click="model = ''"
      >
        <Icon name="teenyicons:x-small-solid" size="24" />
      </button>
    </transition>
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