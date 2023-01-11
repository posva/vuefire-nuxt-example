import { MaybeRef, useInterval } from '@vueuse/core'
import { Timestamp } from 'firebase/firestore'

export function useRelativeTime(when: MaybeRef<Timestamp | undefined | null>) {
  const START = Date.now()
  const elapsedSeconds = useInterval(1000)

  return computed(() =>
    unref(when) == null
      ? 'never'
      : fromTime(START + elapsedSeconds.value * 1000, unref(when)!.toMillis())
  )
}

// time formatting
const rtf = new Intl.RelativeTimeFormat('en', { style: 'long' })
function fromTime(now: number, time: number) {
  const sinceDate = Math.min(
    // only allow negative values
    -0,
    Math.floor((time - now) / 1000)
  )
  return rtf.format(sinceDate, 'seconds')
}
