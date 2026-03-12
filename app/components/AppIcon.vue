<template>
  <NuxtLink to="/" class="group hover:underline active:scale-95 transition-all ease-in-out duration-300">
    <Title1 class="flex flex-row items-center gap-1"><Icon name="line-md:compass" :size="48" class="group-hover:animate-spin" />{{ appTitle }}</Title1>
  </NuxtLink>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const appTitle = config.public.APP_TITLE || ''
</script>