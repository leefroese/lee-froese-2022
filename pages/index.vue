<template>
  <main>
    <TheHeader />
    <section class="[ container mx-auto ][ max-w-lg ][ mb-16 ]">
      <h2>About</h2>
      <p>I'm a designer turned developer with over 10 years experience working in agencies and freelancing. Currently, I'm the Director of Development at <a href="https://www.thehatcherylabs.com/">The Hatchery</a>. My design and development skills allow me to build websites that look good, are performant, and accessible.</p>
      <p>When not at the computer, I enjoy hitting the road&nbsp;🏍️, getting outside&nbsp;⛺, and making things&nbsp;🧰.</p>
    </section>
    <section class="[ container mx-auto ][ max-w-lg ]">
      <h2>Writing</h2>
      <ul class="">
        <PostPreview v-for="post in posts" :key="post.slug" :post="post"></PostPreview>
      </ul>
    </section>
  </main>
</template>

<script>
export default {
  name: 'IndexPage',
  async asyncData({ $content }) {
    const posts = await $content()
      .only(['title', 'description', 'tags', 'slug', 'createdAt'])
      .sortBy('createdAt', 'desc')
      .fetch()
    return {
      posts,
    }
  },
}
</script>
