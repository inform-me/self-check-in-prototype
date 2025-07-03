<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Smart Reporting Editor</v-toolbar-title>
            <v-spacer />
            <v-chip v-if="isLLMInitialized" color="success" variant="outlined">
              <v-icon left>mdi-brain</v-icon>
              AI Ready
            </v-chip>
            <v-chip v-else-if="isLLMLoading" color="warning" variant="outlined">
              <v-icon left>mdi-loading mdi-spin</v-icon>
              Loading AI...
            </v-chip>
          </v-toolbar>
          
          <v-card-text>
            <div class="editor-container">
              <div class="editor-toolbar mb-2">
                <v-btn-group variant="outlined" density="compact">
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('bold') }"
                    @click="editor?.chain().focus().toggleBold().run()"
                    :disabled="!editor?.can().chain().focus().toggleBold().run()"
                  >
                    <v-icon>mdi-format-bold</v-icon>
                  </v-btn>
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('italic') }"
                    @click="editor?.chain().focus().toggleItalic().run()"
                    :disabled="!editor?.can().chain().focus().toggleItalic().run()"
                  >
                    <v-icon>mdi-format-italic</v-icon>
                  </v-btn>
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('underline') }"
                    @click="editor?.chain().focus().toggleUnderline().run()"
                    :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
                  >
                    <v-icon>mdi-format-underline</v-icon>
                  </v-btn>
                </v-btn-group>
                
                <v-btn-group variant="outlined" density="compact" class="ml-2">
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('heading', { level: 1 }) }"
                    @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
                  >
                    H1
                  </v-btn>
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('heading', { level: 2 }) }"
                    @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                  >
                    H2
                  </v-btn>
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('heading', { level: 3 }) }"
                    @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
                  >
                    H3
                  </v-btn>
                </v-btn-group>

                <v-btn-group variant="outlined" density="compact" class="ml-2">
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('bulletList') }"
                    @click="editor?.chain().focus().toggleBulletList().run()"
                  >
                    <v-icon>mdi-format-list-bulleted</v-icon>
                  </v-btn>
                  <v-btn
                    :class="{ 'v-btn--active': editor?.isActive('orderedList') }"
                    @click="editor?.chain().focus().toggleOrderedList().run()"
                  >
                    <v-icon>mdi-format-list-numbered</v-icon>
                  </v-btn>
                </v-btn-group>
              </div>
              
              <div class="editor-content">
                <editor-content :editor="editor" />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>
              <v-icon left>mdi-lightbulb</v-icon>
              AI Suggestions
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text v-if="llmError" class="text-center pa-8">
            <v-icon color="error" size="48">mdi-alert-circle</v-icon>
            <div class="mt-2 text-body-2">{{ llmError }}</div>
          </v-card-text>

          <v-card-text v-else-if="!isLLMInitialized" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="48" />
            <div class="mt-2">Initializing AI...</div>
          </v-card-text>

          <v-card-text v-else-if="searchResults.length === 0" class="text-center pa-8">
            <v-icon color="grey" size="48">mdi-magnify</v-icon>
            <div class="mt-2 text-body-2">Start typing to see relevant radiology articles</div>
          </v-card-text>

          <v-card-text v-else class="pa-0">
            <v-list>
              <v-list-item
                v-for="(result, index) in searchResults"
                :key="result.article.id"
                @click="showArticleDetail(result.article)"
                class="suggestion-item"
              >
                <template #prepend>
                  <v-avatar color="primary" size="small">
                    {{ index + 1 }}
                  </v-avatar>
                </template>

                <v-list-item-title class="text-wrap">
                  {{ result.article.title }}
                </v-list-item-title>
                
                <v-list-item-subtitle class="text-wrap">
                  <v-chip size="x-small" color="primary" variant="outlined" class="mr-1">
                    {{ result.article.category }}
                  </v-chip>
                  <v-chip size="x-small" color="secondary" variant="outlined" class="mr-1">
                    {{ result.article.subcategory }}
                  </v-chip>
                  <v-chip 
                    v-if="result.article.content?.tables?.length > 0"
                    size="x-small" 
                    color="info" 
                    variant="outlined" 
                    class="mr-1"
                  >
                    <v-icon size="x-small" class="mr-1">mdi-table</v-icon>
                    {{ result.article.content.tables.length }}
                  </v-chip>
                  <v-chip 
                    v-if="result.article.content?.images?.length > 0"
                    size="x-small" 
                    color="warning" 
                    variant="outlined" 
                    class="mr-1"
                  >
                    <v-icon size="x-small" class="mr-1">mdi-image</v-icon>
                    {{ result.article.content.images.length }}
                  </v-chip>
                  <div class="mt-1">
                    {{ result.relevantText }}
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <v-chip size="small" :color="getSimilarityColor(result.similarity)">
                    {{ Math.round(result.similarity * 100) }}%
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="detailDialog" max-width="900" scrollable>
      <v-card v-if="selectedArticle">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ selectedArticle.title }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="detailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-0">
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="content">Content</v-tab>
            <v-tab value="tables" v-if="selectedArticle.content?.tables?.length > 0">
              Tables ({{ selectedArticle.content.tables.length }})
            </v-tab>
            <v-tab value="images" v-if="selectedArticle.content?.images?.length > 0">
              Images ({{ selectedArticle.content.images.length }})
            </v-tab>
          </v-tabs>

          <v-tabs-window v-model="activeTab">
            <v-tabs-window-item value="content">
              <v-card-text>
                <div class="mb-4">
                  <v-chip color="primary" variant="outlined" class="mr-2">
                    {{ selectedArticle.category }}
                  </v-chip>
                  <v-chip color="secondary" variant="outlined">
                    {{ selectedArticle.subcategory }}
                  </v-chip>
                </div>
                
                <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.6;">
                  {{ selectedArticle.content?.text || 'No content available' }}
                </div>

                <v-btn 
                  color="primary" 
                  class="mt-4"
                  @click="insertContent(selectedArticle.content?.text || '')"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Insert Content
                </v-btn>
              </v-card-text>
            </v-tabs-window-item>

            <v-tabs-window-item value="tables">
              <v-card-text>
                <div v-for="(table, index) in selectedArticle.content?.tables" :key="index" class="mb-6">
                  <v-card variant="outlined">
                    <v-card-title class="text-h6 d-flex justify-space-between align-center">
                      Table {{ index + 1 }}
                      <v-btn 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        @click="insertTable(table)"
                      >
                        <v-icon left>mdi-table-plus</v-icon>
                        Insert Table
                      </v-btn>
                    </v-card-title>
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
                    v-for="(image, index) in selectedArticle.content?.images" 
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
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { useLLMSearch } from '@/composables/useLLMSearch'

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

