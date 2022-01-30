<template>
  <main>
    <TheHeader />
    <section class="[ container mx-auto ][ max-w-2xl ][ px-6 ]">
      <PostDate :date="post.createdAt" />
      <nuxt-content :document="post" />
    </section>
  </main>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const post = await $content(params.slug).fetch()
    return { post }
  },
}
</script>