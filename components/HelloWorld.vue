<script setup lang="ts">
import {
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { computed } from 'vue'
import { useDocument, useFirestore } from 'vuefire'
import { useInterval } from '@vueuse/core'

const props = defineProps({
  today: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
})

const db = useFirestore()
// this could just be `doc(db, 'count', props.today)` but that wouldn't react to changes
const todaysCountDoc = computed(() =>
  doc(db, 'count', props.today).withConverter<{ when: Timestamp; n: number }>({
    fromFirestore: (snapshot) => {
      // Here you could do validation with a library like zod
      return snapshot.data(
        // this avoids having `null` while the server timestamp is updating
        { serverTimestamps: 'estimate' }
      ) as any
    },
    toFirestore: (data) => data,
  })
)

function incrementCount() {
  if (count.value) {
    return updateDoc(todaysCountDoc.value, {
      // increment is a special value that enables increments
      n: increment(1),
      // serverTimestamp is a special value that sets the current time
      when: serverTimestamp(),
    })
  } else {
    return setDoc(todaysCountDoc.value, {
      n: 0,
      when: serverTimestamp(),
    })
  }
}

const { data: count, pending } = useDocument(todaysCountDoc)
// can also be
// const count = useDocument(todaysCountDoc)

// time ago
const START = Date.now()
const elapsedSeconds = useInterval(1000)
// time formatting
const rtf = new Intl.RelativeTimeFormat('en', { style: 'long' })
function fromNow(date: Timestamp) {
  const now = START + elapsedSeconds.value * 1000
  const sinceDate = Math.min(
    // only allow negative values
    -1,
    Math.floor(((date.toMillis() ?? now) - now) / 1000)
  )
  return rtf.format(sinceDate, 'second')
}
</script>

<template>
  <h1>Vite + VueFire</h1>

  <div class="card">
    <p v-if="pending">Loading...</p>
    <template v-else>
      <button type="button" @click="incrementCount">
        <template v-if="count">count is {{ count.n }}</template>
        <template v-else>click to create today's count!</template>
      </button>
      <p v-if="count">Last increment: {{ fromNow(count.when) }}</p>
    </template>
    <p>
      Try opening this page in multiple tabs (or devices) to see the count
      increment.
      <br />
      Check
      <code>components/HelloWorld.vue</code> to see this example
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuefire.vuejs.org" target="_blank">VueFire docs</a> to
    learn more
  </p>
  <p class="read-the-docs">Or click on the Vite and VueFire logos</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
