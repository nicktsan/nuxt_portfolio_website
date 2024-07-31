<script setup>
const { path } = useRoute();

const { data } = await useAsyncData(`content-${path}`, () => {
  return queryContent()
    .where({ _path: path })
    .findOne()
})

// Format the date
const formattedDate = computed(() => {
  if (data.value && data.value.date) {
    return new Date(data.value.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  return ''
})
</script>
<!-- <template>
    <ContentRenderer :value="data" class="prose my-10 mx-auto max-w-7xl text-justify [&_img]:mx-auto [&_img]:block" />
    <div class="my-8">
      <a v-for="tag in data.tags " :key="tag" :href="`/blog/tags/${tag}`"
          class="text-sm font-semibold inline-block py-2 px-4 rounded-lg text-gray-100 bg-blue-500 uppercase last:mr-0 mr-4">
          <Icon name="pajamas:label" size="1.5rem" class="text-gray-100 mr-2" /> {{ tag }}
      </a>
    </div>
</template> -->
<template>
  <article class="my-10 mx-auto max-w-7xl">
    <!-- Blog header -->
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-2">{{ data.title }}</h1>
      <time :datetime="data.date" class="text-gray-500">{{ formattedDate }}</time>
    </header>

    <!-- Blog content -->
    <ContentRenderer :value="data" class="prose my-10 mx-auto max-w-7xl text-justify [&_img]:mx-auto [&_img]:block" />

    <!-- Tags -->
    <div class="my-8">
      <a v-for="tag in data.tags" :key="tag" :href="`/blog/tags/${tag}`"
        class="text-sm font-semibold inline-block py-2 px-4 rounded-lg text-gray-100 bg-blue-500 uppercase last:mr-0 mr-4">
        <Icon name="pajamas:label" size="1.5rem" class="text-gray-100 mr-2" /> {{ tag }}
      </a>
    </div>
  </article>
</template>