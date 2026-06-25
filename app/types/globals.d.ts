declare global {
  interface Window {
    utag?: {
      link: (payload: Record<string, unknown>) => void
      view: (payload: Record<string, unknown>) => void
    }
  }
}

export {}
