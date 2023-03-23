import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '..'

export default defineNuxtConfig({
  runtimeConfig: {
    REDIS_URL: process.env.REDIS_URL
  },
  modules: [
    MyModule
  ],
  myModule: {
    addPlugin: true
  }
})
