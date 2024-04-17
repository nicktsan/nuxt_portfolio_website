<script setup>
const { data: posts } = await useAsyncData('latest-posts', () =>
    queryContent('/blog')
        .sort({ data: 1 })
        .limit(3)
        .find()
)
//   Programming Languages: C#, Java, Python, Typescript, Javascript, Go
const programmingLanguages = [
  { name: 'C#', icon: 'devicon:csharp' },
  { name: 'Java', icon: 'devicon:java' },
  { name: 'Python', icon: 'devicon:python' },
  { name: 'Typescript', icon: 'devicon:typescript' },
  { name: 'Javascript', icon: 'devicon:javascript' },
  { name: 'Go', icon: 'devicon:go-wordmark' },
]
// Technologies: Github, MySQL, Amazon Web Services, Docker, Terraform, React, NextJS, PostGreSQL, Kubernetes, HTML, CSS, Tailwind CSS, NuxtJS, GraphQL
const technologies = [
    { name: 'GitHub', icon: 'devicon:github' },
    { name: 'SQL', icon: 'devicon:mysql' },
    { name: 'Amazon Web Services', icon: 'devicon:amazonwebservices-wordmark' },
    { name: 'Docker', icon: 'devicon:docker' },
    { name: 'Terraform', icon: 'devicon:terraform' },
    { name: 'React', icon: 'devicon:react' },
    { name: 'NextJS', icon: 'devicon:nextjs' },
    { name: 'PostGreSQL', icon: 'devicon:postgresql' },
    { name: 'Kubernetes', icon: 'devicon:kubernetes' },
    { name: 'HTML', icon: 'devicon:html5' },
    { name: 'CSS', icon: 'devicon:css3' },
    { name: 'Tailwind CSS', icon: 'devicon:tailwindcss' },
    { name: 'Nuxt', icon: 'devicon:nuxtjs' },
    { name: 'GraphQL', icon: 'logos:graphql' },
]
</script>

<template>
    <section>
        <h1 class="text-5xl font-bold mt-20">Hello, I'm Nicholas Tsang!</h1>
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
    <h2 class="text-3xl font-bold mt-8">Programming Languages</h2>
    <div class="flex flex-row flex-wrap gap-4 my-2">
            <p v-for="programmingLanguage in programmingLanguages" :key="programmingLanguage.name" class="p-1 border-2 rounded-lg">
            <Icon :name="programmingLanguage.icon" size="1.5rem"/>
            {{ programmingLanguage.name }}
            </p>
    </div>
  </section>
  <section>
    <h2 class="text-3xl font-bold mt-8">Technologies</h2>
    <div class="flex flex-row flex-wrap gap-4 my-2">
            <p v-for="technology in technologies" :key="technology.name" class="p-1 border-2 rounded-lg">
            <Icon :name="technology.icon" size="1.5rem"/>
            {{ technology.name }}
            </p>
    </div>
  </section>
  <section>
    <h2 class="text-3xl font-bold mt-8">Latest Blog Posts</h2>
    <div class="grid md:grid-cols-3 pt-8 gap-10">
        <Post :posts="posts" />
    </div>
  </section>
</template>