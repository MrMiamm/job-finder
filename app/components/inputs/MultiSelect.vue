<template>
  <div ref="root" class="relative w-50">
    
    <!-- Trigger -->
    <button
      type="button"
      @click="toggleDropdown"
      class="
        relative flex flex-row gap-2 items-center justify-between
        text-dark-input bg-light-input shadow-sm
        py-4 px-4 rounded-2xl cursor-pointer
        border font-quicksand-medium
        transition-all ease-in-out duration-300 w-full
      "
      :class="{
        'border-secondary-bg-hover': isOpen,
        'border-light': !isOpen
      }"
    >
      <slot />
      <span class="truncate text-sm">
        {{ selectedLabels || placeholder || 'Select options' }}
      </span>
      <Icon 
        name="teenyicons:down-small-outline" 
        size="24" 
        class="w-4 h-4 shrink-0 transition-transform duration-200" 
        :class="{ 'rotate-180': isOpen }" 
      />
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="
          absolute z-20 mt-1 w-full bg-light-input text-dark-input border border-secondary-bg-hover
          rounded-lg shadow-lg max-h-60 overflow-auto
        "
      >
        <div
          v-for="option in options"
          :key="option"
          @click="toggleOption(option)"
          class="flex items-center gap-3 px-4 py-2 cursor-pointer text-sm
                 hover:bg-dark/5 transition"
          :class="{
            'bg-primary-input-bg!': isSelected(option)
          }"
        >
          <!-- Checkbox -->
          <div
            class="text-primary w-4 h-4 rounded border border-dark/25 flex items-center justify-center
                   transition"
            :class="isSelected(option)
              ? 'bg-primary-bg'
              : 'bg-light'"
          >
            <Icon v-if="isSelected(option)" name="teenyicons:tick-small-outline" size="24" class="w-3 h-3" /> 
          </div>

          {{ option }}
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  options: string[]
  placeholder?: string
  keyToggle?: string
}>()

const model = defineModel<string[]>({default: []})

const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const isSelected = (value: string) => {
  return model.value.includes(value)
}

const toggleOption = (value: string) => {
  const newValue = [...model.value]
  const index = newValue.indexOf(value)

  if (index === -1) newValue.push(value)
  else newValue.splice(index, 1)

  model.value = newValue
}

const selectedLabels = computed(() => {
  return props.options
    .filter(o => model.value.includes(o))
    .join(', ')
})

const handleClickOutside = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.repeat) return
  if (e.key === 'Enter') {
    e.preventDefault()
    isOpen.value = false
  }
  if (e.key === props.keyToggle) {
    // Blur le champ actuellement actif
    (document.activeElement as HTMLElement)?.blur()
    toggleDropdown()
  }
}
useKeydown(onKeydown)

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>