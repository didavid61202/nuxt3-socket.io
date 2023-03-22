<script setup lang="ts">
import { onMounted, ref, useSocket } from '#imports'

const socket = useSocket()

const connected = ref(false)

const socketId = ref()
const msg = ref()
const to = ref()

const sendMessage = ()=>{
    socket.emit('message',{msg:msg.value, to:to.value})
    msg.value = ''
}

const messages = ref<string[]>([])



onMounted(() => {
  socket.on('connect', () => {
    connected.value = socket.connected
    socketId.value = socket.id
  })

  socket.on('disconnect', () => {
    connected.value = socket.connected
  })

  socket.on('newMessage',(newMessage:string) =>{
  messages.value.push(newMessage)
})
})
</script>

<template>
  <div>
    <div>Connected: {{ connected }}</div>
    <div>ID: {{ socketId }}</div>
    <input v-model="msg" type="text" name="message" id="messgae" placeholder="message" @keyup.enter="sendMessage">
    <input v-model="to" type="text" name="to" id="to" placeholder="to">
<button @click="sendMessage">Send Message</button>
<ul>
  <li v-for="message in messages" :key="message">
  {{message}}
  </li>
</ul>
  </div>
</template>
