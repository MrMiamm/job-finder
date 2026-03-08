<template>
  <ContainersRow class="bg-secondary-bg justify-center py-2">

    <InputsField 
      v-model="search"
      id="job-title" 
      name="Métier" 
      icon="mdi:compass-outline" 
      placeholder="Métier, entreprise, ..." 
    />
    <InputsField 
      v-model="location"
      id="job-location" 
      name="Métier" 
      icon="teenyicons:pin-outline" 
      placeholder="Paris, Toulouse, ..." 
    />
    <InputsMultiSelect 
      v-model="contracts"
      :options="[
        EnumContract.CDI,
        EnumContract.CDD,
        EnumContract.Alternance,
        EnumContract.Stage
      ]"
      placeholder="Type de contrat" 
    />

    <InputsButtonIcon 
      ref="searchButton"
      class="relative shadow-sm" 
      :class="{ 'anim-button': animateButton }"
      transition="scale" 
      icon="teenyicons:search-outline"
      :isDisabled="isButtonDisabled"
      @click="submit(1)"
    >
      Rechercher
      <Icon class="absolute bottom-2 right-2" name="icon-park-twotone:enter-key" size="12" />
    </InputsButtonIcon>
  </ContainersRow>
</template>

<script lang="ts" setup>
import { EnumContract } from '~~/shared/enums';
import type { ApiResponse, SearchResult } from '~~/shared/types';

const animateButton = ref(false)
const isButtonDisabled = ref(false)
const search = ref<string>("")
const location = ref<string>("")
const contracts = ref<string[]>([])

const props = defineProps<{
  nbJobsPerPage: number
}>()

const resultModel = defineModel<SearchResult>('result')
const pageModel = defineModel<number>('page', {
  default: 0
})

/**
 * La fonction submit() permet de lancer une recherche d'offres d'emploi
 * en fonction des paramètres de recherche définis dans les champs de
 * formulaire : métier, localisation et type de contrat.
 * La fonction met à jour le modèle de recherche avec les offres d'emploi
 * trouvées.
 */
async function submit(page: number) {
  isButtonDisabled.value = true

  pageModel.value = page

  const { status, data } = await useLazyFetch<ApiResponse>(`/api/jobs/${search.value || 'all'}`, {
    method: 'POST',
    body: {
      location: location.value,
      contracts: contracts.value,
      limit: props.nbJobsPerPage,
      page
    },
  })
  
  resultModel.value = {
    status: status.value,
    jobs: data.value?.jobs || [],
    nbTotalJobs: data.value?.nbJobs || 0
  }

  isButtonDisabled.value = false
}

/**
 * Fonction appelée lorsque l'utilisateur appuie sur la touche Entrée
 * Elle lance la recherche des offres d'emploi
 * @param {KeyboardEvent} e - L'événement de touche
 */
function onPressEnter(e: KeyboardEvent) {
  if (e.key === 'Enter' && !isButtonDisabled.value) {
    animateButton.value = true

    setTimeout(() => {
      animateButton.value = false
    }, 200) 

    submit(1)
  }
}

/*******************************************************************************************/

watch(pageModel, (page) => {
  submit(page)
})

onMounted(() => {
  document.addEventListener('keydown', onPressEnter)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onPressEnter)
})
</script>

<style scoped>
/*Animation du bouton rechercher lors du clic sur la touche Entrée*/
.anim-button {
  animation: scale-in 0.2s ease-in-out;
}
@keyframes scale-in {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
    box-shadow: none;
  }
  100% {
    transform: scale(1);
  }
}
</style>