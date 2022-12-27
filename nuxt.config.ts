import { resolvePath } from '@nuxt/kit'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-vuefire'],
  // temporary, otherwise fails with vite error but this is not enough because we haven't added admin credentials
  ssr: false,

  // nitro: {
  //   prerender: {
  //     crawlLinks: false,
  //     routes: [],
  //   },
  // },

  vuefire: {
    auth: true,
    config: {
      apiKey: 'AIzaSyCvPJk1gTgga_H7SS6YKgQTSBwBYWzwWBE',
      authDomain: 'nuxtparaeduardo.firebaseapp.com',
      projectId: 'nuxtparaeduardo',
      storageBucket: 'nuxtparaeduardo.appspot.com',
      messagingSenderId: '817686702603',
      appId: '1:817686702603:web:6cc63067ca20f6e5c1350e',
    },
  },

  // TODO: to add with ssr
  routeRules: {},
})
