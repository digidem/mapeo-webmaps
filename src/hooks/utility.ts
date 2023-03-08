import { useEffect, useRef, useState } from 'react'

type UseTimeoutReturnType = [boolean, () => void]

export const useTimeout = (callback: () => void, delay: number | null) => {
  const timeoutRef = useRef<number | null>(null)
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => savedCallback.current()
    if (delay !== null) {
      timeoutRef.current = window.setTimeout(tick, delay)
      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [delay])
  return timeoutRef
}

export const useTimeoutState = (delay: number): UseTimeoutReturnType => {
  const [isActive, setIsActive] = useState(false)
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    if (isActive) {
      timeout.current = window.setTimeout(() => setIsActive(false), delay)
    }

    return () => {
      if (typeof timeout.current === 'number') {
        clearTimeout(timeout.current)
      }
    }
  }, [isActive, delay])

  return [isActive, () => setIsActive(true)]
}
