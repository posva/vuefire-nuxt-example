<script lang="ts" setup>
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
  linkTitle: 'New Post',
  order: 3,
  // only authenticated users can access this page
  middleware: ['authenticated'],
})

const content = useLocalStorage('post-content', '')

const lastPosts = useCollection<{ content: string; createdAt: Timestamp }>(
  query(
    collection(db, 'users', user.value!.uid, 'notes'),
    orderBy('createdAt', 'desc'),
    limit(5)
  ),
  { ssrKey: 'last-posts' }
)

const {
  execute: createPost,
  isLoading: isSubmittingPost,
  error: postError,
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
      console.log('done')
      content.value = ''
    })
  },
  null,
  // must be executed
  { immediate: false }
)

const maxContentLength = 512
const maxLengthColor = computed(() => {
  if (content.value.length > maxContentLength * 0.9) return 'red'
  if (content.value.length > maxContentLength * 0.8) return 'orange'
})
</script>

<template>
  <main>
    <h2>Create a new post</h2>

    <div v-if="postError" class="error-message">
      <p><strong>Error:</strong> {{ postError.message }}</p>
    </div>
    <form @submit.prevent="createPost()">
      <fieldset :disabled="isSubmittingPost">
        <label for="content">Post</label>
        <textarea
          id="content"
          placeholder="The other day I was..."
          :value="content"
          @input="content = $event.target.value"
          :maxlength="maxContentLength"
          required
        ></textarea>

        <div class="max-length" :class="maxLengthColor">
          {{ content.length }} / {{ maxContentLength }}
        </div>

        <input type="submit" value="Create Post" />
      </fieldset>
    </form>

    <section>
      <h3>Last posts</h3>
      <ul v-if="lastPosts">
        <li v-for="post in lastPosts" :key="post.id">
          <span
            >{{ post.content }} - {{ post.createdAt.toDate().toISOString() }}
          </span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.max-length {
  font-size: 0.7rem;
  text-align: right;
}

fieldset {
  border: none;
}

.red {
  color: crimson;
}
.orange {
  color: orange;
}
</style>
