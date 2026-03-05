<template>
  <div id="app" class="flex flex-col w-screen min-h-screen bg-light text-dark font-quicksand-regular">
    <header class="w-full px-4 py-6 text bg-primary-bg">
      <Title1 class="flex flex-row items-center gap-1 text-primary"><Icon name="line-md:compass" :size="48" />Job Finder</Title1>
    </header>
    <main class="grow px-4 py-6">
      <slot />
    </main>
    <footer>
      sdf
    </footer>
  </div>
</template>