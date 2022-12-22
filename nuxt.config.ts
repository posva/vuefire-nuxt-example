// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-vuefire'],
  // temporary, otherwise fails with vite error but this is not enough because we haven't added admin credentials
  ssr: true,

  vuefire: {
    auth: true,
    config: {
      apiKey: 'AIzaSyDyjJeqXsmmSldQL6AO9FlDWQqCYq16tl8',
      authDomain: 'vitesse-vuefire-example.firebaseapp.com',
      databaseURL:
        'https://vitesse-vuefire-example-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'vitesse-vuefire-example',
      appId: '1:682870035896:web:18c98382e02cd7b047eb4d',
      measurementId: 'G-EHSF802FGE',
    },
  },
})
