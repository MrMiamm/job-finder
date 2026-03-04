<template>
  <span 
    class="
      flex flex-row gap-2 items-center
      text-dark bg-light shadow-sm
      py-4 px-4 rounded-2xl cursor-text
      border border-[#00000000]
      transition-all ease-in-out duration-300
    "
    :class="{
      'border-secondary-bg-hover': isFocused
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
defineProps<{
  icon?: string
  placeholder?: string
}>()

const model = defineModel<string>()

const input = ref<HTMLInputElement>()
const isFocused = ref(false)

function focusInput() {
  input.value?.focus()
}
</script>