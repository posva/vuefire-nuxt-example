<script lang="ts" setup>
import {
  collection,
  doc,
  getDoc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { getRandomEmoji } from '@/assets/emojis'
import { useInterval } from '@vueuse/core'

definePageMeta({
  linkTitle: 'Emoji Panel',
  order: 6,
  middleware: ['authenticated'],
})

interface PanelEmoji {
  content: string
  createdAt: Timestamp
  displayName: string
  photoURL: string
  pos: number
  revision: number
}

const db = useFirestore()
const user = useCurrentUser()
const emojisRef = collection(db, 'pixels')

const emojis = useCollection<PanelEmoji>(
  query(emojisRef, orderBy('createdAt', 'desc')),
  {
    ssrKey: 'emojis',
  }
)

const myEmojiRef = computed(() => doc(emojisRef, user.value!.uid))
const myEmoji = useDocument<PanelEmoji>(myEmojiRef)

const elapsedSeconds = useInterval(1000)
const now = Date.now()
const canCreateNewEmoji = computed(() => {
  if (!myEmoji.value) return true
  return (
    now + elapsedSeconds.value * 1000 - myEmoji.value.createdAt.toMillis() >=
    5000
  )
})

const lastCreatedEmoji = computed(() => emojis.value.at(0))

const lastCreatedEmojiCreatedAt = computed(
  () => lastCreatedEmoji.value?.createdAt
)

const lastCreationRelativeTime = useRelativeTime(lastCreatedEmojiCreatedAt)

function getEmojiByPos(i: number): PanelEmoji | undefined {
  return emojis.value.find((p) => p.pos === i)
}

const WIDTH = 15
const HEIGHT = 15
const newContent = ref(getRandomEmoji())
const currentHover = ref(-1)
function generateNewContent(pos: number) {
  currentHover.value = pos
  newContent.value = getRandomEmoji()
}

async function createEmoji(pos: number) {
  if (!user.value || !canCreateNewEmoji.value) return
  const currentDoc = await getDoc(myEmojiRef.value)

  try {
    if (currentDoc.exists()) {
      await updateDoc(myEmojiRef.value, {
        createdAt: serverTimestamp(),
        content: newContent.value,
        pos,
        revision: increment(1),
      })
    } else {
      await setDoc(myEmojiRef.value, {
        content: newContent.value,
        createdAt: serverTimestamp(),
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        pos,
        revision: increment(1),
      })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <main>
    <h2>Emoji Panel</h2>

    <p>
      Currently we have
      <strong>{{ emojis.length }}</strong> contribution{{
        emojis.length == 1 ? '' : 's'
      }}.
      <br />

      <template v-if="!canCreateNewEmoji">
        You added an emoji less than 5 seconds ago. Wait a bit to create a new
        one 😊
      </template>
      <template v-else>
        Click on any box to add your very own emoji {{ newContent }}!
      </template>
    </p>

    <p v-if="lastCreatedEmoji">
      <img
        class="mini-avatar"
        referrerpolicy="no-referrer"
        :src="lastCreatedEmoji.photoURL"
        :alt="lastCreatedEmoji.displayName"
      />
      created {{ lastCreatedEmoji.content }} {{ lastCreationRelativeTime }}
    </p>

    <div class="emoji-grid">
      <div
        role="button"
        class="emoji-button"
        v-for="i in WIDTH * HEIGHT"
        @click="createEmoji(i)"
        @mouseenter="generateNewContent(i)"
        @mouseleave="currentHover = -1"
        :aria-disabled="!canCreateNewEmoji"
      >
        {{ currentHover === i ? newContent : getEmojiByPos(i)?.content }}
      </div>
    </div>
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

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(WIDTH), 1.2em);
  grid-template-rows: repeat(v-bind(HEIGHT), 1.2em);
  grid-column-gap: 4px;
  grid-row-gap: 4px;

  user-select: none;
}

.emoji-grid:hover {
  cursor: crosshair;
}

.emoji-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  border: solid 1px var(--border);
}

.emoji-button:hover {
  background-color: var(--selection);
}
.emoji-button[aria-disabled='true']:hover {
  cursor: not-allowed;
}
</style>
