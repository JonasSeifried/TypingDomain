<script setup>
import { onMounted, ref } from 'vue'
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import { state, socket } from '@/socket'

const currentWord = ref('')
const typedText = ref('')
const textField = ref(null)
const wholeText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

function onKeyDown(payload) {
  console.log(`onKeyDown: '${payload.key}'`)
  if (payload.key !== 'Enter' && payload.key !== ' ') {
    return
  }
  payload.preventDefault()
  typedText.value += currentWord.value + (payload.key === 'Enter' ? '\n' : payload.key)
  socket.timeout(5000).emit('input', typedText.value, (err, response) => {
    if (err) {
      console.error(err)
      return
    }
    typedText.value = response
  })
  console.log(textField.value.innerHtml)
  currentWord.value = ''
}

onMounted(() => {
  console.log(state.fooEvents)
})
</script>

<template>
  <h1>Connected: {{ state.connected }}</h1>
  <h2>{{ typedText }}</h2>
  <p ref="textField">{{ wholeText }}</p>
  <input v-model="currentWord" @keydown="onKeyDown" />
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Vue’s
    <a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a>
    provides you with all information you need to get started.
  </WelcomeItem>
</template>
