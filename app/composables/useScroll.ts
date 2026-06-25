export function useScroll() {
  const smoothScrollTo = (element: HTMLElement, duration: number = 800) => {
    if (!element) return

    const startPosition = window.pageYOffset
    const targetPosition
      = element.getBoundingClientRect().top + window.pageYOffset
    const distance = targetPosition - startPosition
    let startTime: number | null = null

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const scrollY = easeInOutQuad(
        timeElapsed,
        startPosition,
        distance,
        duration,
      )
      window.scrollTo(0, scrollY)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    function easeInOutQuad(t: number, b: number, c: number, d: number) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    requestAnimationFrame(animation)
  }

  const smoothScrollToPosition = (targetY: number, duration: number = 800) => {
    const startPosition = window.pageYOffset
    const distance = targetY - startPosition
    let startTime: number | null = null

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const scrollY = easeInOutQuad(
        timeElapsed,
        startPosition,
        distance,
        duration,
      )
      window.scrollTo(0, scrollY)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    function easeInOutQuad(t: number, b: number, c: number, d: number) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    requestAnimationFrame(animation)
  }

  return {
    smoothScrollTo,
    smoothScrollToPosition,
  }
}
