// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxt/content',
    '@nuxtjs/apollo'
  ],
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    public: {
      WEBTHREEFORM_PUBLIC_ACCESS_KEY: process.env.WEBTHREEFORM_PUBLIC_ACCESS_KEY
    },
  },
  content: {
    highlight: {
      theme: 'nord',
      preload: ['ts', 'js', 'css', 'json', 'bash', 'vue']
    }
  },
  apollo: {
    clients: {
      default: {
        tokenName: 'github-token',
        httpEndpoint: 'https://api.github.com/graphql'
      }
    },
  },
})