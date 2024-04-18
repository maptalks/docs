<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Split from 'split.js';
import loader from '@monaco-editor/loader';
import { ElMessage } from 'element-plus'
import { getCode, createShareUrl } from './code';

const editorRef = ref('editorRef');
const previewRef = ref('previewRef');


let editor;

const createEditor = (monaco) => {
    // https://microsoft.github.io/monaco-editor/
    editor = monaco.editor.create(editorRef.value, {
        value: '<h1>hello world</h1>',
        language: 'html',
        // theme: 'vs-dark',
        automaticLayout: true
    });
    const code = getCode();
    if (code) {
        editor.setValue(code);
        setTimeout(() => {
            runCode();
        }, 500);
    }
}

const runCode = () => {
    if (!editor || !previewRef || !previewRef.value) {
        ElMessage.error('editor not created');
        return;
    }
    const value = editor.getValue();
    const blob = new Blob([value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    (previewRef.value as any).src = url
}

const copyCode = () => {
    if (!editor) {
        ElMessage.error('editor not created');
        return;
    }
    const value = editor.getValue();
    if (!value) {
        return;
    }
    navigator.clipboard.writeText(value).then(() => {
        ElMessage.success('copy code Successful');
    }).catch(error => {
        ElMessage.error('copy code error');
        console.error(error);
    })
}

const shareUrl = () => {
    if (!editor) {
        ElMessage.error('editor not created');
        return;
    }
    const value = editor.getValue();
    if (!value) {
        return;
    }
    const url = createShareUrl(value);
    navigator.clipboard.writeText(url).then(() => {
        ElMessage.success('share url Successful');
    }).catch(error => {
        ElMessage.error('share url error');
        console.error(error);
    })
}

onMounted(() => {
    Split(['#editor-panel', '#preview-panel']);
    // https://github.com/suren-atoyan/monaco-loader
    loader.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' }
    });
    loader.init().then((monaco) => {
        createEditor(monaco);
    }).catch(() => {
        ElMessage.error('load monaco editor error');
    })
})

onUnmounted(() => {
    if (editor) {
        console.log('dispose editor');
        editor.dispose();
    }
})

</script>

<template>
    <div class="editor-container">
        <div id="editor-panel" class="editor-panel panel">
            <div class="tools">
                <button class="button" @click="runCode">Run</button>
                <button class="button" @click="copyCode">Copy</button>
                <button class="button" @click="shareUrl">Share</button>
            </div>
            <div ref="editorRef" class="editor-main"></div>
        </div>
        <div id="preview-panel" class="preview-panel panel">
            <iframe ref="previewRef" class="preview-result"></iframe>
        </div>
    </div>
</template>
<style scoped>
.editor-container {
    width: 100%;
    min-height: 900px;
    height: 900px;

    /* background-color: black; */
    display: flex;
}

.panel {
    width: 50%;
    height: 100%;
}

.tools {
    height: 30px;
    border-bottom: 1px solid #e9e9e9;
    text-align: right;

}

.editor-main {
    height: calc(100% - 30px);
}

.preview-result {
    width: 100%;
    height: 100%;
    border: none;
}

.button {
    background-color: var(--vp-c-brand-1);
    color: white;
    margin-right: 10px;
    padding: 0px 5px;
}
</style>
<style>
.split {
    display: flex;
    flex-direction: row;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>