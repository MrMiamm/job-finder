<template>
  <ContainersColumn>
    <Title1>Mentions légales</Title1>

    <!-- Éditeur du site -->
    <Title2>Éditeur du site :</Title2>
    <p>
      Nom : {{ editorName }}<br>
      Email : <PageLink :to="`mailto:${editorEmail}`" target="_blank">{{ editorEmail }}</PageLink>
    </p>

    <!-- Hébergeur -->
    <Title2>Hébergeur :</Title2>
    <p>
      Société : {{ hostName }}<br>
      Site web : <PageLink to="https://vercel.com" target="_blank">{{ hostUrl }}</PageLink><br>
      Email : <PageLink :to="`mailto:${hostEmail}`" target="_blank">{{ hostEmail }}</PageLink>
    </p>

    <!-- Contenus et droits -->
    <Title2>Contenus et droits :</Title2>
    <p>
      Ce site ne contient aucun contenu original. <br>
      Les icônes utilisées proviennent de <PageLink to="https://icon-sets.iconify.design/" target="_blank">Iconify</PageLink>. <br>
      Les logos et contenus des offres d'emploi appartiennent à leurs entreprises respectives. <br>
      Le site agit uniquement comme moteur de recherche et redirige vers les pages officielles des entreprises. <br>
      Aucun droit n'est revendiqué sur ces contenus.
    </p>

    <!-- Responsabilité -->
    <Title2>Responsabilité :</Title2>
    <p>
      Ce site agit uniquement comme moteur de recherche d'offres d'emploi et redirige vers les pages officielles des entreprises. <br>
      Nous ne garantissons pas l'exactitude ni la disponibilité des offres référencées.
    </p>

    <!-- Contact / retrait d’offre -->
    <Title2>Contact / Retrait d'offre :</Title2>
    <p>
      Si vous êtes une entreprise et souhaitez modifier ou retirer une offre référencée, 
      merci de me contacter à : <PageLink :to="`mailto:${editorEmail}`" target="_blank">{{ editorEmail }}</PageLink>
    </p>
  </ContainersColumn>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const editorName = config.public.EDITOR_NAME
const editorEmail = config.public.EDITOR_EMAIL
const hostName = config.public.HOST_NAME
const hostEmail = config.public.HOST_EMAIL
const hostUrl = config.public.HOST_URL
</script>