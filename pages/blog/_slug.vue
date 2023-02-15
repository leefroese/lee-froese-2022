<template>
  <main>
    <TheHeader />
    <section class="[ container mx-auto ][ max-w-3xl ][ px-6 ]">
      <PostDate :date="post.createdAt" />
      <nuxt-content :document="post" />
    </section>
    <TheFooter />
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