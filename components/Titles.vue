<template>
  <ol class="titles [ list-none leading-4 mb-0 ]" ref="titles">
    <li><span>Geocities</span><span class="sr-only"> &amp; </span><span>Flash</span><span>&nbsp;Builder</span></li>
    <li><span>Graphic</span><span class="sr-only"> &amp; </span><span>Interaction</span><span>&nbsp;Designer</span></li>
    <li><span>Front-end</span><span class="sr-only"> &amp; </span><span>Web</span><span>&nbsp;Developer</span></li>
  </ol>
</template>

<script>
import anime from 'animejs';

export default {
  props: {
  },
  methods: {
    animateTitles(){

      const titlesTL = anime.timeline({
        easing: 'linear',
        duration: 500
      });

      titlesTL.add({
        targets: [this.$refs.titles.children[0].children[0], this.$refs.titles.children[0].children[3] ],
        opacity: 1,
        duratiion: 1
      });

      const titlesLength = 3

      for (let i = 1; i <= titlesLength; i++) {
        const index = i - 1;
        titlesTL.add({
          targets: this.$refs.titles.children[index],
          maxWidth: '100%',
          duratiion: 1
        });
        titlesTL.add({
          targets: this.$refs.titles.children[index].children[0],
          maxWidth: '100%'
        });
        titlesTL.add({
          targets: this.$refs.titles.children[index].children[3],
          maxWidth: '100%'
        });
        titlesTL.add({
          targets: this.$refs.titles.children[index].children[0],
          maxWidth: '0%',
          duration: 750
        });
        titlesTL.add({
          targets: this.$refs.titles.children[index].children[2],
          maxWidth: '100%',
          duration: 750
        });
        if( i < titlesLength ) {
          titlesTL.add({
            targets: this.$refs.titles.children[index],
            maxWidth: '0%'
          });
        }
      }
    }
  },
  mounted() {
    this.animateTitles()
  }
}
</script>

<style lang="scss" scoped>
  .titles {
    display: flex;
    li {
      overflow: hidden;
      position: relative;
      white-space: nowrap;

      &:first-child {
        span {
          &:nth-child(1),
          &:nth-child(4) {
            opacity: 0;
            max-width: 100%;
          }
        }
      }
    }
    span {
      display: inline-block;
      overflow: hidden;
      position: relative;
      max-width: 0;

      &:not(.sr-only) {
        padding: 0 1px;
      }
    }
  }
</style>