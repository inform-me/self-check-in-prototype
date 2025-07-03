<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Radiology Assistant Data</v-toolbar-title>
            <v-spacer />
            <v-chip v-if="data.length > 0" color="white" text-color="primary">
              {{ data.length }} Articles
            </v-chip>
          </v-toolbar>

          <v-card-text v-if="loading" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="64" />
            <div class="mt-4">Loading radiology data...</div>
          </v-card-text>

          <v-card-text v-else-if="error" class="text-center pa-8">
            <v-icon color="error" size="64">mdi-alert-circle</v-icon>
            <div class="mt-4 text-h6">Error Loading Data</div>
            <div class="text-body-2 text-medium-emphasis">{{ error }}</div>
          </v-card-text>

          <v-card-text v-else-if="data.length === 0" class="text-center pa-8">
            <v-icon color="grey" size="64">mdi-database-off</v-icon>
            <div class="mt-4 text-h6">No Data Available</div>
            <div class="text-body-2 text-medium-emphasis">
              Run the scraper first: <code>pnpm run scrape-radiology</code>
            </div>
          </v-card-text>

          <v-card-text v-else class="pa-0">
            <v-treeview
              :items="treeItems"
              item-key="id"
              item-title="title"
              item-children="children"
              open-on-click
              class="radiology-tree"
            >
              <template #title="{ item }">
                <div 
                  @click="handleItemClick(item)" 
                  class="tree-item-title"
                  :class="{ 'clickable': item.type === 'article' }"
                >
                  {{ item.title }}
                </div>
              </template>
              <template #prepend="{ item }">
                <v-icon :color="getItemIconColor(item.type)">
                  {{ getItemIcon(item.type) }}
                </v-icon>
              </template>
              
              <template #append="{ item }">
                <v-chip 
                  v-if="item.count" 
                  size="small" 
                  :color="getChipColor(item.type)"
                  variant="outlined"
                >
                  {{ item.count }}
                </v-chip>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="detailDialog" max-width="900" scrollable>
      <v-card v-if="selectedItem">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ selectedItem.title }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="detailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-0">
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="content">Content</v-tab>
            <v-tab value="tables" v-if="selectedItem.data?.content?.tables?.length > 0">
              Tables ({{ selectedItem.data.content.tables.length }})
            </v-tab>
            <v-tab value="images" v-if="selectedItem.data?.content?.images?.length > 0">
              Images ({{ selectedItem.data.content.images.length }})
            </v-tab>
            <v-tab value="metadata">Metadata</v-tab>
          </v-tabs>

          <v-tabs-window v-model="activeTab">
            <v-tabs-window-item value="content">
              <v-card-text>
                <div class="mb-4">
                  <v-chip color="primary" variant="outlined" class="mr-2">
                    {{ selectedItem.data?.category }}
                  </v-chip>
                  <v-chip color="secondary" variant="outlined">
                    {{ selectedItem.data?.subcategory }}
                  </v-chip>
                </div>
                
                <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.6;">
                  {{ selectedItem.data?.content?.text || 'No content available' }}
                </div>
              </v-card-text>
            </v-tabs-window-item>

            <v-tabs-window-item value="tables">
              <v-card-text>
                <div v-for="(table, index) in selectedItem.data?.content?.tables" :key="index" class="mb-6">
                  <v-card variant="outlined">
                    <v-card-title class="text-h6">Table {{ index + 1 }}</v-card-title>
                    <v-card-text>
                      <v-table density="compact">
                        <thead v-if="table.headers?.length > 0">
                          <tr>
                            <th v-for="header in table.headers" :key="header" class="text-left">
                              {{ header }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, rowIndex) in table.rows" :key="rowIndex">
                            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                              {{ cell }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card-text>
            </v-tabs-window-item>

            <v-tabs-window-item value="images">
              <v-card-text>
                <v-row>
                  <v-col 
                    v-for="(image, index) in selectedItem.data?.content?.images" 
                    :key="index"
                    cols="12" sm="6" md="4"
                  >
                    <v-card variant="outlined">
                      <v-img 
                        :src="image" 
                        height="200"
                        cover
                        @error="onImageError"
                      >
                        <template #placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular indeterminate color="primary" />
                          </div>
                        </template>
                      </v-img>
                      <v-card-actions>
                        <v-btn 
                          :href="image" 
                          target="_blank" 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        >
                          <v-icon left>mdi-open-in-new</v-icon>
                          Open
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-tabs-window-item>

            <v-tabs-window-item value="metadata">
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Source URL</v-list-item-title>
                    <v-list-item-subtitle>
                      <a :href="selectedItem.data?.url" target="_blank" class="text-primary">
                        {{ selectedItem.data?.url }}
                      </a>
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Scraped At</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatDate(selectedItem.data?.metadata?.scrapedAt) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <v-list-item-title>Article ID</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedItem.data?.id }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

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

