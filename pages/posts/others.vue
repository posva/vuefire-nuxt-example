<script lang="ts" setup>
import { collection } from 'firebase/firestore'

definePageMeta({
  linkTitle: 'Others',
  order: 5,
  middleware: ['authenticated'],
})

const db = useFirestore()
const users = useCollection(collection(db, 'users'))
</script>

<template>
  <main>
    <h2>Users</h2>

    <p>So far {{ users.length }} users have tried the app.</p>

    <ul>
      <li v-for="user in users" :key="user.id">
        <img
          class="mini-avatar"
          v-if="user.photoURL"
          :src="user.photoURL"
          referrerpolicy="no-referrer"
        />
        <span>{{ user.displayName }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.mini-avatar {
  border-radius: 100%;
  width: 2em;
  height: 2em;
  max-width: 100%;
  height: auto;
  vertical-align: middle;
  margin-right: 0.8em;
}
</style>
