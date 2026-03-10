<template>
  <div id="app" class="flex flex-col w-screen min-h-screen bg-light text-dark font-quicksand-regular">
    <header class="flex flex-row items-center jsutify-between w-full pl-4 pr-6 py-6 text text-primary bg-primary-bg">
      <AppIcon />
      <button 
        class="group flex items-center justify-center p-3 w-12 h-12 text-primary bg-primary-bg ml-auto cursor-pointer rounded-2xl hover:shadow-sm hover:bg-primary-bg-hover active:shadow-none active:scale-95 transition-all ease-in-out duration-300" 
        @click="toggleTheme"
      >
        <ClientOnly>
          <Icon 
            :name="colorMode.value === 'dark' ? 'teenyicons:sun-outline' : 'teenyicons:moon-outline'" 
            size="24" 
            class="w-4 h-4"
          />
        </ClientOnly>
      </button>
    </header>
    <main class="grow relative px-4 py-6">
      <slot />
    </main>
    <footer class="bg-secondary-bg text-secondary flex justify-center items-center gap-4 min-h-50">
      <AppIcon />
      <ul>
        <li><PageLink to="/legal">Mentions légales</PageLink></li>
        <li><PageLink to="/about">À propos</PageLink></li>
      </ul>
    </footer>
  </div>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>