interface TreeItem {
  id: string
  title: string
  type: 'category' | 'subcategory' | 'article'
  children?: TreeItem[]
  count?: number
  data?: ScrapedContent
}

const data = ref<ScrapedContent[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const detailDialog = ref(false)
const selectedItem = ref<TreeItem | null>(null)
const activeTab = ref('content')

const treeItems = computed(() => {
  const categories = new Map<string, TreeItem>()
  
  data.value.forEach(item => {
    // Get or create category
    if (!categories.has(item.category)) {
      categories.set(item.category, {
        id: `category_${item.category}`,
        title: item.category,
        type: 'category',
        children: [],
        count: 0
      })
    }
    
    const category = categories.get(item.category)!
    
    // Get or create subcategory
    let subcategory = category.children?.find(sub => sub.title === item.subcategory)
    if (!subcategory) {
      subcategory = {
        id: `subcategory_${item.category}_${item.subcategory}`,
        title: item.subcategory,
        type: 'subcategory',
        children: [],
        count: 0
      }
      category.children!.push(subcategory)
    }
    
    // Add article
    subcategory.children!.push({
      id: item.id,
      title: item.title,
      type: 'article',
      data: item
    })
    
    // Update counts
    subcategory.count = (subcategory.count || 0) + 1
    category.count = (category.count || 0) + 1
  })
  
  return Array.from(categories.values()).sort((a, b) => a.title.localeCompare(b.title))
})

const getItemIcon = (type: string) => {
  switch (type) {
    case 'category': return 'mdi-folder'
    case 'subcategory': return 'mdi-folder-outline'
    case 'article': return 'mdi-file-document'
    default: return 'mdi-file'
  }
}

const getItemIconColor = (type: string) => {
  switch (type) {
    case 'category': return 'primary'
    case 'subcategory': return 'secondary'
    case 'article': return 'success'
    default: return 'grey'
  }
}

const getChipColor = (type: string) => {
  switch (type) {
    case 'category': return 'primary'
    case 'subcategory': return 'secondary'
    default: return 'grey'
  }
}

const handleItemClick = (item: TreeItem) => {
  console.log('handleItemClick called with:', item)
  
  if (item && item.type === 'article' && item.data) {
    selectedItem.value = item
    activeTab.value = 'content'
    detailDialog.value = true
    console.log('Modal should open for:', item.title)
  } else {
    console.log('Item is not an article or has no data:', item)
  }
}


const formatDate = (isoString?: string) => {
  if (!isoString) return 'Unknown'
  return new Date(isoString).toLocaleString()
}

const onImageError = (event: Event) => {
  console.warn('Failed to load image:', (event.target as HTMLImageElement)?.src)
}

const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Try to load the scraped data, fallback to sample data
    let response
    let jsonData
    
    try {
      response = await fetch('/self-check-in-prototype/src/assets/scraped-data/radiology-assistant.json')
      if (!response.ok) {
        throw new Error('Scraped data not found')
      }
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Scraped data is not JSON')
      }
      jsonData = await response.json()
    } catch (scrapedError) {
      // Fallback to sample data for testing
      console.log('Scraped data not available, using sample data:', scrapedError)
      try {
        response = await fetch('/self-check-in-prototype/sample-radiology-data.json')
        if (!response.ok) {
          throw new Error(`Failed to load sample data: ${response.status} ${response.statusText}`)
        }
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Sample data is not JSON')
        }
        jsonData = await response.json()
      } catch (sampleError) {
        throw new Error(`Both scraped and sample data failed: ${sampleError}`)
      }
    }
    
    data.value = Array.isArray(jsonData) ? jsonData : []
    
  } catch (err) {
    console.error('Error loading radiology data:', err)
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
    data.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.radiology-tree {
  max-height: 600px;
  overflow-y: auto;
}

.v-treeview {
  :deep(.v-treeview-item) {
    padding: 4px 0;
  }
  
  :deep(.v-treeview-item__content) {
    padding: 8px 12px;
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.04);
    }
  }
  
  .tree-item-title {
    width: 100%;
    padding: 4px 0;
    
    &.clickable {
      cursor: pointer;
      color: rgb(var(--v-theme-primary));
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

code {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}
</style>