const { 
  isInitialized: isLLMInitialized, 
  isLoading: isLLMLoading, 
  error: llmError,
  initializeEmbeddings,
  debouncedSearch
} = useLLMSearch()

const searchResults = ref<SearchResult[]>([])
const detailDialog = ref(false)
const selectedArticle = ref<ScrapedContent | null>(null)
const activeTab = ref('content')

const editor = useEditor({
  content: '<p>Start typing your radiology report here...</p>',
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    const text = editor.getText()
    if (text.length > 10) {
      debouncedSearch(text, (results) => {
        searchResults.value = results
      })
    } else {
      searchResults.value = []
    }
  }
})

const getSimilarityColor = (similarity: number) => {
  if (similarity > 0.7) return 'success'
  if (similarity > 0.5) return 'warning'
  return 'error'
}

const showArticleDetail = (article: ScrapedContent) => {
  selectedArticle.value = article
  activeTab.value = 'content'
  detailDialog.value = true
}

const insertContent = (content: string) => {
  if (editor.value) {
    editor.value.chain().focus().insertContent(`<p>${content}</p>`).run()
  }
  detailDialog.value = false
}

const insertTable = (table: TableData) => {
  if (!editor.value) return

  let tableHtml = '<table><thead><tr>'
  
  table.headers.forEach(header => {
    tableHtml += `<th>${header}</th>`
  })
  tableHtml += '</tr></thead><tbody>'
  
  table.rows.forEach(row => {
    tableHtml += '<tr>'
    row.forEach(cell => {
      tableHtml += `<td>${cell}</td>`
    })
    tableHtml += '</tr>'
  })
  
  tableHtml += '</tbody></table><p></p>'
  
  editor.value.chain().focus().insertContent(tableHtml).run()
  detailDialog.value = false
}

const onImageError = (value: string | undefined) => {
  console.warn('Failed to load image:', value)
}

onMounted(async () => {
  await initializeEmbeddings()
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped lang="scss">
.editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
}

.editor-content {
  min-height: 500px;
}

.suggestion-item {
  cursor: pointer;
  
  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.04);
  }
}

:deep(.ProseMirror) {
  padding: 16px;
  min-height: 500px;
  outline: none;
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
}

:deep(.ProseMirror p) {
  margin: 0 0 1em 0;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.5em 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5em 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.25em;
  font-weight: bold;
  margin: 0.5em 0;
}

:deep(.ProseMirror table) {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

:deep(.ProseMirror th),
:deep(.ProseMirror td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

:deep(.ProseMirror th) {
  background-color: #f5f5f5;
  font-weight: bold;
}
</style>
