<template>
    <time class="[ block text-xs text-gray-light mb-2 ]">{{ formatDate(date) }}</time>
</template>


<script>
export default {
  props: {
    date: String
  },
  methods: {
      formatDate(dateString) {
          const date = new Date(dateString);
              // Then specify how you want your dates to be formatted
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
      }
  }
}
</script>