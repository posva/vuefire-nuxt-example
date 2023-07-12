import { useInterval } from '@vueuse/core'
import { Timestamp } from 'firebase/firestore'

export function useRelativeTime(
  when: MaybeRefOrGetter<Timestamp | undefined | null>
) {
  const START = Date.now()
  const elapsedSeconds = useInterval(1000)

  return computed(() => {
    const whenValue = toValue(when)
    return whenValue == null
      ? 'never'
      : fromTime(START + elapsedSeconds.value * 1000, whenValue.toMillis())
  })
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
