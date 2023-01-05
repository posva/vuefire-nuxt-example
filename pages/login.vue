<script lang="ts">
import { GoogleAuthProvider } from 'firebase/auth'
export const googleAuthProvider = new GoogleAuthProvider()
</script>

<script lang="ts" setup>
import { signInWithRedirect, signOut } from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

definePageMeta({
  linkTitle: 'Login',
  order: 1,
})

const auth = useFirebaseAuth()! // only exists on client side
const user = useCurrentUser()
function signinRedirect() {
  signInWithRedirect(auth, googleAuthProvider)
}
</script>

<template>
  <main>
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
    <template v-else-if="user === undefined">
      <p>Loading...</p>
    </template>
    <template v-else>
      <button @click="signinRedirect()">Signin with Google</button>
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
