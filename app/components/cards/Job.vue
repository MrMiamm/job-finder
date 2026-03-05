<template>
  <NuxtLink 
    :to="job.link"
    target="_blank"
    class="
      group flex flex-row rounded-lg 
      text-dark bg-secondary-bg hover:bg-secondary-bg-hover
      border border-[#00000000] hover:border-secondary-bg-hover
      transition-all ease-in-out duration-300 cursor-pointer
    "
  >
    <NuxtImg 
      v-if="job.img"
      :src="job.img" 
      alt="Job Image" 
      class="p-8 w-48 h-48 object-cover rounded-l-lg group-hover:scale-95 transition-all ease-in-out duration-300" 
    />
    <span v-else class="w-48 h-48" />
    <div class="flex flex-col px-4 py-2 justify-center">
      <Title2 class="group-hover:underline">{{ job.title }}</Title2>
      <Title3>{{ job.company }}</Title3>
      <div class="flex flex-row gap-1 flex-wrap mt-2">
        <Badge icon="teenyicons:contract-outline">{{ job.contractType }}</Badge>
        <Badge icon="teenyicons:pin-outline">{{ job.location }}</Badge>
        <Badge icon="teenyicons:calendar-outline">{{ job.timeSincePosted }}</Badge>
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