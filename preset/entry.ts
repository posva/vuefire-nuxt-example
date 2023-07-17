import '#internal/nitro/virtual/polyfill'
import { HttpsOptions, onRequest } from 'firebase-functions/v2/https'

// auto imported
// import { toNodeListener } from 'h3'

const nitroApp = useNitroApp()
const appConfig = useAppConfig()
const config = useRuntimeConfig()

const IS_EMULATOR =
  !!process.env.FIREBASE_EMULATOR_HUB ||
  String(process.env.FUNCTIONS_EMULATOR) === 'true' ||
  Object.keys(process.env).some((key) => key.includes('_EMULATOR_'))

console.log('IS_EMULATOR', IS_EMULATOR)

const onRequestDefaults = {
  memory: '2GiB',
  region: 'europe-west1',
} satisfies HttpsOptions

// NOTE: named differently than `server` to avoid conflict with `server` gen 1

export const serverSecondGen = onRequest(
  {
    ...onRequestDefaults,
    ...config?.firebase?.functions?.httpsOptions,
    // Needed to ensure that the function can be invoked
    invoker: 'public',
  },
  toNodeListener(nitroApp.h3App)
)
