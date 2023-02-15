<template>
  <main>
    <TheHeader />
    <section class="[ container mx-auto ][ max-w-2xl ][ mb-16 px-6 ]">
      <h2 class="[ uppercase wide ]">About</h2>
      <p>I'm a designer turned developer with over 10 years experience working in agencies and freelancing. Currently, I'm the Director of Development at <a href="https://www.thehatcherylabs.com/">The Hatchery</a>. I'm available for the occasional <a href='mail&#116;&#111;&#58;h%65llo&#64;&#37;6C%&#54;5efroese&#46;%63&#111;&#109;'>freelance project</a> involving headless e-commerce or marketing websites using <a href="https://nuxtjs.org/" target="_blank" rel="noopener noreferrer">NuxtJS</a>, <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue.js</a>, <a href="https://prismic.io/" target="_blank" rel="noopener noreferrer">Prismic</a>, <a href="https://www.shopify.com/" target="_blank" rel="noopener noreferrer">Shopify</a>, <a href="https://wordpress.org/" target="_blank" rel="noopener noreferrer">WordPress</a>, and <a href="https://woocommerce.com/" target="_blank" rel="noopener noreferrer">WooCommerce</a>. My design and development skills allow me to build websites that look good, are performant, and&nbsp;accessible.</p>
      <p>When not at the computer, I enjoy hitting the road&nbsp;🏍️, getting outside&nbsp;⛺, and making&nbsp;things&nbsp;🧰&nbsp;🎵&nbsp;✏️.</p>
    </section>
    <section class="[ container mx-auto ][ max-w-2xl ][ px-6 ]">
      <h2 class="[ uppercase wide ]">Writing</h2>
      <ul class="">
        <PostPreview v-for="post in posts" :key="post.slug" :post="post"></PostPreview>
      </ul>
    </section>
    <TheFooter />
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
