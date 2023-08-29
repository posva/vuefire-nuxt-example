import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const __dirname = new URL('.', import.meta.url).pathname
const vuefirePkg = JSON.parse(
  readFileSync(resolve(__dirname, 'node_modules/vuefire/package.json'), 'utf-8')
)
const nuxtVuefirePkg = JSON.parse(
  readFileSync(
    resolve(__dirname, 'node_modules/nuxt-vuefire/package.json'),
    'utf-8'
  )
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-vuefire'],
  ssr: true,
  devtools: {
    enabled: true,
    experimental: {
      timeline: true,
    },
  },

  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      nodeVersion: '18',
    },
    prerender: {
      crawlLinks: false,
      routes: ['/', '/login'],
      ignore: ['/posts/others'],
    },
  },

  runtimeConfig: {
    public: {
      vuefireVersion: vuefirePkg.version,
      nuxtVuefireVersion: nuxtVuefirePkg.version,
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
    auth: {
      enabled: true,
    },
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
  // routeRules: {},
})
