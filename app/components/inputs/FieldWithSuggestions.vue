<template>
  <div class="relative">
    <Field
      v-bind="props"
      v-model="model"
      v-model:is-focused="isFocused"
      @keydown="handleKeydown"
    />

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isFocused && model && model.length >= nbCharForSuggestion && suggestions && suggestions.length > 0"
        class="absolute z-20 mt-1 w-full bg-light-input text-dark-input border border-secondary-bg-hover rounded-lg shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="(suggestion, i) in suggestions"
          :key="suggestion"
          @mousedown.prevent="selectSuggestion(i, 'mouse')"
          class="flex items-center gap-3 px-4 py-2 cursor-pointer text-sm transition"
          :class="{
            'bg-dark/10': i === activeIndex,
            'hover:bg-dark/5': i !== activeIndex
          }"
        >
          {{ fullSuggestionText(i) }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import Field from './Field.vue'

const props = withDefaults(defineProps<{
  icon?: string
  placeholder?: string
  blacklist?: string
  suggestions?: string[]
  nbCharForSuggestion?: number
  class?: string
}>(), {
  nbCharForSuggestion: 2
}) 

const model = defineModel<string>()
const isFocused = defineModel<boolean>('is-focused', { default: false })
// Recherche avant le dernier mot
const searchBeforeLastWord = computed(() => {
  if (!model.value) return '';
  return model.value.split(' ').slice(0, -1).join(' ')
});

const activeIndex = ref(-1)

/*********************************************************/

function handleKeydown(e: KeyboardEvent) {
  if (!props.suggestions?.length) return

  switch (e.key) {
    case 'ArrowDown':
    case 'Tab':
      e.preventDefault()
      activeIndex.value =
        (activeIndex.value + 1) % props.suggestions.length
      break

    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value =
        activeIndex.value <= 0
          ? props.suggestions.length - 1
          : activeIndex.value - 1
      break

    case 'Enter':
    case ' ':
      if (activeIndex.value >= 0) {
        e.preventDefault()
        e.stopPropagation()
        selectSuggestion(activeIndex.value, 'keyboard')
      }
      break
  }
}

function fullSuggestionText(index: number) {
  const suggestion = props.suggestions?.[index]
  if (!suggestion) return
  const lastWord = searchBeforeLastWord.value.split(' ').pop() || ''
  return `${suggestion.toLowerCase().includes(searchBeforeLastWord.value.toLowerCase()) ? '' : searchBeforeLastWord.value} ${(lastWord === suggestion) ? '' : suggestion}`.trim()
}

function selectSuggestion(index: number, source: 'mouse' | 'keyboard') {
  model.value = fullSuggestionText(index)
  activeIndex.value = -1

  if (source === 'mouse') {
    isFocused.value = false
  } else {
    isFocused.value = true
  }
}

watch(model, () => {
  activeIndex.value = -1
})
</script>