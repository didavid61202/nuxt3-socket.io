import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '..'

export default defineNuxtConfig({
  runtimeConfig: {
    REDIS_URL: process.env.REDIS_URL
  },
  modules: [
    MyModule
  ],
  socket: {
    addPlugin: true,
    serverOptions: {
      cors: {
        origin: ['http://localhost:3000/', 'https://admin.socket.io', process.env.RAILWAY_HOST_URL],
        credentials: true
      }
    }
  }
})
