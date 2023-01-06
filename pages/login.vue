<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth'
export const googleAuthProvider = new GoogleAuthProvider()
</script>

<script lang="ts" setup>
import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

definePageMeta({
  linkTitle: 'Login',
  order: 1,
})

const auth = useFirebaseAuth()! // only exists on client side
const user = useCurrentUser()
function signinRedirect() {
  signInWithRedirect(auth, googleAuthProvider).catch((reason) => {
    error.value = reason
  })
}

function signinPopup() {
  error.value = null
  signInWithPopup(auth, googleAuthProvider).catch((reason) => {
    error.value = reason
  })
}

// display errors if any
const error = ref<Error | null>(null)
// only on client side
onMounted(() => {
  getRedirectResult(auth)
    .then((result) => {
      if (!result?.user) {
        // user is logged in
        error.value = new Error((result as any) ?? 'No result')
      }
    })
    .catch((reason) => {
      error.value = reason
    })
})

const route = useRoute()
</script>

<template>
  <main>
    <template v-if="user === undefined">
      <p>Loading...</p>
    </template>
    <template v-else>
      <ErrorBox v-if="error" :error="error" />

      <div v-else-if="route.query.redirect" class="message-box">
        <p>
          Please login to access <code>{{ route.query.redirect }}</code
          >.
        </p>
      </div>

      <template v-if="user">
        <p>
          You are currently logged in as:
          <br />
          <img
            class="avatar"
            v-if="user.photoURL"
            :src="user.photoURL"
            referrerpolicy="no-referrer"
          />
          <br />
          <strong>{{ user.displayName }}.</strong>
        </p>

        <button @click="signOut(auth)">Logout</button>
      </template>

      <template v-else>
        <button @click="signinRedirect()">SignIn with Google (redirect)</button>
        <br />
        <button @click="signinPopup()">SignIn with Google (popup)</button>
      </template>
    </template>
  </main>
</template>

<style scoped>
.avatar {
  padding: 1em 0;
}

main > button {
  margin: 1em 0;
}
</style>
