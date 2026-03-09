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
      :class="{ 'animate-key-button': animateButton }"
      transition="scale" 
      icon="teenyicons:search-outline"
      :isDisabled="isButtonDisabled"
      @click="submit(1)"
    >
      Rechercher
      <Icon class="absolute -top-1 -right-1" name="icon-park-twotone:enter-key" size="12" />
    </InputsButtonIcon>
  </ContainersRow>
</template>

<script lang="ts" setup>
import { EnumContract } from '~~/shared/enums';
import type { ApiSearchResult, SearchResult } from '~~/shared/types';

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

  resultModel.value = {
    jobs: resultModel.value ? resultModel.value.jobs : [],
    nbTotalJobs: resultModel.value ? resultModel.value.nbTotalJobs : 0,
    status: 'loading',
  }

  const data = await $fetch<ApiSearchResult>(`/api/jobs/${search.value || 'all'}`, {
    method: 'POST',
    body: {
      location: location.value,
      contracts: contracts.value,
      limit: props.nbJobsPerPage,
      page
    },
  })
  
  resultModel.value = {
    jobs: data.jobs || [],
    nbTotalJobs: data.nbTotalJobs || 0,
    status: data.success ? 'success' : data.error ? 'error' : 'idle',
  }

  isButtonDisabled.value = false
}

/**
 * Fonction appelée lorsque l'utilisateur appuie sur la touche Entrée
 * Elle lance la recherche des offres d'emploi
 * @param {KeyboardEvent} e - L'événement de touche
 */
function onPressEnter(e: KeyboardEvent) {
  if (e.repeat) return
  if (e.key === 'Enter' && !isButtonDisabled.value) {
    animateButton.value = true

    setTimeout(() => {
      animateButton.value = false
    }, 200) 

    submit(1)
  }
}
useKeydown(onPressEnter)

/*******************************************************************************************/

watch(pageModel, (page) => {
  submit(page)
})
</script>