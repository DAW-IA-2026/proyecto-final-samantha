import { getLocalIp } from './src/utils/getLocalIp.js'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  srcDir: 'src/',
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/custom.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || `http://${getLocalIp()}:3001`
    }
  },
  tailwindcss: {
    configPath: '../tailwind.config.js'
  },
  app: {
    head: {
      title: 'Please, games are needy!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Organize your game backlog and crush it like a pro.' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  }
})
