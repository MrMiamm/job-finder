<template>
  <ContainersBasicCard 
    class="xl:absolute top-1/2 left-1/2 xl:-translate-1/2 xl:backdrop-blur-sm max-w-180"
  > 
    <Title1>À propos du projet</Title1>
    <p class="mt-2">
      Ce moteur d'offres d'emploi est un projet personnel visant à faciliter la recherche d'offres d'emploi.<br class="mb-1">
      Les offres d'emploi sont récupérées via des APIs ou contenus statiques des entreprises accessibles publiquement.<br class="mb-1">
      Les logos et contenus des offres appartiennent aux entreprises respectives et aucun droit n'est revendiqué sur ces contenus.<br class="mb-1">
      Aucune donnée personnelle n'est collectée par ce site.
    </p>
  </ContainersBasicCard>
  
  <ContainersBasicCard 
    class="
      xl:absolute top-1/2 left-1/2
      xl:-translate-x-1/2 xl:-translate-y-1/2
      xl:translate-x-20 xl:-translate-y-55
      xl:backdrop-blur-sm
      mt-2 xl:mt-0 xl:shadow-xl
    "
  >
    <Title1>Liens externes</Title1>
    <ContainersRow class="mt-2">
      <InputsButtonIcon icon="teenyicons:code-outline" to="https://william-cheron.pro/" target="_blank">Portfolio</InputsButtonIcon>
      <InputsButtonIcon icon="teenyicons:github-outline" to="https://github.com/MrMiamm" target="_blank">Github</InputsButtonIcon>
      <InputsButtonIcon icon="teenyicons:git-branch-outline" to="https://github.com/MrMiamm/job-finder" target="_blank">GitHub du projet</InputsButtonIcon>
    </ContainersRow>
  </ContainersBasicCard>
</template>