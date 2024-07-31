<script setup>
// const { data: posts } = await useAsyncData('posts', () =>
//   queryContent('/blog').find()
// )
const { data: posts } = await useAsyncData('posts', async () => {
  const fetchedPosts = await queryContent('/blog').find()
  return fetchedPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
})
</script>

<template>
  <div class="text-gray-700">
    <h1 class="text-3xl my-8">Blog Posts</h1>

    I like to write about anything that I am currently working or something new that interests me.

    <section class="grid md:grid-cols-3 mt-8 gap-10">
        <Post :posts="posts" />
    </section>
  </div>
</template>