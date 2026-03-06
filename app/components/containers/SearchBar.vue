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
      @click="submit"
    >
      Rechercher
      <Icon class="absolute bottom-2 right-2" name="icon-park-twotone:enter-key" size="12" />
    </InputsButtonIcon>
  </ContainersRow>
</template>

<script lang="ts" setup>
import { EnumContract } from '~~/shared/enums';
import type { SearchResult, TypeJob } from '~~/shared/types';

const animateButton = ref(false)
const isButtonDisabled = ref(false)
const search = ref<string>("")
const location = ref<string>("")
const contracts = ref<string[]>([])

const model = defineModel<SearchResult>()
model.value = {
  status: 'idle',
  jobs: []
}

/**
 * La fonction submit() permet de lancer une recherche d'offres d'emploi
 * en fonction des paramètres de recherche définis dans les champs de
 * formulaire : métier, localisation et type de contrat.
 * La fonction met à jour le modèle de recherche avec les offres d'emploi
 * trouvées.
 */
async function submit() {
  isButtonDisabled.value = true

  const { status, data } = await useLazyFetch<TypeJob[]>(`/api/jobs/${search.value || 'all'}`, {
    query: { 
      location: location.value, 
      contract: contracts.value.join(',') 
    },
  })
  
  model.value = {
    status: status.value,
    jobs: data.value
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

    // Lancer la recherche
    submit()
  }
}

/*******************************************************************************************/

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
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>