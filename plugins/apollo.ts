export default defineNuxtPlugin((nuxtApp) => {
    // access cookie for auth
    const { githubToken } = useRuntimeConfig();
    nuxtApp.hook("apollo:auth", ({ client, token }) => {
        // apply apollo client token
        token.value = githubToken;
    });
});