import { ref, computed } from 'vue'

interface ImageLoadingState {
  isLoading: boolean
  hasError: boolean
  retryCount: number
  lastAttempt: number
}

export function useRobustImageLoading() {
  const imageStates = ref<Map<string, ImageLoadingState>>(new Map())
  const maxRetries = 3
  const retryDelay = 2000 // 2 seconds
  const pollInterval = 10000 // 10 seconds

  const getImageState = (url: string) => {
    if (!imageStates.value.has(url)) {
      imageStates.value.set(url, {
        isLoading: true,
        hasError: false,
        retryCount: 0,
        lastAttempt: Date.now()
      })
    }
    return imageStates.value.get(url)!
  }

  const isImageLoading = (url: string) => {
    return computed(() => getImageState(url).isLoading)
  }

  const hasImageError = (url: string) => {
    return computed(() => getImageState(url).hasError)
  }

  const handleImageLoad = (url: string) => {
    const state = getImageState(url)
    state.isLoading = false
    state.hasError = false
    state.retryCount = 0
  }

  const handleImageError = (url: string) => {
    const state = getImageState(url)
    state.isLoading = false
    state.hasError = true
    state.lastAttempt = Date.now()

    if (state.retryCount < maxRetries) {
      setTimeout(() => {
        state.retryCount++
        state.isLoading = true
        state.hasError = false
        imageStates.value = new Map(imageStates.value)
      }, retryDelay * Math.pow(2, state.retryCount)) // Exponential backoff
    }
  }

  const startPolling = (urls: string[]) => {
    const pollImages = () => {
      urls.forEach(url => {
        const state = getImageState(url)
        if (state.hasError && state.retryCount >= maxRetries) {
          if (Date.now() - state.lastAttempt > pollInterval) {
            state.retryCount = 0
            state.isLoading = true
            state.hasError = false
            imageStates.value = new Map(imageStates.value)
          }
        }
      })
    }

    const intervalId = setInterval(pollImages, pollInterval)
    return () => clearInterval(intervalId)
  }

  return {
    isImageLoading,
    hasImageError,
    handleImageLoad,
    handleImageError,
    startPolling
  }
}
