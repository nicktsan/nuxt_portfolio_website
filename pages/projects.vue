<script setup>
const repoNames = ["movies_frontend_nextjs", "cookie_run_tcg_discord_bot", "nuxt_portfolio_website"]
//Create a query string that will issue multiple queries that search for github repositories with names in repoNames.
var queryStr = `
query{ 
`
for (let i = 0; i < repoNames.length; i++) {
  queryStr += `query${i}: viewer {
    repository(name: "${repoNames[i]}") {
      id
      name
      createdAt
      description
      url
      forks {
        totalCount
      }
      watchers {
        totalCount
      }
      stargazers {
        totalCount
      }
    }
  }
  `
}
queryStr += `}`
// console.log(queryStr)
//covert the queryStr to gql
const query = gql(queryStr);

const { data, error } = await useAsyncQuery(query);
// console.log(data);
// console.log(error);

const projects = ref([
  {
    id: 1,
    title: "Roshi.ai",
    description: "An innovative AI-powered platform that streamlines lesson planning by enabling teachers to create custom, interactive learning materials in just a few clicks. With Roshi.ai, educators can effortlessly generate fully voiced dialogues, engaging visuals, and targeted activities—all tailored to specific criteria like CLB—saving over 4 hours of work per week. Simply describe your desired content using intuitive prompts, let the AI do the heavy lifting, and then share your interactive lessons seamlessly across platforms like Moodle and Google Classroom.",
    // image: "/placeholder.svg?height=400&width=600",
    // technologies: ["Vue.js", "Node.js", "MongoDB"],
    link: "https://www.roshi.ai/",
    employer: "Roshi Technologies Inc.",
    linkText: "View Website"
  }
]);
</script>

<template>
  <h1 class="text-3xl my-8 text-gray-700">Projects</h1>
  <p class="text-lg mb-8 text-gray-700">Here are some of my projects on GitHub.</p>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-10 ">
    <div v-for="(query, queryKey) in data" :key="queryKey"
      class="flex flex-col h-full p-8 border-4 my-4 rounded-lg hover:bg-gray-50">
        <a :href="query.repository.url" target="_blank">
          <h2 class="text-2xl text-purple-800 font-semibold mb-2 hover:underline">{{ query.repository.name }}</h2>
        </a>
        <p class="text-gray-700">{{ query.repository.description }}</p>
      <div class="mt-auto text-gray-700">
        <Icon name="fontisto:star" size="1.1rem" class="text-purple-700" /> Stars: {{ query.repository.stargazers.totalCount }}
        <Icon name="system-uicons:branch" size="1.1rem" class="text-purple-800" /> Forks: {{ query.repository.forks.totalCount }}
        <Icon name="system-uicons:eye" size="1.1rem" class="text-purple-700" /> Watchers: {{
          query.repository.watchers.totalCount }}
      </div>
    </div>
  </section>
  <p class="text-lg my-8 text-gray-700">Employer projects</p>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-10 ">
    <div v-for="project in projects" :key="project.id" class="flex flex-col h-full p-8 border-4 my-4 rounded-lg hover:bg-gray-50">
      <a :href="project.link" target="_blank">
        <h2 class="text-2xl text-purple-800 font-semibold mb-2 hover:underline">{{ project.title }}</h2>
      </a>
      <p class="text-gray-700">{{ project.description }}</p>
      <div class="flex flex-wrap gap-2 mb-4">
        <span v-for="tech in project.technologies" :key="tech" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ tech }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <p v-if="project.employer" class="text-sm text-gray-500">
          Developed at {{ project.employer }}
        </p>
        
        <!-- <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer" class="text-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {{ project.linkText || 'View Project' }}
          <ExternalLinkIcon class="ml-2 -mr-0.5 h-4 w-4" />
        </a> -->
      </div>
    </div>
  </section>
</template>