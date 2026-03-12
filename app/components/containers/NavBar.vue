<template>
  <div 
    v-if="page && total > 0"
    class="flex flex-col lg:flex-row lg:items-center gap-2 w-full max-w-7xl"
    :class="[
      showNbTotalJobs ? 'justify-between' : 'justify-center'
    ]"
  >

    <span
      v-if="showNbTotalJobs"
      class="text-primary bg-primary-bg px-2 py-1 font-quicksand-semibold rounded-full w-full sm:w-fit"
      :aria-label="`La recherche retourne ${ total } offre${ total > 1 ? 's' : '' }`"
    >
      {{ total }} offre{{ total > 1 ? 's' : '' }}
    </span>

   <nav class="flex flex-row gap-1 items-center self-center w-full sm:w-fit">
      <!-- Précédent -->
      <InputsButtonIcon
        icon-position="left"
        icon="teenyicons:left-small-outline"
        :is-disabled="page <= 1"
        class="grow sm:grow-0 w-20 sm:w-35"
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
        :class="{ 
          'bg-primary-input-bg-hover border-light-input! shadow-sm cursor-auto!': p === page,
          'md:block': device.isDesktop,
          'sm:block': device.isTablet,
          'hidden': p !== page && (device.isDesktop || device.isTablet),
        }"
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
        class="grow sm:grow-0 w-20 sm:w-35"
        :class="{'animate-key-button': animateNext}"
        aria-label="Aller à la page suivante"
        @click="page++"
      >
        Suivant
        <KeyIcon name="icon-park-twotone:right-square" />
      </InputsButtonIcon>
    </nav>

    <span v-if="showNbTotalJobs && !device.isMobile" class="invisible hidden lg:block" aria-hidden="true">
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

const device = useDevice()

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

const PAGES_GAP = device.isTablet ? 1 : 2

// Computed pour générer les pages à afficher
const pagesToShow = computed(() => {
  if (!page.value || !lastPage.value) return []

  const pages: number[] = []

  // Si desktop ou tablet
  if (!device.isMobile) {
    pages.push(1)

    let start = page.value - PAGES_GAP
    let end = page.value + PAGES_GAP

    // Ajuster si on est proche du début
    if (page.value <= PAGES_GAP + 1) {
      start = PAGES_GAP
      end = Math.min((PAGES_GAP * 2) + 2, lastPage.value - 1)
    }

    // Ajuster si on est proche de la fin
    if (page.value >= lastPage.value - PAGES_GAP) {
      start = Math.max(lastPage.value - ((PAGES_GAP * 2) + 1), PAGES_GAP)
      end = lastPage.value - 1
    }

    // Générer les pages de la fenêtre
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Toujours afficher lastPage
    if (lastPage.value > 1) pages.push(lastPage.value)

  // Si mobile
  } else {
    // Afficher seulement la page actuelle
    pages.push(page.value)
  }

  // Supprimer doublons éventuels
  return [...new Set(pages)]
})
</script>