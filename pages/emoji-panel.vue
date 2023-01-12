<script lang="ts" setup>
import {
  collection,
  doc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { getRandomEmoji } from '@/assets/emojis'
import { useTimeout } from '@vueuse/core'
import { VueFirestoreDocumentData } from 'vuefire'

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
type PanelEmojiWithId = VueFirestoreDocumentData<PanelEmoji>

const db = useFirestore()
const user = useCurrentUser()
const auth = useFirebaseAuth()!
const emojisRef = collection(db, 'pixels')

const WIDTH = 15
const HEIGHT = 15

const emojis = useCollection<PanelEmoji>(
  query(emojisRef, orderBy('createdAt', 'desc')),
  {
    ssrKey: 'emojis',
  }
)

// good part of vue: easy to rework the data
const emojisByPos = computed(() => {
  const result: PanelEmojiWithId[] = Array(WIDTH * HEIGHT)
  emojis.value.forEach((emoji) => {
    result[emoji.pos] = emoji
  })

  return result
})

const lastCreatedEmoji = computed(() => emojis.value.at(0))
const lastCreatedEmojiCreatedAt = computed(
  () => lastCreatedEmoji.value?.createdAt
)
const lastCreationRelativeTime = useRelativeTime(lastCreatedEmojiCreatedAt)

const myEmojiRef = computed(() => user.value && doc(emojisRef, user.value.uid))
const myEmoji = useDocument<PanelEmoji>(myEmojiRef)

const { ready: canCreateNewEmoji, start } = useTimeout(5000, {
  controls: true,
  immediate: false,
})

const newContent = ref(getRandomEmoji())
const currentHover = ref(-1)

function generateNewContent() {
  newContent.value = getRandomEmoji()
}

async function createEmoji(pos: number) {
  if (!user.value || !canCreateNewEmoji.value || !myEmojiRef.value) return

  try {
    // check if the user already created an emoji before
    if (myEmoji.value != null) {
      await updateDoc(myEmojiRef.value, {
        createdAt: serverTimestamp(),
        revision: increment(1),
        pos,
        content: newContent.value,
      })
    } else {
      await setDoc(myEmojiRef.value, {
        displayName: user.value.displayName || 'anonymous',
        photoURL: user.value.photoURL || '',
        createdAt: serverTimestamp(),
        revision: increment(1),
        pos,
        content: newContent.value,
      })
    }

    // wait 5s before allowing a new creation
    start()
  } catch (error) {
    console.error(error)
  }
  currentHover.value = -1
}
</script>

<template>
  <main>
    <h2>Emoji Panel</h2>

    <p>
      Currently we have
      <strong
        >{{ emojis.length }} contribution{{
          emojis.length == 1 ? '' : 's'
        }}</strong
      >.
      <br />

      <template v-if="myEmoji"
        >Your last emoji is {{ myEmoji.content }} after
        {{ myEmoji.revision }} updates.
        <br />
      </template>

      <template v-if="!canCreateNewEmoji">
        You added an emoji less than 5 seconds ago. Wait a bit to create a new
        one 😊
      </template>
      <template v-else>
        Click on any box to add your very own emoji!
        <br />
        Click to randomize:
      </template>
    </p>

    <button @click="generateNewContent()" style="font-size: 2rem">
      {{ newContent }}
    </button>

    <p v-if="lastCreatedEmoji">
      <img
        class="mini-avatar"
        referrerpolicy="no-referrer"
        :src="
          lastCreatedEmoji.photoURL ||
          `https://i.pravatar.cc/150?u=${lastCreatedEmoji.id}`
        "
        :alt="lastCreatedEmoji.displayName"
      />
      created {{ lastCreatedEmoji.content }}
      <strong>{{ lastCreationRelativeTime }}</strong> after
      {{ lastCreatedEmoji.revision }} updates.
    </p>

    <div class="emoji-grid">
      <div
        role="button"
        class="emoji-button"
        :class="{ 'emoji-button--mine': emoji && emoji.id === user?.uid }"
        :data-uid="JSON.stringify({ id: myEmoji?.id, uid: user?.uid })"
        v-for="(emoji, pos) in emojisByPos"
        @click="createEmoji(pos)"
        @mouseover="canCreateNewEmoji && (currentHover = pos)"
        @mouseleave="currentHover = -1"
        :aria-disabled="!canCreateNewEmoji"
      >
        {{ currentHover === pos ? newContent : emoji?.content }}
      </div>
    </div>

    <button @click="signOut(auth)">Logout</button>
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
  margin-right: 0.3em;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(WIDTH), 1.2em);
  grid-template-rows: repeat(v-bind(HEIGHT), 1.2em);
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  /* font-size: 2rem; */

  user-select: none;
}

@media screen and (min-width: 426px) {
  .emoji-grid {
    font-size: 2rem;
  }
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

.emoji-button--mine {
  background-color: var(--highlight);
}

.emoji-button:hover {
  background-color: var(--selection);
}
.emoji-button[aria-disabled='true']:hover {
  cursor: not-allowed;
}
</style>
