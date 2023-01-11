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
  linkTitle: 'Pixel Panel',
  order: 6,
  middleware: ['authenticated'],
})

interface PanelPixel {
  content: string
  createdAt: Timestamp
  displayName: string
  photoURL: string
  pos: number
  revision: number
}

const db = useFirestore()
const user = useCurrentUser()
const pixelsRef = collection(db, 'pixels')

const myPixelRef = computed(() => doc(pixelsRef, user.value!.uid))

const pixels = useCollection<PanelPixel>(
  query(pixelsRef, orderBy('createdAt', 'desc')),
  {
    ssrKey: 'pixels',
  }
)

const myPixel = useDocument<PanelPixel>(myPixelRef)

const elapsedSeconds = useInterval(1000)
const now = Date.now()
const canCreateNewPixel = computed(() => {
  if (!myPixel.value) return true
  return (
    now + elapsedSeconds.value * 1000 - myPixel.value.createdAt.toMillis() >=
    5000
  )
})

const lastCreatedPixel = computed(() => pixels.value.at(0))

const lastCreatedPixelCreatedAt = computed(
  () => lastCreatedPixel.value?.createdAt
)

const lastCreationRelativeTime = useRelativeTime(lastCreatedPixelCreatedAt)

function getPixelByPos(i: number): PanelPixel | undefined {
  return pixels.value.find((p) => p.pos === i)
}

const WIDTH = 15
const HEIGHT = 15
const newContent = ref(getRandomEmoji())
const currentHover = ref(-1)
function generateNewContent(pos: number) {
  currentHover.value = pos
  newContent.value = getRandomEmoji()
}

async function createPixel(pos: number) {
  if (!user.value || !canCreateNewPixel.value) return
  const currentDoc = await getDoc(myPixelRef.value)

  try {
    if (currentDoc.exists()) {
      await updateDoc(myPixelRef.value, {
        createdAt: serverTimestamp(),
        content: newContent.value,
        pos,
        revision: increment(1),
      })
    } else {
      await setDoc(myPixelRef.value, {
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
    <h2>Pixel Panel</h2>

    <p>
      Currently we have
      <strong>{{ pixels.length }}</strong> contribution{{
        pixels.length == 1 ? '' : 's'
      }}.
      <br />

      <template v-if="!canCreateNewPixel">
        You added an emoji less than 5 seconds ago. Wait a bit to create a new
        one 😊
      </template>
      <template v-else>
        Click on any box to add your very own emoji {{ newContent }}!
      </template>
    </p>

    <p v-if="lastCreatedPixel">
      <img
        class="mini-avatar"
        referrerpolicy="no-referrer"
        :src="lastCreatedPixel.photoURL"
        :alt="lastCreatedPixel.displayName"
      />
      created {{ lastCreatedPixel.content }} {{ lastCreationRelativeTime }}
    </p>

    <div class="pixel-grid">
      <div
        role="button"
        class="pixel-button"
        v-for="i in WIDTH * HEIGHT"
        @click="createPixel(i)"
        @mouseenter="generateNewContent(i)"
        @mouseleave="currentHover = -1"
        :aria-disabled="!canCreateNewPixel"
      >
        {{ currentHover === i ? newContent : getPixelByPos(i)?.content }}
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

.pixel-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(WIDTH), 1.2em);
  grid-template-rows: repeat(v-bind(HEIGHT), 1.2em);
  grid-column-gap: 4px;
  grid-row-gap: 4px;

  user-select: none;
}

.pixel-grid:hover {
  cursor: crosshair;
}

.pixel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  border: solid 1px var(--border);
}

.pixel-button:hover {
  background-color: var(--selection);
}
.pixel-button[aria-disabled='true']:hover {
  cursor: not-allowed;
}
</style>
