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
</template>