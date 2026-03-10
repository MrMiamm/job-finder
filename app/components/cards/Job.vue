<template>
  <NuxtLink 
    :to="job.link"
    target="_blank"
    class="
      group flex flex-row rounded-lg w-full
      text-dark bg-secondary-bg/50 hover:bg-secondary-bg-hover
      border border-light-input hover:border-secondary-bg-hover
      transition-all ease-in-out duration-300 cursor-pointer
    "
  >
    <NuxtImg 
      v-if="job.img"
      :src="job.img" 
      :alt="`Image de l'entreprise ${job.company}`" 
      class="p-8 w-48 h-48 object-contain rounded-l-lg group-hover:scale-95 transition-all ease-in-out duration-300 drop-shadow-md" 
    />
    <span v-else class="w-48 h-48" />
    <div class="flex flex-col px-4 py-2 justify-center">
      <Title2 class="group-hover:underline">{{ job.title }}</Title2>
      <Title3>{{ job.company }}</Title3>
      <div class="flex flex-row gap-1 flex-wrap mt-2">
        <Badge icon="teenyicons:contract-outline">{{ job.contractType }}</Badge>
        <Badge icon="teenyicons:pin-outline">{{ job.location }}</Badge>
        <Badge v-if="job.timeSincePosted" icon="teenyicons:calendar-outline">{{ job.timeSincePosted }}</Badge>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import type { TypeJob } from '#shared/types'

defineProps<{
  job: TypeJob
}>()
</script>