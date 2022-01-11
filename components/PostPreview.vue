<template>
  <li class="[ mt-5 ]">
    {{index}}
    <NuxtLink class="post-link" :to="`/blog/${post.slug}`">
      <PostDate :date="post.createdAt" />
      <h3 class="[ text-green-dark mb-1 ]">{{ post.title }}</h3>
      <p>{{ post.description }}</p>
      <ul v-if="post.tags" class="[ flex space-x-2 ][ mt-2 ][ text-xs text-gray-light ]">
        <li v-for="tag in post.tags" :key="tag">
          {{ tag }}
        </li>
      </ul>
    </NuxtLink>
  </li>
</template>


<script>
export default {
  props: {
    post: Object,
    index: Number
  }
}
</script>


<style lang="scss" scoped>

  .post-link {

    &:hover,
    &:focus {

      h3{
        color: theme('colors.white');

        &:before {
          transform: scaleY(1);
          background: theme('colors.green-dark');
        }
      }
    }

    &:visited:hover,
    &:visited:focus {
      h3 {
        color: theme('colors.white');
      }
    }

    h3 {
      display: inline-block;
      position: relative;

      &:before {
        transform-origin: bottom center;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        inset: 0;
        background: theme('colors.green-dark');
        pointer-events: none;
        transform: scaleY(0.03);
        transition: transform 120ms cubic-bezier(0.23, 1, 0.32, 1), background 120ms cubic-bezier(0.23, 1, 0.32, 1);
        z-index: -1;
      }
    }
  }
</style>