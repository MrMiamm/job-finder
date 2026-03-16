<template>
  <!-- Transition Group avec un effet de stagger -->
  <transition-group 
    tag="div" 
    class="grid grid-cols-1 xl:grid-cols-2 max-w-7xl gap-2"
    @before-enter="beforeEnter"
    @enter="enter"
  >
    <Job
      v-for="(job, index) in jobs"
      :key="index"
      :job="job"
      :data-index="index"
    />
  </transition-group>
</template>

<script lang="ts" setup>
import type { TypeJob } from '#shared/types';
import gsap from 'gsap';
import Job from '../cards/Job.vue';

defineProps<{
  jobs: TypeJob[]
}>()

function beforeEnter(el: Element) {
  const elHtml = el as HTMLElement;
  elHtml.style.opacity = '0'
  elHtml.style.transform = 'translateY(30px)'
}

function enter(el: Element) {
  const elHtml = el as HTMLElement;
  gsap.to(elHtml, {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: elHtml.dataset.index ? Number(elHtml.dataset.index) * 0.085 : 0,
    ease: 'power3.out',
    clearProps: 'opacity'
  })
}
</script>