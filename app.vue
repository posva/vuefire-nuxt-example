<script lang="ts" setup>
import {
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

const db = useFirestore()
const user = useCurrentUser()

const router = useRouter()
const route = useRoute()
watch(user, async (currentUser, previousUser) => {
  if (currentUser) {
    addDoc
  }
  // redirect to login if they logout
  if (!currentUser && previousUser) {
    return router.push({ name: 'login' })
  }
  // redirect the user if they are logged in but were rejected because the user wasn't ready yet
  if (currentUser && typeof route.query.redirect === 'string') {
    return router.push(route.query.redirect)
  }

  // update user info
  if (currentUser) {
    console.log('Updating user info...')
    const userDoc = doc(db, 'users', currentUser.uid)
    const userData = {
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      lastLogin: serverTimestamp(),
    }
    const existingUser = await getDoc(userDoc)

    if (existingUser.exists()) {
      await updateDoc(userDoc, userData)
    } else {
      await setDoc(userDoc, {
        ...userData,
        joinedAt: serverTimestamp(),
      })
    }
    console.log('User updated')
  }
})
</script>

<template>
  <div>
    <a href="https://nuxt.com" target="_blank">
      <img src="@/assets/nuxt.svg" class="logo" alt="Nuxt logo" />
    </a>
    <a href="https://vuefire.vuejs.org" target="_blank">
      <img src="/vuefire.svg" class="logo vuefire" alt="VueFire logo" />
    </a>
  </div>

  <h1>Nuxt + VueFire</h1>

  <NavigationLinks />

  <NuxtPage />

  <p>
    <a href="https://github.com/posva/vuefire-nuxt-example">
      <img
        src="@/assets/github-mark.svg"
        alt="GitHub logo"
        class="logo github"
      />
      Source Code
    </a>
  </p>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;

  transition: filter ease-out 0.3s;
}
.logo.vuefire {
  height: 7.5em;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #00dc82aa);
}
.logo.vuefire:hover {
  filter: drop-shadow(0 0 2em #f78200aa);
}

@media screen and (max-width: 425px) {
  .logo {
    height: 4em;
    padding: 0.5em;
  }
  .logo.vuefire {
    height: 5em;
  }
}

.logo.github {
  height: 1em;
  padding: 0 0.15em;
}
</style>
