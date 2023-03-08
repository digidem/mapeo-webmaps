import { useEffect, useRef, useState } from 'react'

type UseTimeoutReturnType = [boolean, () => void]

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
