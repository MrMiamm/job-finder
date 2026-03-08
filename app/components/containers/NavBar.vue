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
      {{ total }} offres
    </span>

    <nav class="flex flex-row gap-1">
      <InputsButtonIcon 
        icon-position="left" 
        icon="teenyicons:left-small-outline" 
        :is-disabled="page <= 1"
        @click="page--"
      >
        Précedent
      </InputsButtonIcon>

      <InputsButton v-if="page-3 > 1" @click="page=1">{{ 1 }}</InputsButton>

      <InputsButton v-if="page-3 > 0" @click="page-=3">{{ page-3 }}</InputsButton>
      <InputsButton v-if="page-2 > 0" @click="page-=2">{{ page-2 }}</InputsButton>
      <InputsButton v-if="page-1 > 0" @click="page-=1">{{ page-1 }}</InputsButton>
      <span 
        class="flex flex-row items-center justify-center text-center gap-1
        text-primary bg-primary-bg-hover border border-primary-bg
        py-2 px-4 rounded-2xl font-quicksand-medium shadow-sm"
      >
        {{ page }} / {{ lastPage }}
      </span>
      
      <InputsButton v-if="page+1 < lastPage" @click="page+=1">{{ page+1 }}</InputsButton>
      <InputsButton v-if="page+2 <= lastPage" @click="page+=2">{{ page+2 }}</InputsButton>
      <InputsButton v-if="page+3 <= lastPage" @click="page+=3">{{ page+3 }}</InputsButton>
      <InputsButton v-if="page-1 < 0 && page+4 <= lastPage" @click="page+=4">{{ page+4 }}</InputsButton>
      <InputsButton v-if="page-2 < 0 && page+5 <= lastPage" @click="page+=5">{{ page+5 }}</InputsButton>
      <InputsButton v-if="page-3 < 0 && page+6 <= lastPage" @click="page+=6">{{ page+6 }}</InputsButton>

      <InputsButton v-if="page < lastPage" @click="page=lastPage">{{ lastPage }}</InputsButton>

      <InputsButtonIcon 
        icon-position="right" 
        icon="teenyicons:right-small-outline" 
        :is-disabled="page >= lastPage"
        @click="page++"
      >
        Suivant
      </InputsButtonIcon>
    </nav>

    <span v-if="showNbTotalJobs" class="invisible">
      {{ total }} offres
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  nbJobsPerPage: number
  showNbTotalJobs?: boolean
}>(), {
  showNbTotalJobs: true
})

const page = defineModel<number | undefined>('page')
const total = defineModel<number>('total', {
  default: 0
})
const lastPage = defineModel<number>('last-page', {
  default: 1
})
</script>