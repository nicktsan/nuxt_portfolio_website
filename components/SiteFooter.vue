<script setup>
const links = [
  { name: 'GitHub', href: 'https://github.com/nicktsan', icon: 'entypo-social:github-with-circle' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/nicholas-manhay-tsang/', icon: 'entypo-social:linkedin-with-circle' }
]
</script>

<template>
  <footer class="bg-sky-800 mt-6">
    <section class="mx-auto max-w-7xl px-2 sm:px-4 lg:py-5 text-white flex flex-row">
      <p class="flex-1 my-2">&copy; Nicholas Tsang 2024. All Rights Reserved</p>
      <div class="flex flex-row justify-center gap-4 my-2">
        <a v-for="link in links" :key="link.name" :href="link.href">
          <Icon :name="link.icon" size="1.5rem" class="text-white" />
        </a>
      </div>
    </section>
  </footer>
</template>