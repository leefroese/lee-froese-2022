<template>
  <main>
    <TheHeader />
    <section class="[ container mx-auto ][ max-w-lg ]">
      <PostDate :date="post.createdAt" />
      <nuxt-content :document="post" />
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    console.log(params)
    const post = await $content(params.slug).fetch()
    return { post }
  },
}
</script>