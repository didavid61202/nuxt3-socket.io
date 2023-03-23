
<script setup lang="ts">
import { ref, useRealtimesocket } from '#imports'

const { realtimeSocket, connected, socketId } = useRealtimesocket({
  onMounted: () => {
    watchData()
  },
  onUnmount: () => {
    cleanup()
  }
}
)

const key = ref('testKey')
const dataValue = ref()

const watchKeyInput = ref('testKey')
const currentWatchKey = ref('')
const watchDataValue = ref()

const setData = () => {
  if (!connected.value) { return }
  console.log('setting data')
  realtimeSocket?.emit('set', { key: key.value, value: dataValue.value })
}

const cleanup = () => {
  realtimeSocket?.emit('unwatch', { key: currentWatchKey.value })
  realtimeSocket?.removeListener(`update:${currentWatchKey.value}`)
}

const watchData = () => {
  if (watchKeyInput.value === '') { return }

  cleanup()
  realtimeSocket?.emit('watch', { key: watchKeyInput.value })
  realtimeSocket?.on(`update:${watchKeyInput.value}`, (newData) => {
    console.log('new value: ', newData)
    watchDataValue.value = newData
  })

  currentWatchKey.value = watchKeyInput.value
}
</script>

<template>
  <div>
    <h1>Testing realtime database featrue</h1>
    <div>Connected: {{ connected }}</div>
    <div>ID: {{ socketId }}</div>
    <div>
      <input id="key" v-model="key" type="text" name="key" placeholder="key">
      <input
        id="dataValue"
        v-model="dataValue"
        type="text"
        name="dataValue"
        placeholder="dataValue"
        @keydown.enter="setData"
      >
      <button @click="setData">
        Set
      </button>
    </div>
    <div>
      <input id="watchKey" v-model="watchKeyInput" type="text" name="watchKey" placeholder="watchKey">
      <button @click="watchData">
        Watch data of the key
      </button>
      <div>Watched Data value: {{ watchDataValue }}</div>
    </div>
  </div>
</template>
