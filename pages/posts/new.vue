<script lang="ts" setup>
import type { FirebaseError } from 'firebase/app'
import { useLocalStorage, useAsyncState } from '@vueuse/core'
import {
  addDoc,
  serverTimestamp,
  doc,
  collection,
  limit,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore'

const user = useCurrentUser()
const db = useFirestore()

definePageMeta({
  linkTitle: 'New Note',
  order: 3,
  // only authenticated users can access this page
  middleware: ['authenticated'],
})

const content = useLocalStorage('note-content', '')

const lastNotes = useCollection<{ content: string; createdAt: Timestamp }>(
  query(
    collection(db, 'users', user.value!.uid, 'notes'),
    orderBy('createdAt', 'desc'),
    limit(5)
  ),
  { ssrKey: 'last-notes' }
)

const {
  execute: createNote,
  isLoading: isCreatingNote,
  error,
} = useAsyncState(
  () => {
    // avoid empty posts that will fail on Firestore anyway
    if (!content.value || !user.value) {
      return Promise.reject(new Error('Invalid post'))
    }

    return addDoc(collection(db, 'users', user.value.uid, 'notes'), {
      content: content.value,
      createdAt: serverTimestamp(),
    }).then(() => {
      // reset the post content if successful
      content.value = ''
    })
  },
  null,
  // avoid executing the function on mount
  { immediate: false }
)
</script>

<template>
  <main>
    <h2>Create a new Note</h2>

    <div v-if="error" class="error-message">
      <p><strong>Error:</strong> {{ (error as FirebaseError).name }}</p>
      <details>
        <summary>Details</summary>
        <pre>{{ error }}</pre>
      </details>
    </div>

    <form @submit.prevent="createNote()">
      <fieldset :disabled="isCreatingNote">
        <MyTextarea
          id="content"
          placeholder="The other day I was..."
          v-model="content"
          :maxlength="512"
          required
        />

        <input type="submit" value="Save Note" />
      </fieldset>
    </form>

    <section>
      <h3>Last Notes</h3>
      <ul v-if="lastNotes">
        <li v-for="note in lastNotes" :key="note.id">
          <span
            >{{ note.content }} - {{ note.createdAt.toDate().toISOString() }}
          </span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
fieldset {
  border: none;
}
</style>
