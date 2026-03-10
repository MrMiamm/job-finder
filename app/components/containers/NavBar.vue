<template>
  <div 
    v-if="page && total > 0"
    class="flex flex-row items-center gap-1 w-full max-w-7xl"
    :class="[
      showNbTotalJobs ? 'justify-between' : 'justify-center'
    ]"
  >

    <span
      v-if="showNbTotalJobs"
      class="text-primary bg-primary-bg px-2 py-1 font-quicksand-semibold rounded-full"
      :aria-label="`La recherche retourne ${ total } offre${ total > 1 ? 's' : '' }`"
    >
      {{ total }} offre{{ total > 1 ? 's' : '' }}
    </span>

   <nav class="flex flex-row gap-1 items-center">
      <!-- Précédent -->
      <InputsButtonIcon
        icon-position="left"
        icon="teenyicons:left-small-outline"
        :is-disabled="page <= 1"
        :class="{'animate-key-button': animatePrevious}"
        aria-label="Aller à la page prédédente"
        @click="page--"
      >
        Précédent
        <KeyIcon name="icon-park-twotone:left-square" />
      </InputsButtonIcon>

      <!-- Pages dynamiques -->
      <InputsButtonNormal
        v-for="(p, index) in pagesToShow"
        :key="`page-${p}-${index}`"
        class="border border-[#00000000]"
        :class="{ 'bg-primary-input-bg-hover border-light-input! shadow-sm cursor-auto!': p === page }"
        :aria-label="p === page ? `Page ${p} sur ${lastPage}` : `Aller à la page ${p}`"
        @click="page = p"
      >
        {{ pageDisplay(p) }}
      </InputsButtonNormal>

      <!-- Suivant -->
      <InputsButtonIcon
        icon-position="right"
        icon="teenyicons:right-small-outline"
        :is-disabled="page >= lastPage"
        :class="{'animate-key-button': animateNext}"
        aria-label="Aller à la page suivante"
        @click="page++"
      >
        Suivant
        <KeyIcon name="icon-park-twotone:right-square" />
      </InputsButtonIcon>
    </nav>

    <span v-if="showNbTotalJobs" class="invisible" aria-hidden="true">
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