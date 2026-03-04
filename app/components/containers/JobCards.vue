<template>
  <ContainersColumn class="grow overflow-y-auto w-200 m-auto">
    <Job v-for="(job, index) in jobs" :key="index" :job="job" />
  </ContainersColumn>
</template>

<script lang="ts" setup>
import type { TypeJob } from '#shared/types'
import Job from '../cards/Job.vue';

defineProps<{
  jobs: TypeJob[]
}>()
</script>