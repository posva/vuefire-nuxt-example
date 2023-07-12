// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-vuefire'],
  // temporary, otherwise fails with vite error but this is not enough because we haven't added admin credentials
  ssr: false,

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/posts/others'],
    },
  },

  app: {
    head: {
      title: 'Nuxt + VueFire',
      link: [
        {
          href: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
          rel: 'stylesheet',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/vuefire.svg',
        },
      ],
    },
  },

  css: ['@/assets/style.css'],

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
