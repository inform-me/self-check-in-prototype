import { ref, computed } from 'vue'
import { pipeline, env } from '@xenova/transformers'

env.allowLocalModels = false

interface TableData {
  headers: string[]
  rows: string[][]
}

interface ScrapedContent {
  id: string
  title: string
  category: string
  subcategory: string
  url: string
  content: {
    text: string
    tables: TableData[]
    images: string[]
  }
  metadata: {
    scrapedAt: string
    sourceUrl: string
  }
}

interface SearchResult {
  article: ScrapedContent
  similarity: number
  relevantText: string
}

export function useLLMSearch() {
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const embedder = ref<unknown>(null)
  const articleEmbeddings = ref<Map<string, number[]>>(new Map())
  const radiologyData = ref<ScrapedContent[]>([])

  const loadRadiologyData = async (): Promise<ScrapedContent[]> => {
    try {
      let response
      let jsonData
      
      try {
        response = await fetch('/self-check-in-prototype/src/assets/scraped-data/radiology-assistant.json')
        if (!response.ok) {
          throw new Error('Scraped data not found')
        }
        jsonData = await response.json()
      } catch (scrapedError) {
        console.log('Scraped data not available, using sample data:', scrapedError)
        response = await fetch('/self-check-in-prototype/sample-radiology-data.json')
        if (!response.ok) {
          throw new Error(`Failed to load sample data: ${response.status} ${response.statusText}`)
        }
        jsonData = await response.json()
      }
      
      return Array.isArray(jsonData) ? jsonData : []
    } catch (err) {
      console.error('Error loading radiology data:', err)
      throw err
    }
  }

  const initializeEmbeddings = async () => {
    if (isInitialized.value) return

    try {
      isLoading.value = true
      error.value = null

      embedder.value = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
      
      radiologyData.value = await loadRadiologyData()
      
      for (const article of radiologyData.value) {
        const textToEmbed = `${article.title} ${article.category} ${article.subcategory} ${article.content.text}`
        const embedding = await (embedder.value as any)(textToEmbed, { pooling: 'mean', normalize: true })
        articleEmbeddings.value.set(article.id, Array.from(embedding.data) as number[])
      }

      isInitialized.value = true
    } catch (err) {
      console.error('Error initializing embeddings:', err)
      error.value = err instanceof Error ? err.message : 'Failed to initialize LLM search'
    } finally {
      isLoading.value = false
    }
  }

  const cosineSimilarity = (a: number[], b: number[]): number => {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  const searchSimilarArticles = async (query: string): Promise<SearchResult[]> => {
    if (!isInitialized.value || !embedder.value || query.trim().length < 3) {
      return []
    }

    try {
      const queryEmbedding = await (embedder.value as any)(query, { pooling: 'mean', normalize: true })
      const queryVector = Array.from(queryEmbedding.data) as number[]

      const results: SearchResult[] = []
      
      for (const article of radiologyData.value) {
        const articleEmbedding = articleEmbeddings.value.get(article.id)
        if (!articleEmbedding) continue

        const similarity = cosineSimilarity(queryVector, articleEmbedding)
        
        if (similarity > 0.3) {
          results.push({
            article,
            similarity,
            relevantText: article.content.text.substring(0, 200) + '...'
          })
        }
      }

      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)
    } catch (err) {
      console.error('Error searching articles:', err)
      return []
    }
  }

  let searchTimeout: number | null = null
  const debouncedSearch = (query: string, callback: (results: SearchResult[]) => void) => {
    if (searchTimeout) {
      window.clearTimeout(searchTimeout)
    }
    
    searchTimeout = window.setTimeout(async () => {
      const results = await searchSimilarArticles(query)
      callback(results)
    }, 500)
  }

  return {
    isInitialized: computed(() => isInitialized.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    initializeEmbeddings,
    searchSimilarArticles,
    debouncedSearch,
    radiologyData: computed(() => radiologyData.value)
  }
}
