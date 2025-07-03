<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Reporting</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div class="mt-4">
              <h3 class="text-h6 mb-4">Rich Text Editor</h3>
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
                    <v-btn
                      :class="{ 'v-btn--active': editor?.isActive('strike') }"
                      @click="editor?.chain().focus().toggleStrike().run()"
                      :disabled="!editor?.can().chain().focus().toggleStrike().run()"
                    >
                      <v-icon>mdi-format-strikethrough</v-icon>
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

                  <v-btn-group variant="outlined" density="compact" class="ml-2">
                    <v-btn
                      @click="editor?.chain().focus().undo().run()"
                      :disabled="!editor?.can().chain().focus().undo().run()"
                    >
                      <v-icon>mdi-undo</v-icon>
                    </v-btn>
                    <v-btn
                      @click="editor?.chain().focus().redo().run()"
                      :disabled="!editor?.can().chain().focus().redo().run()"
                    >
                      <v-icon>mdi-redo</v-icon>
                    </v-btn>
                  </v-btn-group>
                </div>
                
                <div class="editor-content">
                  <editor-content :editor="editor" />
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { onBeforeUnmount } from 'vue'

const editor = useEditor({
  content: '<p>Start typing your report here...</p>',
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
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
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
  min-height: 400px;
}

:deep(.ProseMirror) {
  padding: 16px;
  min-height: 400px;
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

:deep(.ProseMirror ul) {
  list-style-type: disc;
  margin-left: 1.5em;
  margin: 0.5em 0 0.5em 1.5em;
}

:deep(.ProseMirror ol) {
  list-style-type: decimal;
  margin-left: 1.5em;
  margin: 0.5em 0 0.5em 1.5em;
}

:deep(.ProseMirror li) {
  margin: 0.25em 0;
}

:deep(.ProseMirror strong) {
  font-weight: bold;
}

:deep(.ProseMirror em) {
  font-style: italic;
}

:deep(.ProseMirror u) {
  text-decoration: underline;
}

:deep(.ProseMirror s) {
  text-decoration: line-through;
}
</style>
