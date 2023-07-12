import '#internal/nitro/virtual/polyfill'
import { HttpsOptions, onRequest } from 'firebase-functions/v2/https'

const nitroApp = useNitroApp()
const config = useRuntimeConfig()

const onRequestDefaults = {
  memory: '1GiB',
} satisfies HttpsOptions

export const serverSecondGen = onRequest(
  {
    ...onRequestDefaults,
    ...config?.firebase?.functions?.httpsOptions,
  },
  toNodeListener(nitroApp.h3App)
)
