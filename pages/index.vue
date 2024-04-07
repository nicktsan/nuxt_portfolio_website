<script setup>
const { data: posts } = await useAsyncData('latest-posts', () =>
    queryContent('/blog')
        .sort({ data: 1 })
        .limit(3)
        .find()
)
</script>

<template>
    <section>
        <h1 class="text-5xl font-bold mt-20">👋🏻 Hello, I'm Nicholas Tsang!</h1>
        <p class="text-base text-gray-900 p-2 italic">Software Developer</p>
    </section>
    <section class="flex flex-col md:flex-row">
    <div class="md:w-3/4">
        <h2 class="text-3xl font-bold mt-8">My Story</h2>
        <p class="text-lg py-2">
            With a solid foundation in quality assurance at Tata Consultancy Services, I bring a wealth of experience in 
            ensuring flawless software performance. My transition to software development stems from a deep-seated passion 
            for crafting innovative solutions that enrich user experiences. I possess the ability to adapt swiftly to any role 
            or project. I am eager to leverage my skills and drive in software development to embark on a new and fulfilling 
            career journey. Currently looking for software developer, software engineer, full stack developer, and back end 
            developer roles that use C#, Python, Java, Go, React, or Typescript.
        </p>
    </div>
    <img src="~/assets/images/grad pic crop.png" class="w-1/2 md:max-w-sm p-8 mx-auto" />
  </section>
  <section>
    <h2 class="text-3xl font-bold mt-8">Latest Blog Posts</h2>
    <div class="grid md:grid-cols-3 pt-8 gap-10">
        <Post :posts="posts" />
    </div>
  </section>
</template>