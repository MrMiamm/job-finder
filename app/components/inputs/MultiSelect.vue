<template>
  <div ref="root" class="relative w-64">
    
    <!-- Trigger -->
    <button
      type="button"
      @click="toggleDropdown"
      class="
        flex flex-row gap-2 items-center
        text-dark bg-light shadow-sm
        py-4 px-4 rounded-2xl cursor-pointer
        border border-[#00000000] font-quicksand-medium
        transition-all ease-in-out duration-300
      "
      :class="{
        'border-secondary-bg-hover': isOpen
      }"
    >
      <span class="truncate text-sm">
        {{ selectedLabels || placeholder || 'Select options' }}
      </span>
      <Icon name="teenyicons:down-small-outline" size="24" class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
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
          absolute z-20 mt-1 w-full bg-light text-dark border border-secondary-bg-hover
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
            'bg-primary-bg! text-primary': isSelected(option)
          }"
        >
          <div
            class="w-4 h-4 rounded border flex items-center justify-center
                   transition"
            :class="isSelected(option)
              ? 'bg-primary border-primary'
              : 'border-secondary-bg-hover bg-primary-bg'"
          >
            <Icon v-if="isSelected(option)" name="teenyicons:tick-small-outline" size="24" class="w-3 h-3 text-white" /> 
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

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>