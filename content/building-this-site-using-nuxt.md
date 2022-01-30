---
title: Building This Site Using Nuxt Part 1
description: 'A simple markdown blog using new to me technology.'
tags:
  - Nuxt
  - Vue
  - Markdown
---

# Building This Site Using Nuxt Part 1

I've been wanting to re-build my website for the past couple of months. My previous website a simple landing page with some links to freelance client websites and my day job. As I've dialed back my freelancing, the site no longer suited my needs. Instead, I wanted to start writing and sharing some of my experiences as a web developer.

## Deciding on Nuxt

I knew I wanted a simple markdown blog using something I never had done before. I've used Jekyll in the past and liked it. I'd recently built a new site for the agency I work at using Next.js. I thought, "why not try Vue's framework called Nuxt.js".

## Getting Started

Being completely new to Vue and Nuxt, I did some Googling and followed these articles for the most part with a few differences:

- [Creating a Blog with Nuxt Content](https://nuxtjs.org/tutorials/creating-blog-with-nuxt-content/)
- [Building Your Own Blog with Nuxt and Tailwind](https://blog.openreplay.com/building-your-own-blog-with-nuxt-content-and-tailwind)

With [NodeJS](https://nodejs.org/en/) already installed, I started by running `npx create-nuxt-app blog-name`.

You will be presented with a number of configuration options. Here are the choices I made:

- Project name: Lee Froese 2022
- Programming language: JavaScript
- Package manager: NPM
- UI framework: Tailwind
- Nuxt.js modules: Content - Git-based headless CMS
- Linting tools: Prettier
- Testing framework: None
- Rendering mode: Universal (SSR / SSG)
- Deployment target: Static (Jamstack Hosting)
- Continuous integration: None
- Version control system: Git

Once installation is finished, `cd` into the project directory and run `npm run dev`. This will load a local development server in which you can view your website at `localhost:3000`.

## Tailwind Setup

I found some additional configuration was necessary after selecting Tailwind as my UI framework during the project installation. I followed the guide from [Tailwind on Nuxt installation](https://tailwindcss.com/docs/guides/nuxtjs). I had to run the following to install PostCSS and AutoPrefixr:
`npm install -D postcss@latest autoprefixer@latest @nuxt/postcss8`

Next, I created the `tailwind.config.js` for my project by running `npx tailwindcss init`. Then, you're required to enable the `@nuxt/postcss8` plugin in the `nuxt.config.js` file.

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxt/postcss8',
  ],
}
```

The PostCSS object including `tailwindcss` and `autoprefixer` then needs to be added to the build configuration in the `nuxt.config.js` file.

```js
// nuxt.config.js
export default {
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  }
}
```

Next, within the `tailwind.config.js`, the template paths for the project need to be added.

```js
// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create the folder structure `assets/css/` in the root of your project, and then create a `main.css` file that lives inside the `css` folder. Add the Tailwind directives to the file. You can also add any global styles here.

```css
// assets/css/main.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add your CSS file to the project by updating the `nuxt.config.js` file with the `css` object.

```js
// nuxt.config.js
export default {
  css: [
    '@/assets/css/main.css',
  ],
}
```

Lastly, I customized the Tailwind theme in the `tailwind.config.js` file to include my colors and fonts.

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      'green': '#00b28d',
      'green-dark': '#009072',
      'gray': '#555351',
      'gray-dark': '#323130',
      'gray-light': '#807d7b',
      'white': '#f0f1f7',
      'black': '#000000'
    },
    fontFamily: {
      sans: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Open Sans', 'Helvetica Neue', 'sans-serif']
    },
    extend: {},
  }
}
```

## Blog Setup

As I decided on using `@nuxt/content` to fetch markdown files, I created the `content/` directory and a markdown file in my application next. Here's what my markdown blog posts look like currently.

```markdown
---
title: Blog Post
description: 'Blog post description content.'
tags:
  - Tag 1
  - Tag 2
---

# Blog Post

Text content...
```


## Displaying Blog Posts

There are two ways in which I want to display blog posts on my site, the first is with a listing of blog posts excerpts on my home page, and the second is the individual blog posts.

### Listing Posts on the Home Page

In the `pages/` folder, the `index.vue` file is your home page file. To [fetch](https://content.nuxtjs.org/fetching/) the blog post data, we can use `asyncData` which will grab data before the page has been rendered. We can also use the global `$content` variable that is injected by the `@nuxt/content` package. Then, we can define what content or fields we want to get for each posts using the `.only()` [method](https://content.nuxtjs.org/fetching/#onlykeys). Lastly, we want to sort the posts by the most recent using the `.sortBy()` [method](https://content.nuxtjs.org/fetching/#sortbykey-direction).

```js
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
```

Next, I created a component called `PostPreview` and inserted it into my `index.vue` file and looped over my fetched posts using `v-for`.

```vue
<PostPreview v-for="post in posts" :key="post.slug" :post="post"></PostPreview>
```

My `PostPreview` component makes use of the built in `NuxtLink` component to link to each blog post. It also contains a `PostDate` component that formats dates into a more readable format. Here is my `PostPreview` component.

```vue
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
```

And here is my `PostDate` component that makes use of `Intl.DateTimeFormt()` for formatting the date.

```vue
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
```

### Individual Blog Posts

To display the individual blog posts on a page, we can use dynamic pages in Nuxt. To get started, create the `pages/blog/` folder and add a file called `_slug.vue` in the folder. Again, we can use `asyncData` and the global `$content` variable to fetch the blog post. This time, we will also use the `params.slug` variable to tell the application which blog post to fetch based on the URL slug.

```js
export default {
  async asyncData({ $content, params }) {
    const post = await $content(params.slug).fetch()
    return { post }
  },
}
```

The HTML markup for my blog posts is fairly simple and uses my `PostDate` component to format the date again. I'm also using using the `nuxt-content` [component](https://content.nuxtjs.org/displaying) to display the body content of my posts.

```vue
<template>
  <main>
    <TheHeader />
    <section class="[ container mx-auto ][ max-w-2xl ][ px-6 ]">
      <PostDate :date="post.createdAt" />
      <nuxt-content :document="post" />
    </section>
  </main>
</template>
```

Hope this helps or is useful!