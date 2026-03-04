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
      class="shadow-sm" 
      transition="scale" 
      icon="teenyicons:search-outline"
      @click="submit"
    >
      Rechercher
    </InputsButtonIcon>
  </ContainersRow>
</template>

<script lang="ts" setup>
import type { AsyncDataRequestStatus } from '#app';
import { EnumContract } from '~~/shared/enums';
import type { SearchResult, TypeJob } from '~~/shared/types';

const search = ref<string>("")
const location = ref<string>("")
const contracts = ref<string[]>([])

const model = defineModel<SearchResult>()

async function submit() {

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
}
</script>