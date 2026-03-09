<template>
  <div 
    v-if="page && total > 0"
    class="flex flex-row items-center gap-1 w-full"
    :class="[
      showNbTotalJobs ? 'justify-between' : 'justify-center'
    ]"
  >

    <span
      v-if="showNbTotalJobs"
      class="text-primary bg-primary-bg p-1 font-quicksand-semibold"
    >
      {{ total }} offre{{ total > 1 ? 's' : '' }}
    </span>

   <nav class="flex flex-row gap-1 items-center">
      <!-- Précédent -->
      <InputsButtonIcon
        icon-position="left"
        icon="teenyicons:left-small-outline"
        :is-disabled="page <= 1"
        class="relative"
        :class="{'animate-key-button': animatePrevious}"
        @click="page--"
      >
        Précédent
        <Icon class="absolute -top-1 -right-1" name="icon-park-twotone:left-square" size="12" />
      </InputsButtonIcon>

      <!-- Pages dynamiques -->
      <InputsButton
        v-for="(p, index) in pagesToShow"
        :key="`page-${p}-${index}`"
        class="border border-[#00000000]"
        :class="{ 'bg-primary-bg-hover border-primary-bg shadow-sm cursor-auto!': p === page }"
        @click="page = p"
      >
        {{ pageDisplay(p) }}
      </InputsButton>

      <!-- Suivant -->
      <InputsButtonIcon
        icon-position="right"
        icon="teenyicons:right-small-outline"
        :is-disabled="page >= lastPage"
        class="relative"
        :class="{'animate-key-button': animateNext}"
        @click="page++"
      >
        Suivant
        <Icon class="absolute -top-1 -right-1" name="icon-park-twotone:right-square" size="12" />
      </InputsButtonIcon>
    </nav>

    <span v-if="showNbTotalJobs" class="invisible">
      {{ total }} offre{{ total > 1 ? 's' : '' }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  nbJobsPerPage: number
  showNbTotalJobs?: boolean
  animatePrevious?: boolean
  animateNext?: boolean
}>(), {
  showNbTotalJobs: true,
  animatePrevious: false,
  animateNext: false
})

const page = defineModel<number | undefined>('page')
const total = defineModel<number>('total', {
  default: 0
})
const lastPage = defineModel<number>('last-page', {
  default: 1
})

function pageDisplay(p: number): string {
  return p === page.value ? `${p}/${lastPage.value}` : p.toString();
}

// Computed pour générer les pages à afficher
const pagesToShow = computed(() => {
  if (!page.value || !lastPage.value) return []

  const pages: number[] = []

  // Toujours afficher 1
  pages.push(1)

  let start = page.value - 2
  let end = page.value + 2

  // Ajuster si on est proche du début
  if (page.value <= 3) {
    start = 2
    end = Math.min(5, lastPage.value - 1)
  }

  // Ajuster si on est proche de la fin
  if (page.value >= lastPage.value - 2) {
    start = Math.max(lastPage.value - 4, 2)
    end = lastPage.value - 1
  }

  // Générer les pages de la fenêtre
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Toujours afficher lastPage
  if (lastPage.value > 1) pages.push(lastPage.value)

  // Supprimer doublons éventuels
  return [...new Set(pages)]
})
</script>