<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 max-w-7xl gap-2">
    <Job v-for="(job, index) in jobs" :key="index" :job="job" />
  </div>
</template>

<script lang="ts" setup>
import type { TypeJob } from '#shared/types'
import Job from '../cards/Job.vue';

defineProps<{
  jobs: TypeJob[]
}>()
</script>